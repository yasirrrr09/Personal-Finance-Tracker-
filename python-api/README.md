# Smart Suggestions API

A Python Flask API that analyzes expense data and provides intelligent spending suggestions and insights.

## Features

- **Spending Pattern Analysis**: Analyzes last 30 days of expense data
- **Smart Suggestions**: Provides actionable recommendations to reduce spending
- **Category Analysis**: Identifies high-spending categories
- **Trend Analysis**: Detects spending spikes and patterns
- **Savings Rate Analysis**: Calculates and provides savings recommendations
- **Weekly Pattern Detection**: Identifies spending patterns by day of week

## Installation

1. Install Python 3.8 or higher
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the API

### Development Mode
```bash
python app.py
```

### Production Mode
```bash
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

The API will run on `http://localhost:5001`

## API Endpoints

### Health Check
```
GET /health
```

### Analyze Expenses
```
POST /analyze
Content-Type: application/json

{
  "transactions": [
    {
      "amount": -1200,
      "category": "Food",
      "date": "2024-01-15",
      "paymentMethod": "UPI"
    }
  ]
}
```

### Get Suggestions Only
```
POST /suggestions
Content-Type: application/json

{
  "transactions": [...]
}
```

### Get Insights Only
```
POST /insights
Content-Type: application/json

{
  "transactions": [...]
}
```

## Response Format

```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "high_spending",
        "category": "Food",
        "amount": 5000,
        "percentage": 35.2,
        "message": "You're spending 35.2% of your budget on Food. Consider reducing it by 15-20%.",
        "priority": "high",
        "action": "Try to reduce Food expenses by ₹750 this month."
      }
    ],
    "insights": [
      {
        "type": "top_category",
        "message": "Your biggest expense category is Food (₹5000)",
        "icon": "📊"
      }
    ],
    "summary": {
      "total_income": 25000,
      "total_expenses": 15000,
      "net_savings": 10000,
      "savings_rate": 40.0,
      "avg_daily_expense": 500.0,
      "total_transactions": 30,
      "categories_used": 5
    }
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

## Smart Suggestions Types

1. **High Spending**: Categories consuming >30% of budget
2. **Moderate Spending**: Categories consuming >20% of budget
3. **Spending Spike**: Days with unusually high spending
4. **Weekly Pattern**: Spending patterns by day of week
5. **Low Savings**: Savings rate below 10%
6. **Excellent Savings**: Savings rate above 30%

## Error Handling

The API includes comprehensive error handling and will return appropriate HTTP status codes and error messages for various scenarios.
