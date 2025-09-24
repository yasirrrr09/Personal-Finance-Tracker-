const CategoryBudgetGoal = require("../models/CategoryBudgetGoal");
const Transaction = require("../models/Transaction");
const BudgetAlert = require("../models/BudgetAlert");
const { generateBudgetAlerts } = require("../utils/budgetAlerts");
const mongoose = require("mongoose");

const setCategoryGoal = async (req, res) => {
    try {
        const { categoryGoals } = req.body;

        if (!Array.isArray(categoryGoals)) {
            return res.status(400).json({ message: "Invalid data format" });
        }

        await Promise.all(categoryGoals.map(goalData => {
            const { category, goal } = goalData;

            if (!category || typeof goal !== 'number' || goal < 0) {
                throw new Error("Invalid category or goal");
            }

            return CategoryBudgetGoal.findOneAndUpdate(
                { user: req.user, category },
                { goal, user: req.user },
                { upsert: true, new: true }
            );
        }));

        res.status(200).json({ message: "Category goals updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Error setting goal" });
    }
};

const getCategoryGoals = async (req, res) => {
    try {
        const userId = req.user;
        const categoryGoals = await CategoryBudgetGoal.find({ user: userId })
                                                      .sort({ category: 1 }); // optional sorting

        const formattedGoals = categoryGoals.map(goal => ({
            category: goal.category,
            goal: goal.goal,
        }));

        res.status(200).json({ categoryGoals: formattedGoals });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching category goals" });
    }
};

// Get budget tracking with alerts for all categories
const getBudgetTracking = async (req, res) => {
    try {
        const userId = req.user;
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const monthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

        // Get all category goals
        const categoryGoals = await CategoryBudgetGoal.find({ user: userId });
        
        // Get current month's expenses by category
        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        const expensesByCategory = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startOfMonth, $lte: endOfMonth },
                    amount: { $lt: 0 } // Only expenses (negative amounts)
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalSpent: { $sum: { $abs: "$amount" } }
                }
            }
        ]);

        // Create a map of expenses by category
        const expenseMap = {};
        expensesByCategory.forEach(expense => {
            expenseMap[expense._id] = expense.totalSpent;
        });

        // Calculate budget tracking for each category
        const budgetTracking = categoryGoals.map(goal => {
            const spent = expenseMap[goal.category] || 0;
            const percentage = goal.goal > 0 ? (spent / goal.goal) * 100 : 0;
            const remaining = goal.goal - spent;
            
            let alertType = null;
            let message = "";
            
            if (percentage >= 100) {
                alertType = "EXCEEDED";
                message = `You've exceeded your ${goal.category} budget by ₹${Math.abs(remaining)}`;
            } else if (percentage >= 80) {
                alertType = "WARNING";
                message = `You've used ${percentage.toFixed(1)}% of your ${goal.category} budget`;
            }

            return {
                category: goal.category,
                budgetGoal: goal.goal,
                currentSpent: spent,
                remaining: remaining,
                percentage: Math.min(percentage, 100),
                alertType,
                message
            };
        });

        // Get existing alerts for this month
        const existingAlerts = await BudgetAlert.find({
            user: userId,
            month: monthKey,
            year: currentYear
        });

        res.status(200).json({
            budgetTracking,
            month: monthKey,
            year: currentYear,
            alerts: existingAlerts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching budget tracking" });
    }
};


// Mark alert as read
const markAlertAsRead = async (req, res) => {
    try {
        const { alertId } = req.params;
        const userId = req.user;

        const alert = await BudgetAlert.findOneAndUpdate(
            { _id: alertId, user: userId },
            { isRead: true },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({ message: "Alert not found" });
        }

        res.status(200).json({ message: "Alert marked as read", alert });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error marking alert as read" });
    }
};

// Get all alerts for user
const getBudgetAlerts = async (req, res) => {
    try {
        const userId = req.user;
        const { isRead } = req.query;

        let query = { user: userId };
        if (isRead !== undefined) {
            query.isRead = isRead === 'true';
        }

        const alerts = await BudgetAlert.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ alerts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching alerts" });
    }
};

module.exports = {
    setCategoryGoal,
    getCategoryGoals,
    getBudgetTracking,
    markAlertAsRead,
    getBudgetAlerts,
};
