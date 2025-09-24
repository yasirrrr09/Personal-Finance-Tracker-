const mongoose = require("mongoose");

const budgetAlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
  },
  budgetGoal: {
    type: Number,
    required: true,
  },
  currentSpent: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  alertType: {
    type: String,
    enum: ["WARNING", "EXCEEDED"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  month: {
    type: String,
    required: true, // Format: "2024-01"
  },
  year: {
    type: Number,
    required: true,
  },
}, { 
  timestamps: true 
});

// Index for efficient queries
budgetAlertSchema.index({ user: 1, month: 1, year: 1 });
budgetAlertSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model("BudgetAlert", budgetAlertSchema);
