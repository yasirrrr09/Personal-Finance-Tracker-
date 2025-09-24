# 📊 Personal Finance Tracker+ — Personal Finance Tracker
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Built With](https://img.shields.io/badge/Built%20with-MERN%20Stack-blue)
 #### Personal Finance Tracker+ is a full-stack personal finance tracker designed to help users manage their income, expenses, and budgets in a simple yet powerful way. The platform provides a real-time overview of financial health through dashboards, interactive charts, and category-wise transaction tracking. Users can easily add, edit, and delete transactions, set budget goals, and analyze spending patterns, all from a single intuitive interface.
---
## 🚀 Features
- 🔐 **User Authentication** — Secure login and signup with JWT  
- 💰 **Track Income & Expenses** — Log and categorize your transactions  
- 🎯 **Set Budget Goals** — Define monthly limits by category  
- 📊 **Real-time Charts** — Visualize data with Pie & Doughnut graphs  
- 🧾 **Filter by Category** — Deep dive into specific spending areas  
- ⏰ **Reminders** — Add upcoming or recurring transactions  
- 📱 **Responsive Design** — Mobile-first UI with Tailwind CSS
- 🤖 **AI-Powered Savings Suggestions** — Smart recommendations using Python ML algorithms
- 🚨 **Smart Budget Alerts** — Automated notifications at 80% and 100% budget thresholds
---
## 🛠️ Tech Stack
- **MongoDB** — NoSQL database  
- **Express.js** — Backend framework  
- **React.js** — Frontend library  
- **Node.js** — Server runtime  
- **Python** — AI/ML engine for savings analysis
- **JWT** — Authentication via tokens  
- **Chart.js** — Financial data visualization  
- **Tailwind CSS** — Utility-first responsive styling  
- **scikit-learn** — Machine learning for spending pattern analysis
- **pandas** — Data processing and analytics
---
## 📦 Installation Guide
### ⚙️ Prerequisites
- Node.js v16+  
- Python 3.8+
- MongoDB or MongoDB Atlas  
---
### 📁 Clone Repository
```bash
git clone https://github.com/your-username/personal-finance-tracker+.git
cd personal-finance-tracker+
```
---
### 🔧 Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
PYTHON_AI_SERVICE_URL=http://localhost:8000
```
Start the backend server:
```bash
npm start
```
---
### 🐍 Python AI Service Setup
```bash
cd ../python-ai-service
pip install -r requirements.txt
```
Create a `.env` file in `python-ai-service/` and add:
```env
MONGO_URI=your_mongodb_connection_string
MODEL_UPDATE_INTERVAL=24
```
Start the AI service:
```bash
python main.py
```
---
### 💻 Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
Open in browser: [http://localhost:3000](http://localhost:3000)
---
## 📚 Usage Instructions
- **Sign Up / Log In** to access your dashboard  
- **Add Transactions** with categories and amounts  
- **Set Monthly Goals** and track your progress  
- **Visualize with Charts** and analyze your trends  
- **Get Reminders** for important recurring expenses
- **Receive AI Suggestions** for optimized savings based on your spending patterns
- **Get Smart Alerts** when approaching 80% and 100% of monthly budgets
---
## 🤖 AI-Powered Features
### 💡 Advanced Savings Suggestions
Our Python-based AI engine analyzes your spending patterns and provides personalized recommendations:
- **Spending Pattern Analysis** — Identifies unnecessary expenses and optimization opportunities
- **Category-wise Insights** — Smart suggestions for each expense category
- **Seasonal Trend Detection** — Predicts upcoming expenses based on historical data
- **Goal-based Recommendations** — Tailored advice to meet your financial objectives

### 🚨 Smart Budget Monitoring
- **80% Budget Alert** — Early warning when you've spent 80% of your monthly budget
- **100% Budget Alert** — Immediate notification when budget limit is reached
- **Category-specific Alerts** — Granular notifications for individual spending categories
- **Predictive Warnings** — AI predicts if you'll exceed budget based on current spending velocity
---
## 📈 Analytics Overview
- 📌 **Category Charts** — See where your money goes  
- 🔄 **Income vs Expenses** — Understand your balance  
- ✅ **Budget Progress** — Stay on track with limits
- 🤖 **AI Insights Dashboard** — Machine learning-powered financial recommendations
- 📊 **Predictive Analytics** — Forecast future spending and savings potential
---
## 🔐 Security Highlights
- 🔒 **JWT Authentication** for protected routes  
- 🔑 **Hashed Passwords** with bcrypt  
- 🚫 **Unauthorized Access Prevention**
- 🛡️ **Encrypted AI Data Processing** — Secure handling of financial data in ML pipeline
---
## 🌟 Upcoming Features
 
- 🔁 Recurring Transactions  
- 💳 Real Time Link With Banks   
- 📉 Advanced Budget Forecasting
- 🎯 **AI Goal Achievement Planner** — ML-powered roadmaps to reach financial targets
- 📱 **Mobile App with Push Notifications** — Real-time alerts on your phone
- 🤝 **Social Savings Challenges** — Compare progress with friends (anonymized data)
- 🏆 **Gamified Savings Milestones** — Achievement system for financial goals
---
## 🔧 API Endpoints
### AI Suggestions Service
- `GET /api/ai/suggestions/:userId` — Get personalized savings recommendations
- `POST /api/ai/analyze-spending` — Analyze spending patterns
- `GET /api/ai/budget-alerts/:userId` — Retrieve active budget alerts

### Budget Monitoring
- `POST /api/budget/set-alerts` — Configure alert thresholds
- `GET /api/budget/status/:userId` — Check current budget utilization
- `PUT /api/budget/update-limits` — Modify monthly budget limits
---
## 🏗️ Project Structure
```
personal-finance-tracker+/
├── frontend/          # React.js application
├── backend/           # Express.js API server
├── python-ai-service/ # AI/ML microservice
│   ├── models/        # Machine learning models
│   ├── analyzers/     # Spending analysis algorithms
│   └── schedulers/    # Background alert systems
└── docs/             # API documentation
```
---
## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
---
## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
---
## 🙏 Acknowledgments
- Chart.js for beautiful data visualizations
- Tailwind CSS for responsive design system
- scikit-learn community for machine learning tools
- MongoDB for robust data storage solutions
