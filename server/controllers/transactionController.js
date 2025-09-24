const Transaction = require("../models/Transaction");
const CategoryBudgetGoal = require("../models/CategoryBudgetGoal");
const { generateBudgetAlerts } = require("../utils/budgetAlerts");
const mongoose = require("mongoose");

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { title, amount, category, note, tags, date, paymentMethod } = req.body;
    const userId = req.user;

    if (!title || amount === undefined || !paymentMethod) {
      return res.status(400).json({ message: "Title, amount, and payment method are required" });
    }

    const newTransaction = new Transaction({
      title: title.trim(),
      amount: Number(amount),
      category: category?.trim() || "Others",
      note: note?.trim() || "",
      tags: tags?.map(t => t.trim()) || [],
      date: date ? new Date(date) : Date.now(),
      paymentMethod: paymentMethod.trim(),
      userId,
    });

    const savedTransaction = await newTransaction.save();
    
    // Generate budget alerts if this is an expense
    if (savedTransaction.amount < 0) {
      try {
        const categoryGoal = await CategoryBudgetGoal.findOne({
          user: userId,
          category: savedTransaction.category
        });
        
        if (categoryGoal && categoryGoal.goal > 0) {
          // Calculate current month's spending for this category
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear();
          const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
          const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
          
          const currentMonthSpending = await Transaction.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
                category: savedTransaction.category,
                date: { $gte: startOfMonth, $lte: endOfMonth },
                amount: { $lt: 0 }
              }
            },
            {
              $group: {
                _id: null,
                totalSpent: { $sum: { $abs: "$amount" } }
              }
            }
          ]);
          
          const totalSpent = currentMonthSpending[0]?.totalSpent || 0;
          await generateBudgetAlerts(userId, savedTransaction.category, categoryGoal.goal, totalSpent);
        }
      } catch (alertError) {
        console.error("Error generating budget alert:", alertError);
        // Don't fail the transaction if alert generation fails
      }
    }
    
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get transactions with pagination, search, filter
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category = "", paymentMethod = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: req.user };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

// Transaction summary
exports.getTransactionSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user });

    let income = 0, expense = 0;
    transactions.forEach(txn => {
      if (txn.amount >= 0) income += txn.amount;
      else expense += Math.abs(txn.amount);
    });

    res.status(200).json({
      totalTransactions: transactions.length,
      income,
      expense,
      net: income - expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching summary", error: error.message });
  }
};

// Delete transaction with authorization
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user;

    const deletedTransaction = await Transaction.findOneAndDelete({ _id: id, userId });
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found or unauthorized" });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      message: "Transaction deleted successfully",
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting transaction", error: error.message });
  }
};
