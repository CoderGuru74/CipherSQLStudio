# CipherSQL Studio

A comprehensive browser-based SQL learning platform that helps users master SQL through hands-on practice with real-world scenarios.

## 🚀 Features

- **Interactive SQL Learning**: Practice with carefully crafted assignments from basic to advanced
- **Monaco Editor Integration**: Professional code editor with SQL syntax highlighting and autocomplete
- **Real-time Query Execution**: Run SQL queries against a secure PostgreSQL sandbox
- **AI-Powered Hints**: Get conceptual guidance from LLMs without giving away solutions
- **Schema Visualization**: Interactive database schema viewer with sample data
- **Progress Tracking**: Monitor your learning journey and success rates
- **Responsive Design**: Premium dark theme UI that works seamlessly on all devices

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- **React.js** with TypeScript for component-based architecture
- **Vite** for lightning-fast development and building
- **SCSS** with BEM methodology and 12-column grid system
- **Monaco Editor** for professional SQL editing experience
- **Axios** for API communication

**Backend:**
- **Node.js/Express.js** for robust API server
- **PostgreSQL** as the SQL execution sandbox (read-only access)
- **MongoDB** for persisting assignments and user attempts
- **TypeScript** for type-safe development

### Security Features

- **Read-Only Database Access**: PostgreSQL user with restricted permissions
- **Query Validation**: Comprehensive SQL injection prevention
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Helmet.js**: Security headers and CSP

## 📁 Project Structure

```
CipherSQLStudioAssignment/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/         # SCSS stylesheets
│   │   │   ├── _variables.scss
│   │   │   ├── _mixins.scss
│   │   │   ├── _base.scss
│   │   │   └── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   │   ├── assignments.ts
│   │   │   ├── sql.ts
│   │   │   └── hints.ts
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CipherSQLStudioAssignment
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database and API configurations
npm run dev
```

The backend API will be available at `http://localhost:5000`

### 4. Database Setup

#### PostgreSQL Setup

Create a read-only user for SQL execution:

```sql
-- Create main database
CREATE DATABASE ciphersql_studio;

-- Create read-only user
CREATE USER ciphersql_readonly WITH PASSWORD 'readonly_password';

-- Grant read-only access
GRANT CONNECT ON DATABASE ciphersql_studio TO ciphersql_readonly;
GRANT USAGE ON SCHEMA public TO ciphersql_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ciphersql_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO ciphersql_readonly;
```

#### MongoDB Setup

```bash
# Start MongoDB service
sudo systemctl start mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. LLM Integration (Optional)

For AI-powered hints, configure your preferred LLM provider:

**Google Gemini:**
1. Get API key from [Google AI Studio](https://aistudio.google.com/)
2. Set `LLM_PROVIDER=gemini` in backend .env
3. Add your API key to `LLM_API_KEY`

**OpenAI:**
1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Set `LLM_PROVIDER=openai` in backend .env
3. Add your API key to `LLM_API_KEY`

## 🎯 Usage

### For Learners

1. **Browse Assignments**: View available SQL challenges organized by difficulty
2. **Select Assignment**: Choose a problem that matches your skill level
3. **Study Schema**: Examine table structures and sample data
4. **Write Queries**: Use the Monaco editor to craft your SQL solution
5. **Test & Iterate**: Run queries and see results immediately
6. **Get Hints**: Stuck? Request AI-powered conceptual guidance
7. **Track Progress**: Monitor your completion rate and improvement

### For Educators

1. **Create Assignments**: Define problems with requirements and sample data
2. **Set Difficulty**: Classify assignments as Easy, Medium, or Hard
3. **Monitor Progress**: Track student performance and common mistakes
4. **Customize Hints**: Adjust AI prompt engineering for your curriculum

## 🔒 Security Considerations

### SQL Execution Safety

- **Read-Only Database**: All queries execute with a restricted PostgreSQL user
- **Query Validation**: Comprehensive checks for dangerous SQL keywords
- **Statement Limitation**: Only SELECT and WITH (CTE) queries allowed
- **Pattern Detection**: Blocks suspicious SQL patterns and comments

### API Security

- **Rate Limiting**: Configurable limits per IP address
- **CORS Protection**: Strict cross-origin policies
- **Input Validation**: Comprehensive request sanitization
- **Security Headers**: Helmet.js for protection against common vulnerabilities

## 🎨 UI/UX Features

### Responsive Design

- **Mobile-First**: Optimized for 320px and up
- **Breakpoints**: 320px, 641px, 1024px, 1281px
- **Grid System**: 12-column SCSS-based layout
- **Touch-Friendly**: Large tap targets and gestures

### Dark Theme

- **Professional Aesthetics**: Slate-900 backgrounds with Emerald accents
- **High Contrast**: Excellent readability in all lighting conditions
- **Reduced Eye Strain**: Comfortable for extended learning sessions
- **Modern Design**: Clean, minimalist interface

## 📊 API Endpoints

### Assignments
- `GET /api/assignments` - List all assignments
- `GET /api/assignments/:id` - Get specific assignment
- `POST /api/assignments/:id/attempt` - Record attempt

### SQL Execution
- `POST /api/sql/execute` - Execute SQL query
- `GET /api/sql/schema` - Get database schema
- `GET /api/sql/health` - Database health check

### Hints
- `POST /api/hints/generate` - Generate AI hint
- `GET /api/hints/config` - Get hint system config

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# Integration tests
npm run test:integration
```

## 📈 Performance

### Frontend Optimization
- **Code Splitting**: Lazy loading for better initial load times
- **Tree Shaking**: Eliminates unused code
- **SCSS Optimization**: Efficient CSS generation
- **Asset Compression**: Optimized images and fonts

### Backend Performance
- **Connection Pooling**: Efficient database connections
- **Query Caching**: Redis for frequently accessed data
- **Compression**: Gzip for API responses
- **Monitoring**: Built-in health checks and metrics

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting platform
```

### Backend (Docker)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables

Configure all environment variables from `.env.example` files for your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- **TypeScript**: All new code must be typed
- **SCSS**: Follow BEM naming conventions
- **Testing**: Include tests for new features
- **Documentation**: Update README and code comments
- **Security**: Consider security implications

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor**: For the excellent code editing experience
- **PostgreSQL**: Robust relational database
- **Express.js**: Minimalist web framework
- **React**: Component-based UI library
- **SCSS**: Powerful CSS preprocessor

## 📞 Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@ciphersqlstudio.com

---

**Happy Learning! 🎓**
