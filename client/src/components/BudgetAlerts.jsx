import { useState, useEffect } from "react";
import { getBudgetAlerts, markAlertAsRead } from "../api/api";

const BudgetAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  // Sample data for demonstration
  const getSampleAlerts = () => {
    const allAlerts = [
      {
        _id: "1",
        category: "Healthcare",
        message: "Healthcare budget is 67% used - monitor your spending",
        alertType: "WARNING",
        percentage: 66.7,
        budgetGoal: 3000,
        currentSpent: 2000,
        createdAt: "2024-01-15T10:30:00Z",
        isRead: false
      },
      {
        _id: "2",
        category: "Food",
        message: "You are approaching your Food budget limit (60% used)",
        alertType: "WARNING",
        percentage: 60.6,
        budgetGoal: 8000,
        currentSpent: 4850,
        createdAt: "2024-01-14T15:20:00Z",
        isRead: false
      },
      {
        _id: "3",
        category: "Utilities",
        message: "Utilities budget is 60% used - keep an eye on your bills",
        alertType: "WARNING",
        percentage: 60.0,
        budgetGoal: 2000,
        currentSpent: 1200,
        createdAt: "2024-01-13T09:15:00Z",
        isRead: true
      },
      {
        _id: "4",
        category: "Transportation",
        message: "Transportation budget is 52% used - good progress",
        alertType: "INFO",
        percentage: 52.5,
        budgetGoal: 2000,
        currentSpent: 1050,
        createdAt: "2024-01-12T14:45:00Z",
        isRead: true
      }
    ];

    // Filter based on current filter setting
    if (filter === "unread") {
      return allAlerts.filter(alert => !alert.isRead);
    } else if (filter === "read") {
      return allAlerts.filter(alert => alert.isRead);
    }
    return allAlerts;
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      let isRead = null;
      if (filter === "unread") isRead = false;
      if (filter === "read") isRead = true;
      
      const data = await getBudgetAlerts(isRead);
      setAlerts(data.alerts || []);
    } catch (error) {
      console.warn("Failed to fetch alerts, using sample data:", error);
      // Use sample data when API fails
      setAlerts(getSampleAlerts());
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await markAlertAsRead(alertId);
      setAlerts(prev => 
        prev.map(alert => 
          alert._id === alertId ? { ...alert, isRead: true } : alert
        )
      );
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
    }
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case "EXCEEDED":
        return "🚨";
      case "WARNING":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  const getAlertColor = (alertType) => {
    switch (alertType) {
      case "EXCEEDED":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "WARNING":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-xl">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-300 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          🔔 Budget Alerts
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              filter === "read"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            {filter === "all" 
              ? "No budget alerts yet!" 
              : `No ${filter} alerts found.`
            }
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            {filter === "all" 
              ? "Keep track of your spending to see alerts here." 
              : "Try changing the filter to see other alerts."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`p-4 rounded-xl border-l-4 ${getAlertColor(alert.alertType)} ${
                alert.isRead ? "opacity-60" : ""
              } transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getAlertIcon(alert.alertType)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {alert.category}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {alert.percentage.toFixed(1)}%
                      </span>
                      {!alert.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span>Budget: ₹{alert.budgetGoal}</span>
                      <span>Spent: ₹{alert.currentSpent}</span>
                      <span>
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!alert.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(alert._id)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetAlerts;
