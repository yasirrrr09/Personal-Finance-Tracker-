#!/usr/bin/env python3
"""
Test script for the Smart Suggestions API
"""

import requests
import json
from datetime import datetime, timedelta
import random

# Sample transaction data for testing
def generate_sample_transactions():
    """Generate sample transaction data for testing"""
    categories = ['Food', 'Entertainment', 'Travel', 'Shopping', 'Rent', 'Utilities', 'Healthcare', 'Transportation']
    payment_methods = ['UPI', 'Credit Card', 'Debit Card', 'Cash']
    
    transactions = []
    base_date = datetime.now() - timedelta(days=30)
    
    # Generate some income
    for i in range(5):
        transactions.append({
            "amount": random.randint(5000, 15000),
            "category": "Income",
            "date": (base_date + timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d"),
            "paymentMethod": "Bank Transfer"
        })
    
    # Generate expenses
    for i in range(50):
        category = random.choice(categories)
        amount = -random.randint(100, 2000)  # Negative for expenses
        if category == 'Rent':
            amount = -random.randint(8000, 15000)
        elif category == 'Food':
            amount = -random.randint(200, 800)
        
        transactions.append({
            "amount": amount,
            "category": category,
            "date": (base_date + timedelta(days=random.randint(0, 30))).strftime("%Y-%m-%d"),
            "paymentMethod": random.choice(payment_methods)
        })
    
    return transactions

def test_api():
    """Test the Smart Suggestions API"""
    base_url = "http://localhost:5001"
    
    print("🧪 Testing Smart Suggestions API...")
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print("❌ Health check failed")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure it's running on port 5001")
        return
    
    # Generate sample data
    transactions = generate_sample_transactions()
    print(f"📊 Generated {len(transactions)} sample transactions")
    
    # Test analyze endpoint
    try:
        response = requests.post(
            f"{base_url}/analyze",
            json={"transactions": transactions},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Analysis completed successfully")
            
            # Display results
            suggestions = data.get("data", {}).get("suggestions", [])
            insights = data.get("data", {}).get("insights", [])
            summary = data.get("data", {}).get("summary", {})
            
            print(f"\n📈 Summary:")
            print(f"  Total Income: ₹{summary.get('total_income', 0):,.0f}")
            print(f"  Total Expenses: ₹{summary.get('total_expenses', 0):,.0f}")
            print(f"  Net Savings: ₹{summary.get('net_savings', 0):,.0f}")
            print(f"  Savings Rate: {summary.get('savings_rate', 0):.1f}%")
            
            print(f"\n💡 Suggestions ({len(suggestions)}):")
            for i, suggestion in enumerate(suggestions, 1):
                print(f"  {i}. {suggestion.get('message', '')}")
                print(f"     Action: {suggestion.get('action', '')}")
                print(f"     Priority: {suggestion.get('priority', 'unknown').upper()}")
                print()
            
            print(f"\n🔍 Insights ({len(insights)}):")
            for i, insight in enumerate(insights, 1):
                print(f"  {i}. {insight.get('icon', '')} {insight.get('message', '')}")
            
        else:
            print(f"❌ Analysis failed: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error testing analyze endpoint: {str(e)}")
    
    # Test suggestions endpoint
    try:
        response = requests.post(
            f"{base_url}/suggestions",
            json={"transactions": transactions},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("\n✅ Suggestions endpoint working")
        else:
            print(f"❌ Suggestions endpoint failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing suggestions endpoint: {str(e)}")
    
    # Test insights endpoint
    try:
        response = requests.post(
            f"{base_url}/insights",
            json={"transactions": transactions},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Insights endpoint working")
        else:
            print(f"❌ Insights endpoint failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing insights endpoint: {str(e)}")

if __name__ == "__main__":
    test_api()
