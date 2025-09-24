from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os
from typing import List, Dict, Any
import logging
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini AI
GEMINI_API_KEY = "AIzaSyAtY3xoBatlo_QgjZc0GQA6Q-5F4y8I62w"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

class ExpenseAnalyzer:
    def __init__(self):
        self.categories = [
            'Food', 'Entertainment', 'Travel', 'Shopping', 'Rent', 
            'Utilities', 'Healthcare', 'Transportation', 'Education', 
            'Savings', 'Others', 'Income'
        ]
        
    def analyze_spending_patterns(self, transactions: List[Dict]) -> Dict[str, Any]:
        """
        Analyze spending patterns and generate smart suggestions
        """
        try:
            # Convert to DataFrame
            df = pd.DataFrame(transactions)
            
            if df.empty:
                return {"suggestions": [], "insights": [], "summary": {}}
            
            # Convert date column
            df['date'] = pd.to_datetime(df['date'])
            df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
            
            # Filter last 30 days
            thirty_days_ago = datetime.now() - timedelta(days=30)
            recent_df = df[df['date'] >= thirty_days_ago].copy()
            
            if recent_df.empty:
                return {"suggestions": [], "insights": [], "summary": {}}
            
            # Separate income and expenses
            income_df = recent_df[recent_df['amount'] > 0].copy()
            expense_df = recent_df[recent_df['amount'] < 0].copy()
            expense_df['amount'] = expense_df['amount'].abs()  # Make positive for analysis
            
            # Generate suggestions
            suggestions = self._generate_suggestions(expense_df, income_df)
            insights = self._generate_insights(expense_df, income_df)
            summary = self._generate_summary(expense_df, income_df)
            
            return {
                "suggestions": suggestions,
                "insights": insights,
                "summary": summary
            }
            
        except Exception as e:
            logger.error(f"Error analyzing spending patterns: {str(e)}")
            return {"suggestions": [], "insights": [], "summary": {}, "error": str(e)}
    
    def _generate_suggestions(self, expense_df: pd.DataFrame, income_df: pd.DataFrame) -> List[Dict]:
        """Generate smart spending suggestions"""
        suggestions = []
        
        if expense_df.empty:
            return suggestions
        
        # Category-wise analysis
        category_spending = expense_df.groupby('category')['amount'].sum().sort_values(ascending=False)
        total_expenses = category_spending.sum()
        
        # Suggestion 1: High spending categories
        for category, amount in category_spending.items():
            percentage = (amount / total_expenses) * 100
            
            if percentage > 30:  # More than 30% of spending
                suggestions.append({
                    "type": "high_spending",
                    "category": category,
                    "amount": amount,
                    "percentage": round(percentage, 1),
                    "message": f"You're spending {percentage:.1f}% of your budget on {category}. Consider reducing it by 15-20%.",
                    "priority": "high",
                    "action": f"Try to reduce {category} expenses by ₹{int(amount * 0.15)} this month."
                })
            elif percentage > 20:  # More than 20% of spending
                suggestions.append({
                    "type": "moderate_spending",
                    "category": category,
                    "amount": amount,
                    "percentage": round(percentage, 1),
                    "message": f"Your {category} expenses are {percentage:.1f}% of total spending. Monitor this category.",
                    "priority": "medium",
                    "action": f"Consider setting a monthly limit for {category} expenses."
                })
        
        # Suggestion 2: Daily spending patterns
        daily_spending = expense_df.groupby(expense_df['date'].dt.date)['amount'].sum()
        avg_daily = daily_spending.mean()
        max_daily = daily_spending.max()
        
        if max_daily > avg_daily * 2:
            suggestions.append({
                "type": "spending_spike",
                "message": f"You had a high spending day (₹{max_daily:.0f}) - {max_daily/avg_daily:.1f}x your average daily spending.",
                "priority": "medium",
                "action": "Review what caused the high spending and plan better for similar situations."
            })
        
        # Suggestion 3: Weekly patterns
        expense_df['weekday'] = expense_df['date'].dt.day_name()
        weekday_spending = expense_df.groupby('weekday')['amount'].sum()
        
        if not weekday_spending.empty:
            highest_day = weekday_spending.idxmax()
            highest_amount = weekday_spending.max()
            avg_weekday = weekday_spending.mean()
            
            if highest_amount > avg_weekday * 1.5:
                suggestions.append({
                    "type": "weekly_pattern",
                    "message": f"You spend most on {highest_day}s (₹{highest_amount:.0f}). Plan your budget accordingly.",
                    "priority": "low",
                    "action": f"Consider pre-planning your {highest_day} expenses to avoid overspending."
                })
        
        # Suggestion 4: Savings analysis
        total_income = income_df['amount'].sum() if not income_df.empty else 0
        total_expenses = expense_df['amount'].sum()
        
        if total_income > 0:
            savings_rate = ((total_income - total_expenses) / total_income) * 100
            
            if savings_rate < 10:
                suggestions.append({
                    "type": "low_savings",
                    "message": f"Your savings rate is only {savings_rate:.1f}%. Financial experts recommend saving at least 20%.",
                    "priority": "high",
                    "action": "Try to increase your savings by reducing discretionary expenses."
                })
            elif savings_rate > 30:
                suggestions.append({
                    "type": "excellent_savings",
                    "message": f"Excellent! You're saving {savings_rate:.1f}% of your income. Keep up the great work!",
                    "priority": "low",
                    "action": "Consider investing your savings for better returns."
                })
        
        return suggestions[:5]  # Return top 5 suggestions
    
    def _generate_insights(self, expense_df: pd.DataFrame, income_df: pd.DataFrame) -> List[Dict]:
        """Generate spending insights"""
        insights = []
        
        if expense_df.empty:
            return insights
        
        # Top spending category
        top_category = expense_df.groupby('category')['amount'].sum().idxmax()
        top_amount = expense_df.groupby('category')['amount'].sum().max()
        insights.append({
            "type": "top_category",
            "message": f"Your biggest expense category is {top_category} (₹{top_amount:.0f})",
            "icon": "📊"
        })
        
        # Spending trend (if we have enough data)
        if len(expense_df) > 7:
            # Compare first half vs second half of the month
            mid_point = expense_df['date'].median()
            first_half = expense_df[expense_df['date'] <= mid_point]['amount'].sum()
            second_half = expense_df[expense_df['date'] > mid_point]['amount'].sum()
            
            if second_half > first_half * 1.2:
                insights.append({
                    "type": "increasing_trend",
                    "message": "Your spending increased significantly in the second half of the month",
                    "icon": "📈"
                })
            elif first_half > second_half * 1.2:
                insights.append({
                    "type": "decreasing_trend",
                    "message": "Great! You reduced your spending in the second half of the month",
                    "icon": "📉"
                })
        
        # Payment method analysis
        if 'paymentMethod' in expense_df.columns:
            payment_methods = expense_df.groupby('paymentMethod')['amount'].sum().sort_values(ascending=False)
            top_method = payment_methods.index[0]
            insights.append({
                "type": "payment_method",
                "message": f"You prefer using {top_method} for most transactions",
                "icon": "💳"
            })
        
        return insights
    
    def _generate_summary(self, expense_df: pd.DataFrame, income_df: pd.DataFrame) -> Dict:
        """Generate spending summary statistics"""
        total_income = income_df['amount'].sum() if not income_df.empty else 0
        total_expenses = expense_df['amount'].sum()
        
        summary = {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "net_savings": total_income - total_expenses,
            "savings_rate": ((total_income - total_expenses) / total_income * 100) if total_income > 0 else 0,
            "avg_daily_expense": expense_df.groupby(expense_df['date'].dt.date)['amount'].sum().mean(),
            "total_transactions": len(expense_df),
            "categories_used": expense_df['category'].nunique()
        }
        
        return summary
    
    def generate_ai_suggestions(self, transactions: List[Dict], basic_suggestions: List[Dict], insights: List[Dict], summary: Dict) -> List[Dict]:
        """Generate AI-powered suggestions using Google Gemini"""
        try:
            # Prepare data for AI analysis
            expense_df = pd.DataFrame([t for t in transactions if t.get('amount', 0) < 0])
            if expense_df.empty:
                return []
            
            # Create a comprehensive prompt for Gemini
            prompt = f"""
            You are a personal finance advisor analyzing spending data. Here's the user's financial data:

            SUMMARY:
            - Total Income: ₹{summary.get('total_income', 0):,.0f}
            - Total Expenses: ₹{summary.get('total_expenses', 0):,.0f}
            - Net Savings: ₹{summary.get('net_savings', 0):,.0f}
            - Savings Rate: {summary.get('savings_rate', 0):.1f}%
            - Average Daily Expense: ₹{summary.get('avg_daily_expense', 0):,.0f}
            - Total Transactions: {summary.get('total_transactions', 0)}
            - Categories Used: {summary.get('categories_used', 0)}

            SPENDING BY CATEGORY:
            {expense_df.groupby('category')['amount'].abs().sum().to_dict()}

            RECENT TRANSACTIONS (Last 10):
            {expense_df.head(10).to_string() if not expense_df.empty else 'No recent transactions'}

            BASIC ANALYSIS ALREADY DONE:
            - Suggestions: {[s.get('message', '') for s in basic_suggestions]}
            - Insights: {[i.get('message', '') for i in insights]}

            Please provide 3-5 advanced, personalized financial suggestions that go beyond basic analysis. Focus on:
            1. Specific actionable advice tailored to their spending patterns
            2. Behavioral insights and recommendations
            3. Long-term financial health tips
            4. Creative ways to save money based on their categories
            5. Investment or financial planning suggestions

            Format your response as a JSON array with this structure:
            [
                {{
                    "type": "ai_insight",
                    "title": "Brief title",
                    "message": "Detailed personalized advice",
                    "category": "relevant_category",
                    "priority": "high/medium/low",
                    "action": "Specific action to take",
                    "reasoning": "Why this suggestion is relevant to their data"
                }}
            ]

            Be specific, actionable, and personalized. Don't repeat the basic suggestions already provided.
            """

            response = model.generate_content(prompt)
            
            # Parse the AI response
            try:
                # Extract JSON from the response
                response_text = response.text
                # Find JSON array in the response
                start_idx = response_text.find('[')
                end_idx = response_text.rfind(']') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = response_text[start_idx:end_idx]
                    ai_suggestions = json.loads(json_str)
                    
                    # Add AI-specific metadata
                    for suggestion in ai_suggestions:
                        suggestion['source'] = 'gemini_ai'
                        suggestion['timestamp'] = datetime.now().isoformat()
                    
                    return ai_suggestions
                else:
                    logger.warning("Could not extract JSON from Gemini response")
                    return []
                    
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse Gemini JSON response: {e}")
                return []
                
        except Exception as e:
            logger.error(f"Error generating AI suggestions: {str(e)}")
            return []

