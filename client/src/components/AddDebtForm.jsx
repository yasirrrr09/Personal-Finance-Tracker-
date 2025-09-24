import { useState } from "react";
import { addDebt } from "../api/api"; // 🔥 centralized API call

const AddDebtForm = ({ onDebtAdded }) => {
  const [debt, setDebt] = useState({
    name: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDebt({ ...debt, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!debt.name || debt.amount === "") {
      setError("Please fill in all fields");
      return;
    }

    const payload = {
      name: debt.name.trim(),
      amount: Number(debt.amount), // 🔥 convert to number
    };

    if (isNaN(payload.amount) || payload.amount < 0) {
      setError("Amount must be a valid number ≥ 0");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newDebt = await addDebt(payload); // ✅ backend expects number
      onDebtAdded(newDebt); // Pass saved debt to parent
      setDebt({ name: "", amount: "" }); // Reset form
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Failed to add debt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 sm:p-8 md:p-10 rounded-3xl shadow-xl bg-gradient-to-br from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 transition-all">
      <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
        ➕ Add New Debt
      </h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Debt Name"
            value={debt.name}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-lg bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={debt.amount}
            onChange={handleChange}
            required
            className="px-4 py-2 rounded-lg bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 rounded-xl transition w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "✅ Save Debt"}
        </button>
      </form>
    </div>
  );
};

export default AddDebtForm;
