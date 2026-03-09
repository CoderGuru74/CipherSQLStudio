import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// LLM API configuration
const getLLMConfig = () => ({
  provider: process.env.LLM_PROVIDER || 'gemini',
  apiKey: process.env.LLM_API_KEY || '',
  baseUrl: process.env.LLM_BASE_URL || '',
  model: process.env.LLM_MODEL || 'gemini-pro',
});

// System prompt for hint generation - CRITICAL for security
const SYSTEM_PROMPT = `You are an expert SQL tutor helping students learn SQL. Your role is to provide conceptual hints that guide students toward the solution without giving them the exact answer.

CRITICAL RULES:
1. NEVER provide the complete SQL query or direct solution
2. NEVER give away the exact syntax or table/column names
3. Focus on CONCEPTUAL guidance and SQL keywords they should consider
4. Suggest SQL concepts like JOIN, WHERE, GROUP BY, ORDER BY, etc.
5. Explain the LOGIC behind what they need to do
6. Keep hints concise but helpful
7. Use analogies when helpful

Example good hint: "Think about how you might filter data based on multiple conditions. You might need to combine conditions using logical operators."

Example bad hint: "Use SELECT * FROM employees WHERE department = 'Engineering' AND salary > 70000;"

Respond with a helpful, conceptual hint that guides learning without giving the answer.`;

// POST /api/hints/generate - Generate AI-powered hint
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { question, requirements, assignmentId, userQuery } = req.body;
    
    if (!question || !requirements) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Question and requirements are required',
      });
    }
    
    const config = getLLMConfig();
    
    if (!config.apiKey) {
      // Fallback to predefined hints if no API key is configured
      const fallbackHints: Record<string, string> = {
        '1': 'Think about using a WHERE clause to filter the results. You\'ll need to combine multiple conditions using AND. Consider how you might order the results to make them more meaningful.',
        '2': 'When joining tables, think about which table should be on the left and which should be on the right. A LEFT JOIN ensures you get all records from the left table even if there\'s no match in the right table.',
      };
      
      const hint = fallbackHints[assignmentId] || 
        'Consider the structure of your tables and how they relate to each other. Think about which columns you need to select and how you can filter or join data effectively.';
      
      return res.json({
        hint,
        source: 'fallback',
        assignmentId,
      });
    }
    
    // Prepare the prompt for the LLM
    const userPrompt = `
Assignment Question: ${question}

Requirements:
${requirements.map((req: string, index: number) => `${index + 1}. ${req}`).join('\n')}

${userQuery ? `Current student query: ${userQuery}` : ''}

Provide a conceptual hint that helps the student solve this problem without giving them the exact answer.`;
    
    let hint = '';
    let source = 'unknown';
    
    try {
      if (config.provider === 'gemini') {
        // Google Gemini API call
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
          {
            contents: [
              {
                parts: [
                  { text: SYSTEM_PROMPT },
                  { text: userPrompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );
        
        hint = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
               'Unable to generate hint at this time. Please try again.';
        source = 'gemini';
        
      } else if (config.provider === 'openai') {
        // OpenAI API call
        const response = await axios.post(
          `${config.baseUrl || 'https://api.openai.com/v1'}/chat/completions`,
          {
            model: config.model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 200,
            temperature: 0.7,
          },
          {
            headers: {
              'Authorization': `Bearer ${config.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );
        
        hint = response.data.choices?.[0]?.message?.content || 
               'Unable to generate hint at this time. Please try again.';
        source = 'openai';
      }
      
      // Validate the hint to ensure it doesn't contain SQL solutions
      const sqlKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY'];
      const containsSQL = sqlKeywords.some(keyword => 
        hint.toUpperCase().includes(keyword) && 
        hint.includes(';')
      );
      
      if (containsSQL) {
        hint = 'Think about the concepts behind SQL queries. Consider what operations you need to perform on the data to get the desired result.';
        source = 'sanitized';
      }
      
      res.json({
        hint: hint.trim(),
        source,
        assignmentId,
      });
      
    } catch (apiError: any) {
      console.error('LLM API Error:', {
        provider: config.provider,
        error: apiError.message,
        status: apiError.response?.status,
        assignmentId,
      });
      
      // Return a generic hint if API fails
      const genericHint = 'Consider breaking down the problem into smaller steps. What data do you need to select? How should you filter or join it?';
      
      res.json({
        hint: genericHint,
        source: 'fallback',
        assignmentId,
      });
    }
    
  } catch (error: any) {
    console.error('Hint generation error:', error);
    res.status(500).json({
      error: 'Failed to generate hint',
      message: error.message,
    });
  }
});

// GET /api/hints/config - Get hint system configuration
router.get('/config', (req: Request, res: Response) => {
  const config = getLLMConfig();
  
  res.json({
    provider: config.provider,
    model: config.model,
    hasApiKey: !!config.apiKey,
    systemPrompt: SYSTEM_PROMPT,
  });
});

// Rate limiting for hint generation
const hintAttempts = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (identifier: string): { allowed: boolean; resetIn?: number } => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxAttempts = 3; // Max 3 hints per minute
  
  const attempts = hintAttempts.get(identifier);
  
  if (!attempts || now > attempts.resetTime) {
    hintAttempts.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true };
  }
  
  if (attempts.count >= maxAttempts) {
    return { 
      allowed: false, 
      resetIn: Math.ceil((attempts.resetTime - now) / 1000) 
    };
  }
  
  attempts.count++;
  return { allowed: true };
};

// Middleware to check rate limits
router.use('/generate', (req: Request, res: Response, next) => {
  const identifier = req.ip || 'unknown';
  const rateLimit = checkRateLimit(identifier);
  
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Too many hint requests',
      message: `Please wait ${rateLimit.resetIn} seconds before requesting another hint`,
      resetIn: rateLimit.resetIn,
    });
  }
  
  next();
});

export default router;
