import { useState, useEffect } from "react";
import { getBudgetTracking } from "../api/api";

const CategoryBudgetTracking = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgetTracking();
  }, []);

  // Sample data for demonstration
  const getSampleBudgetData = () => {
    return {
      month: "January",
      year: 2024,
      budgetTracking: [
        {
          category: "Food",
          budgetGoal: 8000,
          currentSpent: 4850,
          percentage: 60.6,
          remaining: 3150,
          alertType: null,
          message: null
        },
        {
          category: "Entertainment",
          budgetGoal: 3000,
          currentSpent: 800,
          percentage: 26.7,
          remaining: 2200,
          alertType: null,
          message: null
        },
        {
          category: "Transportation",
          budgetGoal: 2000,
          currentSpent: 1050,
          percentage: 52.5,
          remaining: 950,
          alertType: null,
          message: null
        },
        {
          category: "Shopping",
          budgetGoal: 5000,
          currentSpent: 2500,
          percentage: 50.0,
          remaining: 2500,
          alertType: null,
          message: null
        },
        {
          category: "Healthcare",
          budgetGoal: 3000,
          currentSpent: 2000,
          percentage: 66.7,
          remaining: 1000,
          alertType: "WARNING",
          message: "You're approaching your healthcare budget limit. Consider monitoring your medical expenses."
        },
        {
          category: "Utilities",
          budgetGoal: 2000,
          currentSpent: 1200,
          percentage: 60.0,
          remaining: 800,
          alertType: null,
          message: null
        }
      ],
      alerts: [
        {
          _id: "1",
          category: "Healthcare",
          message: "Healthcare budget is 67% used - monitor your spending",
          alertType: "WARNING",
          percentage: 66.7,
          budgetGoal: 3000,
          currentSpent: 2000,
          createdAt: "2024-01-15T10:30:00Z"
        }
      ]
    };
  };

  const fetchBudgetTracking = async () => {
    try {
      setLoading(true);
      const data = await getBudgetTracking();
      setBudgetData(data);
    } catch (error) {
      console.warn("Failed to fetch budget tracking, using sample data:", error);
      // Use sample data when API fails
      setBudgetData(getSampleBudgetData());
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    if (percentage >= 60) return "bg-orange-500";
    return "bg-green-500";
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case "EXCEEDED":
        return "🚨";
      case "WARNING":
        return "⚠️";
      default:
        return null;
    }
  };

  const getStatusText = (percentage, remaining) => {
    if (percentage >= 100) {
      return `Exceeded by ₹${Math.abs(remaining)}`;
    } else if (percentage >= 80) {
      return `Almost at limit (${percentage.toFixed(1)}%)`;
    } else if (percentage >= 60) {
      return `On track (${percentage.toFixed(1)}%)`;
    } else {
      return `Good progress (${percentage.toFixed(1)}%)`;
    }
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return "text-red-600 dark:text-red-400";
    if (percentage >= 80) return "text-yellow-600 dark:text-yellow-400";
    if (percentage >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-green-600 dark:text-green-400";
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-xl">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-slate-300 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!budgetData || !budgetData.budgetTracking || budgetData.budgetTracking.length === 0) {
    return (
      <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-xl">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 tracking-tight">
          📊 Category Budget Tracking
        </h3>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            No budget goals set yet!
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Set category budgets to start tracking your spending.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          📊 Category Budget Tracking
        </h3>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {budgetData.month} {budgetData.year}
        </div>
      </div>

      <div className="space-y-4">
        {budgetData.budgetTracking.map((category, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {category.category}
                </h4>
                {category.alertType && (
                  <span className="text-xl">{getAlertIcon(category.alertType)}</span>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  ₹{category.currentSpent} / ₹{category.budgetGoal}
                </div>
                <div className={`text-sm font-medium ${getStatusColor(category.percentage)}`}>
                  {getStatusText(category.percentage, category.remaining)}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                <span>Progress</span>
                <span>{category.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(category.percentage)} transition-all duration-500 ease-out`}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Remaining:</span>
                <span className={`font-medium ${category.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ₹{category.remaining >= 0 ? category.remaining : Math.abs(category.remaining)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <span className={`font-medium ${getStatusColor(category.percentage)}`}>
                  {category.percentage >= 100 ? 'Exceeded' : 
                   category.percentage >= 80 ? 'Warning' : 
                   category.percentage >= 60 ? 'Caution' : 'Good'}
                </span>
              </div>
            </div>

            {category.message && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                category.alertType === 'EXCEEDED' 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
              }`}>
                {category.message}
              </div>
            )}
          </div>
        ))}
      </div>

      {budgetData.alerts && budgetData.alerts.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 dark:text-blue-400">ℹ️</span>
            <span className="font-medium text-blue-800 dark:text-blue-200">
              Active Alerts: {budgetData.alerts.length}
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            You have {budgetData.alerts.length} budget alert{budgetData.alerts.length !== 1 ? 's' : ''} for this month. 
            Check the Budget Alerts section for details.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryBudgetTracking;
