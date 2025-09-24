const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const transactionController = require("../controllers/transactionController");

// Create a new transaction (protected)
router.post("/", authMiddleware, transactionController.createTransaction);

// Get all transactions for the logged-in user with pagination, search, filter
router.get("/", authMiddleware, transactionController.getTransactions);

// Get transaction summary for logged-in user
router.get("/summary", authMiddleware, transactionController.getTransactionSummary);

// Delete transaction by ID
router.delete("/:id", authMiddleware, transactionController.deleteTransaction);

module.exports = router;
