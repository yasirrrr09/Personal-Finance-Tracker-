const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true
    },

    title: { 
      type: String, 
      required: true, 
      trim: true 
    },

    amount: { 
      type: Number, 
      required: true,
    },

    category: { 
      type: String, 
      enum: [
        "Food", 
        "Entertainment", 
        "Travel", 
        "Shopping", 
        "Rent",
        "Utilities",
        "Healthcare",
        "Transportation",
        "Education",
        "Savings", 
        "Others", 
        "Income"
      ], 
      default: "Others", 
      trim: true 
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet", "Other"],
      required: true,
      trim: true,
    },

    note: { 
      type: String, 
      default: "", 
      trim: true 
    },

    tags: [{ 
      type: String, 
      trim: true 
    }],

    date: { 
      type: Date, 
      default: Date.now, 
      index: true 
    },
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
