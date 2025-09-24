import { useState, useEffect } from "react";
import { createTransaction } from "../api/api"; 

const tagsList = ["Essential", "Urgent", "Recurring", "Online", "Cash", "Credit"];
const paymentOptions = ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet", "Other"];

const AddTransaction = ({ userId, onSuccess }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Others");
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [transactionType, setTransactionType] = useState("expense"); // "expense" or "income"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTagChange = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  // Reset category when transaction type changes
  useEffect(() => {
    if (transactionType === "income") {
      setCategory("Income");
    } else {
      setCategory("Others");
    }
  }, [transactionType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount || !category || !paymentMethod) {
      setError("Please fill all required fields (Title, Amount, Category, Payment Method)");
      return;
    }

    // Convert amount to negative for expenses, positive for income
    const amountValue = transactionType === "expense" ? -Math.abs(parseInt(amount)) : Math.abs(parseInt(amount));

    const transactionData = {
      title: name,
      amount: amountValue,
      category: transactionType === "income" ? "Income" : category,
      note,
      tags: selectedTags,
      date,
      paymentMethod,
      userId,
    };

    setLoading(true);
    setError("");

    try {
      await createTransaction(transactionData);
      setName("");
      setAmount("");
      setCategory("Others");
      setNote("");
      setSelectedTags([]);
      setDate(new Date().toISOString().split("T")[0]);
      setPaymentMethod("Cash");
      setTransactionType("expense");
      onSuccess();
    } catch (err) {
      setError("Error creating transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 relative">
      <button
        onClick={onSuccess}
        className="absolute top-4 right-4 text-slate-500 hover:text-red-500 text-xl font-bold"
      >
        ✕
      </button>

      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-8 tracking-tight">
        💳 Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Grocery Shopping"
              className="w-full px-4 py-3 rounded-xl border"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">₹</span>
              <input
                type="number"
                placeholder="e.g. 1200 for expense"
                className="w-full pl-8 pr-4 py-3 rounded-xl border"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Transaction Type */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Transaction Type *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="transactionType"
                value="expense"
                checked={transactionType === "expense"}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-4 h-4 text-red-500"
              />
              <span className="text-slate-700 dark:text-slate-300">💸 Expense</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="transactionType"
                value="income"
                checked={transactionType === "income"}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-4 h-4 text-green-500"
              />
              <span className="text-slate-700 dark:text-slate-300">💰 Income</span>
            </label>
          </div>
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Category *
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {transactionType === "income" ? (
                <>
                  <option value="Income">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investment">Investment Returns</option>
                  <option value="Business">Business Income</option>
                  <option value="Gift">Gift</option>
                  <option value="Others">Others</option>
                </>
              ) : (
                <>
                  <option value="Food">Food</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Education">Education</option>
                  <option value="Savings">Savings</option>
                  <option value="Others">Others</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Date *
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl border"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Note (optional)
          </label>
          <textarea
            rows="3"
            placeholder="e.g. Bought vegetables and fruits"
            className="w-full px-4 py-3 rounded-xl border"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Payment Method *
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border"
          >
            {paymentOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Tags
          </label>
          <div className="flex flex-wrap gap-3">
            {tagsList.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagChange(tag)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-transparent border-slate-400 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="w-full py-3 rounded-xl bg-blue-600 text-white">
          {loading ? "Saving..." : "➕ Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