# Initialize analyzer
analyzer = ExpenseAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Smart Suggestions API is running"})

@app.route('/analyze', methods=['POST'])
def analyze_expenses():
    """Analyze expenses and generate smart suggestions"""
    try:
        data = request.get_json()
        
        if not data or 'transactions' not in data:
            return jsonify({"error": "No transactions data provided"}), 400
        
        transactions = data['transactions']
        
        if not isinstance(transactions, list):
            return jsonify({"error": "Transactions must be a list"}), 400
        
        # Analyze spending patterns
        result = analyzer.analyze_spending_patterns(transactions)
        
        # Generate AI-powered suggestions
        try:
            ai_suggestions = analyzer.generate_ai_suggestions(
                transactions, 
                result.get("suggestions", []), 
                result.get("insights", []), 
                result.get("summary", {})
            )
            result["ai_suggestions"] = ai_suggestions
        except Exception as e:
            logger.error(f"Error generating AI suggestions: {str(e)}")
            result["ai_suggestions"] = []
        
        return jsonify({
            "success": True,
            "data": result,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in analyze_expenses: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/suggestions', methods=['POST'])
def get_suggestions():
    """Get only suggestions for expenses"""
    try:
        data = request.get_json()
        
        if not data or 'transactions' not in data:
            return jsonify({"error": "No transactions data provided"}), 400
        
        transactions = data['transactions']
        result = analyzer.analyze_spending_patterns(transactions)
        
        return jsonify({
            "success": True,
            "suggestions": result.get("suggestions", []),
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in get_suggestions: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/insights', methods=['POST'])
def get_insights():
    """Get spending insights"""
    try:
        data = request.get_json()
        
        if not data or 'transactions' not in data:
            return jsonify({"error": "No transactions data provided"}), 400
        
        transactions = data['transactions']
        result = analyzer.analyze_spending_patterns(transactions)
        
        return jsonify({
            "success": True,
            "insights": result.get("insights", []),
            "summary": result.get("summary", {}),
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in get_insights: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/ai-suggestions', methods=['POST'])
def get_ai_suggestions():
    """Get AI-powered suggestions using Gemini"""
    try:
        data = request.get_json()
        
        if not data or 'transactions' not in data:
            return jsonify({"error": "No transactions data provided"}), 400
        
        transactions = data['transactions']
        
        # First get basic analysis
        result = analyzer.analyze_spending_patterns(transactions)
        
        # Generate AI suggestions
        ai_suggestions = analyzer.generate_ai_suggestions(
            transactions,
            result.get("suggestions", []),
            result.get("insights", []),
            result.get("summary", {})
        )
        
        return jsonify({
            "success": True,
            "ai_suggestions": ai_suggestions,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in get_ai_suggestions: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
