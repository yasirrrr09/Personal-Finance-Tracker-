import React, { useEffect, useState, useRef } from "react";
import { ArrowDownCircle, ArrowUpCircle, MinusCircle } from "lucide-react";
import TransactionReminders from "./TransactionReminders";
import Layout from "./Layout";
import { getTransactions, deleteTransaction } from "../api/api";

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg w-[90%] max-w-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
          Confirm Delete
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Are you sure you want to delete this transaction? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const listRef = useRef();
  const loadingRef = useRef(false);
  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);

  const fetchTransactions = async (pageNum = 1, reset = false) => {
    setLoading(true);
    loadingRef.current = true;
    try {
      const res = await getTransactions(pageNum, 10, search, filter);
      if (reset) setTransactions(res.transactions);
      else setTransactions((prev) => [...prev, ...res.transactions]);
      setHasMore(res.hasMore);
      hasMoreRef.current = res.hasMore;
      setPage(pageNum);
      pageRef.current = pageNum;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Error fetching transactions");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => { fetchTransactions(1, true); }, []);
  useEffect(() => { const delay = setTimeout(() => fetchTransactions(1, true), 500); return () => clearTimeout(delay); }, [search, filter]);

  useEffect(() => {
    const div = listRef.current;
    if (!div) return;
    const handleScroll = () => {
      if (hasMoreRef.current && !loadingRef.current && div.scrollTop + div.clientHeight >= div.scrollHeight - 50) {
        fetchTransactions(pageRef.current + 1);
      }
    };
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, []);

  const openDeleteModal = (id) => { setDeleteId(id); setIsModalOpen(true); };
  const handleConfirmDelete = async () => {
    try {
      await deleteTransaction(deleteId);
      setTransactions((prev) => prev.filter((txn) => txn._id !== deleteId));
    } catch (err) {
      alert("Error deleting transaction");
    } finally {
      setIsModalOpen(false);
      setDeleteId(null);
    }
  };

  const totalSpent = transactions.filter((txn) => txn.amount < 0).reduce((sum, txn) => sum + txn.amount, 0);
  const totalIncome = transactions.filter((txn) => txn.amount > 0).reduce((sum, txn) => sum + txn.amount, 0);
  const net = totalIncome + totalSpent;

  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] p-6 rounded-3xl shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-800 dark:text-white mb-10">
          💳 Transaction Dashboard
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full sm:w-60 px-5 py-3 rounded-xl border"
              >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Travel">Travel</option>
                <option value="Utilities">Utilities</option>
                <option value="Income">Income</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <ul ref={listRef} className="space-y-5 max-h-[532px] overflow-y-auto pr-1">
              {transactions.map((txn) => (
                <li key={txn._id} className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {txn.amount < 0 ? <ArrowDownCircle className="text-red-500" /> : <ArrowUpCircle className="text-green-500" />}
                      <p className="text-lg font-semibold">{txn.title}</p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {txn.category} • {txn.paymentMethod}
                    </p>
                    {txn.note && <p className="text-sm italic text-slate-400">{txn.note}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-xl font-bold ${txn.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                      ₹{txn.amount}
                    </div>
                    <button onClick={() => openDeleteModal(txn._id)} className="text-red-500 hover:text-red-700">
                      <MinusCircle size={24} />
                    </button>
                  </div>
                </li>
              ))}

              {loading && <p className="text-center py-2">Loading more...</p>}
              {!hasMore && !loading && <p className="text-center italic py-2">No more transactions</p>}
            </ul>
          </div>

          <div className="flex flex-col gap-8">
            <div className="p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 h-fit">
              <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
                Summary: <span className="text-purple-600 dark:text-purple-400">{filter || "All Categories"}</span>
              </h3>
              <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                <li><span className="font-semibold">🧾 Total Transactions:</span> {transactions.length}</li>
                <li><span className="font-semibold">💸 Total Spent:</span> ₹{Math.abs(totalSpent)}</li>
                <li><span className="font-semibold">💰 Total Income:</span> ₹{totalIncome}</li>
                <li><span className="font-semibold">🔴 Net Balance:</span> ₹{net}</li>
              </ul>
            </div>

            <TransactionReminders />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Layout>
  );
};

export default Transactions;
