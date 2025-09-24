const BudgetAlert = require("../models/BudgetAlert");

// Generate budget alerts
const generateBudgetAlerts = async (userId, category, budgetGoal, currentSpent) => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
        
        const percentage = budgetGoal > 0 ? (currentSpent / budgetGoal) * 100 : 0;
        
        // Check if we need to create an alert
        let alertType = null;
        let message = "";
        
        if (percentage >= 100) {
            alertType = "EXCEEDED";
            message = `You've exceeded your ${category} budget by ₹${Math.abs(budgetGoal - currentSpent)}`;
        } else if (percentage >= 80) {
            alertType = "WARNING";
            message = `You've used ${percentage.toFixed(1)}% of your ${category} budget`;
        }

        if (alertType) {
            // Check if alert already exists for this category and month
            const existingAlert = await BudgetAlert.findOne({
                user: userId,
                category: category,
                month: monthKey,
                year: currentYear,
                alertType: alertType
            });

            if (!existingAlert) {
                const newAlert = new BudgetAlert({
                    user: userId,
                    category: category,
                    budgetGoal: budgetGoal,
                    currentSpent: currentSpent,
                    percentage: Math.min(percentage, 100),
                    alertType: alertType,
                    message: message,
                    month: monthKey,
                    year: currentYear
                });

                await newAlert.save();
                return newAlert;
            }
        }

        return null;
    } catch (err) {
        console.error("Error generating budget alert:", err);
        return null;
    }
};

module.exports = {
    generateBudgetAlerts
};
