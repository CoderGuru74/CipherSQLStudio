import React, { useState } from 'react';

interface QuestionPanelProps {
  question: string;
  requirements: string[];
  assignmentId: string;
}

const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  requirements,
  assignmentId
}) => {
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState<boolean>(false);
  const [hintCooldown, setHintCooldown] = useState<number>(0);

  const handleGetHint = async () => {
    if (loadingHint || hintCooldown > 0) return;

    setLoadingHint(true);
    try {
      // Mock API call - in real app, this would call the backend LLM service
      setTimeout(() => {
        const mockHints: Record<string, string> = {
          '1': 'Think about using a WHERE clause to filter the results. You\'ll need to combine multiple conditions using AND. Consider how you might order the results to make them more meaningful.',
          '2': 'When joining tables, think about which table should be on the left and which should be on the right. A LEFT JOIN ensures you get all records from the left table even if there\'s no match in the right table.'
        };
        
        const hintText = mockHints[assignmentId] || 'Consider the structure of your tables and how they relate to each other. Think about which columns you need to select and how you can filter or join the data effectively.';
        
        setHint(hintText);
        setLoadingHint(false);
        
        // Set cooldown for 30 seconds
        setHintCooldown(30);
        const cooldownInterval = setInterval(() => {
          setHintCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(cooldownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 2000);
    } catch (error) {
      console.error('Error getting hint:', error);
      setLoadingHint(false);
    }
  };

  return (
    <div className="question-panel">
      <div className="question-panel__content">
        <div className="question-panel__description">
          <h4>Problem</h4>
          <p>{question}</p>
        </div>

        {requirements.length > 0 && (
          <div className="question-panel__requirements">
            <h5 className="question-panel__requirements-title">Requirements</h5>
            <ul className="question-panel__requirements-list">
              {requirements.map((requirement, index) => (
                <li key={index} className="question-panel__requirement">
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="question-panel__hints">
          <button
            className="question-panel__hint-button"
            onClick={handleGetHint}
            disabled={loadingHint || hintCooldown > 0}
          >
            {loadingHint ? (
              <div className="hint-button__loading">
                <div className="hint-button__spinner"></div>
                <span>Getting hint...</span>
              </div>
            ) : hintCooldown > 0 ? (
              <div className="hint-button__cooldown">
                <span>Get Hint</span>
                <span className="hint-button__remaining">({hintCooldown}s)</span>
              </div>
            ) : (
              <>
                <span className="hint-button__icon">💡</span>
                <span className="hint-button__text">Get Hint</span>
              </>
            )}
          </button>

          {hint && (
            <div className="hint-content">
              <button
                className="hint-content__close-button"
                onClick={() => setHint(null)}
              >
                ×
              </button>
              <div className="hint-content__text">{hint}</div>
              <div className="hint-content__keywords">
                <span className="hint-content__keyword">WHERE</span>
                <span className="hint-content__keyword">AND</span>
                <span className="hint-content__keyword">ORDER BY</span>
              </div>
              <div className="hint-content__attribution">
                AI-powered hint • Use wisely to maximize learning
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
