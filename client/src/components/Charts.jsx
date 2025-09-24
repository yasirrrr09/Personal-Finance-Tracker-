import React, { useEffect, useState } from "react";
import ExpenseChart from "./ExpenseChart";
import ExpenseCategoryChart from "./ExpenseCategoryChart";
import MonthlyTrendsChart from "./MonthlyTrendsChart";
import EnhancedPieChart from "./EnhancedPieChart";
import { motion } from "framer-motion";
import Layout from "./Layout";
import { getTransactions, fetchBudgetSummary } from "../api/api"; // centralized API import

const Charts = () => {
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [monthlyTrends, setMonthlyTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [txData, summaryData] = await Promise.all([
                    getTransactions(),
                    fetchBudgetSummary()
                ]);
                
                const txns = Array.isArray(txData) ? txData : txData?.transactions || [];

                setTransactions(txns);
                setTotalIncome(summaryData.totalIncome || 0);
                setTotalExpense(summaryData.totalExpenses || 0);

                // Calculate monthly trends
                const trends = calculateMonthlyTrends(txns);
                setMonthlyTrends(trends);

            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate monthly trends
    const calculateMonthlyTrends = (transactions) => {
        if (!Array.isArray(transactions)) return [];
        
        const monthlyData = {};
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expense: 0 };
            }
            
            if (tx.amount > 0) {
                monthlyData[monthKey].income += tx.amount;
            } else {
                monthlyData[monthKey].expense += Math.abs(tx.amount);
            }
        });
        
        return Object.entries(monthlyData)
            .map(([month, data]) => ({ month, ...data }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-6); // Last 6 months
    };

    // Calculate category spending
    const calculateCategorySpending = (transactions) => {
        if (!Array.isArray(transactions)) return { labels: [], values: [] };
        
        const categoryTotals = {};
        transactions.forEach(tx => {
            if (tx.amount < 0) {
                const category = tx.category || "Other";
                categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(tx.amount);
            }
        });
        
        return {
            labels: Object.keys(categoryTotals),
            values: Object.values(categoryTotals)
        };
    };

    if (loading) {
        return (
            <Layout>
                <div className="rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] p-6 sm:p-10">
                    <div className="animate-pulse">
                        <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="h-96 bg-slate-300 dark:bg-slate-700 rounded-3xl"></div>
                            <div className="h-96 bg-slate-300 dark:bg-slate-700 rounded-3xl"></div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] p-6 sm:p-10 space-y-10">
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1E2A45] dark:text-white">
                        Financial Analytics
                    </h2>
                    <p className="mt-4 text-lg sm:text-xl text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
                        Comprehensive visual analysis of your income and spending patterns.
                    </p>
                </div>

                {/* Monthly Trends Line Chart */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                >
                    <h3 className="text-2xl font-semibold text-[#1E2A45] dark:text-white mb-6 text-center">Monthly Trends</h3>
                    <MonthlyTrendsChart monthlyTrends={monthlyTrends} />
                </motion.div>

                {/* Pie Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <h3 className="text-xl font-semibold text-[#1E2A45] dark:text-white mb-4">Income vs Expense</h3>
                        <ExpenseChart totalIncome={totalIncome} totalExpense={totalExpense} />
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <h3 className="text-xl font-semibold text-[#1E2A45] dark:text-white mb-4">Spending by Category</h3>
                        <EnhancedPieChart 
                            data={calculateCategorySpending(transactions)}
                            title="💸 Category Breakdown"
                        />
                    </motion.div>
                </div>

                {/* Additional Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <h3 className="text-xl font-semibold text-[#1E2A45] dark:text-white mb-4">Detailed Category Analysis</h3>
                        <ExpenseCategoryChart transactions={transactions} />
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <h3 className="text-xl font-semibold text-[#1E2A45] dark:text-white mb-4">Financial Overview</h3>
                        <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl h-full flex flex-col justify-center">
                            <div className="text-center space-y-4">
                                <div className="text-6xl mb-4">💰</div>
                                <h4 className="text-2xl font-bold text-slate-800 dark:text-white">Total Income</h4>
                                <p className="text-4xl font-extrabold text-green-600">₹{totalIncome.toLocaleString()}</p>
                                <h4 className="text-2xl font-bold text-slate-800 dark:text-white mt-6">Total Expenses</h4>
                                <p className="text-4xl font-extrabold text-red-600">₹{totalExpense.toLocaleString()}</p>
                                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <h5 className="text-lg font-semibold text-slate-800 dark:text-white">Net Savings</h5>
                                    <p className={`text-3xl font-bold ${(totalIncome - totalExpense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ₹{(totalIncome - totalExpense).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Charts;
