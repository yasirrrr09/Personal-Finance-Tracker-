import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    Wallet,
    Plus,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Target,
    Calendar,
    DollarSign,
} from "lucide-react";
import AddTransaction from "./AddTransaction";
import ExpenseChart from "./ExpenseChart";
import BudgetGoalProgress from "./BudgetGoalProgress";
import DebtOverview from "./DebtOverview";
import NetWorthCard from "./NetWorthCard";
import MonthlyTrendsChart from "./MonthlyTrendsChart";
import EnhancedPieChart from "./EnhancedPieChart";
import FinancialInsights from "./FinancialInsights";
import SmartSuggestions from "./SmartSuggestions";
import Layout from "./Layout";

// Centralized API imports
import { getTransactions, fetchBudgetSummary, fetchCategoryGoals, fetchDebts, getBudgetTracking, getBudgetAlerts } from "../api/api";

const Dashboard = () => {
    const [userId, setUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [budgetGoals, setBudgetGoals] = useState([]);
    const [debts, setDebts] = useState([]);
    const [budgetTracking, setBudgetTracking] = useState([]);
    const [budgetAlerts, setBudgetAlerts] = useState([]);
    const [monthlyTrends, setMonthlyTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const totalBalance = totalIncome - totalExpense;
    const budgetUsed = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

    // Decode token and set userId
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
    }, [token]);

    // Enhanced sample data for demonstration
    const getSampleData = () => {
        return {
            totalIncome: 152000,
            totalExpense: 138000,
            transactions: [
                { _id: '1', title: 'Salary', amount: 152000, category: 'Income', date: '2024-09-15', paymentMethod: 'Bank Transfer' },
                { _id: '2', title: 'Freelance Project', amount: 25000, category: 'Income', date: '2024-09-10', paymentMethod: 'Bank Transfer' },
                { _id: '3', title: 'Grocery Shopping', amount: -8500, category: 'Food', date: '2024-09-14', paymentMethod: 'UPI' },
                { _id: '4', title: 'Movie Tickets', amount: -1200, category: 'Entertainment', date: '2024-09-13', paymentMethod: 'Credit Card' },
                { _id: '5', title: 'Uber Rides', amount: -3500, category: 'Transportation', date: '2024-09-12', paymentMethod: 'UPI' },
                { _id: '6', title: 'Coffee & Dining', amount: -4500, category: 'Food', date: '2024-09-11', paymentMethod: 'Credit Card' },
                { _id: '7', title: 'Online Shopping', amount: -12000, category: 'Shopping', date: '2024-09-10', paymentMethod: 'Credit Card' },
                { _id: '8', title: 'Gym Membership', amount: -3000, category: 'Healthcare', date: '2024-09-09', paymentMethod: 'Debit Card' },
                { _id: '9', title: 'Electricity Bill', amount: -2500, category: 'Utilities', date: '2024-09-08', paymentMethod: 'Net Banking' },
                { _id: '10', title: 'Restaurant', amount: -3500, category: 'Food', date: '2024-09-07', paymentMethod: 'UPI' },
                { _id: '11', title: 'Fuel', amount: -2800, category: 'Transportation', date: '2024-09-06', paymentMethod: 'Credit Card' },
                { _id: '12', title: 'Netflix Subscription', amount: -500, category: 'Entertainment', date: '2024-09-05', paymentMethod: 'Credit Card' },
                { _id: '13', title: 'Medical Checkup', amount: -4500, category: 'Healthcare', date: '2024-09-04', paymentMethod: 'Debit Card' },
                { _id: '14', title: 'Internet Bill', amount: -1200, category: 'Utilities', date: '2024-09-03', paymentMethod: 'Net Banking' },
                { _id: '15', title: 'Amazon Purchase', amount: -5500, category: 'Shopping', date: '2024-09-02', paymentMethod: 'Credit Card' }
            ],
            budgetGoals: [
                { category: 'Food', goal: 20000, spent: -16500 },
                { category: 'Entertainment', goal: 5000, spent: -1700 },
                { category: 'Transportation', goal: 8000, spent: -6300 },
                { category: 'Shopping', goal: 15000, spent: -17500 },
                { category: 'Healthcare', goal: 8000, spent: -7500 },
                { category: 'Utilities', goal: 5000, spent: -3700 }
            ],
            budgetTracking: [
                { category: 'Food', budgetGoal: 20000, currentSpent: 16500, percentage: 82.5 },
                { category: 'Entertainment', budgetGoal: 5000, currentSpent: 1700, percentage: 34.0 },
                { category: 'Transportation', budgetGoal: 8000, currentSpent: 6300, percentage: 78.8 },
                { category: 'Shopping', budgetGoal: 15000, currentSpent: 17500, percentage: 116.7 },
                { category: 'Healthcare', budgetGoal: 8000, currentSpent: 7500, percentage: 93.8 },
                { category: 'Utilities', budgetGoal: 5000, currentSpent: 3700, percentage: 74.0 }
            ],
            monthlyTrends: [
                { month: '2024-01', income: 85000, expense: 72000 },
                { month: '2024-02', income: 88000, expense: 75000 },
                { month: '2024-03', income: 92000, expense: 78000 },
                { month: '2024-04', income: 87000, expense: 82000 },
                { month: '2024-05', income: 95000, expense: 85000 },
                { month: '2024-06', income: 98000, expense: 88000 },
                { month: '2024-07', income: 102000, expense: 92000 },
                { month: '2024-08', income: 105000, expense: 95000 },
                { month: '2024-09', income: 152000, expense: 138000 }
            ],
            debts: [
                { _id: '1', name: 'Credit Card', amount: 15000, interestRate: 18.5, dueDate: '2024-02-15' },
                { _id: '2', name: 'Personal Loan', amount: 50000, interestRate: 12.0, dueDate: '2024-06-20' }
            ],
            budgetAlerts: [
                { _id: '1', message: 'You are approaching your Food budget limit (60% used)', type: 'warning', category: 'Food' },
                { _id: '2', message: 'Healthcare budget is 67% used', type: 'warning', category: 'Healthcare' }
            ]
        };
    };

    // Fetch all required data
    useEffect(() => {
        if (!userId || !token) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Use Promise.allSettled to handle individual API failures gracefully
                const [summaryResult, txsResult, goalsResult, debtsResult, budgetResult, alertsResult] = await Promise.allSettled([
                    fetchBudgetSummary(),
                    getTransactions(),
                    fetchCategoryGoals(),
                    fetchDebts(),
                    getBudgetTracking(),
                    getBudgetAlerts()
                ]);

                // Extract data from successful requests, use empty defaults for failed ones
                const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : { totalIncome: 0, totalExpenses: 0 };
                const txs = txsResult.status === 'fulfilled' ? txsResult.value : { transactions: [] };
                const goals = goalsResult.status === 'fulfilled' ? goalsResult.value : { categoryGoals: [] };
                const debtsData = debtsResult.status === 'fulfilled' ? debtsResult.value : [];
                const budgetData = budgetResult.status === 'fulfilled' ? budgetResult.value : { budgetTracking: [] };
                const alertsData = alertsResult.status === 'fulfilled' ? alertsResult.value : { alerts: [] };

                // Check if we have real data, otherwise use sample data
                const hasRealData = summary.totalIncome > 0 || (txs.transactions && txs.transactions.length > 0);
                
                if (hasRealData) {
                    // Set real data
                    setTotalIncome(summary.totalIncome);
                    setTotalExpense(summary.totalExpenses);
                    setTransactions(txs.transactions || []);
                    setBudgetGoals(goals.categoryGoals || []);
                    setDebts(debtsData || []);
                    setBudgetTracking(budgetData.budgetTracking || []);
                    setBudgetAlerts(alertsData.alerts || []);
                    
                    // Calculate monthly trends
                    const trends = calculateMonthlyTrends(txs.transactions || []);
                    setMonthlyTrends(trends);
                } else {
                    // Use sample data for demonstration
                    const sampleData = getSampleData();
                    setTotalIncome(sampleData.totalIncome);
                    setTotalExpense(sampleData.totalExpense);
                    setTransactions(sampleData.transactions);
                    setBudgetGoals(sampleData.budgetGoals);
                    setDebts(sampleData.debts);
                    setBudgetTracking(sampleData.budgetTracking);
                    setBudgetAlerts(sampleData.budgetAlerts);
                    setMonthlyTrends(sampleData.monthlyTrends);
                }

            } catch (err) {
                console.error("Dashboard fetch error:", err);
                // Fallback to sample data on error
                const sampleData = getSampleData();
                setTotalIncome(sampleData.totalIncome);
                setTotalExpense(sampleData.totalExpense);
                setTransactions(sampleData.transactions);
                setBudgetGoals(sampleData.budgetGoals);
                setDebts(sampleData.debts);
                setBudgetTracking(sampleData.budgetTracking);
                setBudgetAlerts(sampleData.budgetAlerts);
                setMonthlyTrends(sampleData.monthlyTrends);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, token]);

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

    // Calculate total spent per category
    const calculateSpentPerCategory = (transactions) => {
        if (!Array.isArray(transactions)) return {}; // safety check
        const spentPerCategory = {};
        transactions.forEach(tx => {
            if (spentPerCategory[tx.category]) {
                spentPerCategory[tx.category] += tx.amount;
            } else {
                spentPerCategory[tx.category] = tx.amount;
            }
        });
        return spentPerCategory;
    };

    // Calculate financial insights
    const getFinancialInsights = () => {
        const insights = [];
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
        
        if (savingsRate > 20) {
            insights.push({ type: 'success', message: 'Great job! You\'re saving more than 20% of your income.' });
        } else if (savingsRate < 10) {
            insights.push({ type: 'warning', message: 'Consider increasing your savings rate to at least 10%.' });
        }
        
        const exceededBudgets = budgetTracking.filter(b => b.percentage >= 100).length;
        if (exceededBudgets > 0) {
            insights.push({ type: 'error', message: `You've exceeded ${exceededBudgets} budget category${exceededBudgets > 1 ? 'ies' : ''}.` });
        }
        
        const warningBudgets = budgetTracking.filter(b => b.percentage >= 80 && b.percentage < 100).length;
        if (warningBudgets > 0) {
            insights.push({ type: 'warning', message: `${warningBudgets} budget categor${warningBudgets > 1 ? 'ies are' : 'y is'} approaching the limit.` });
        }
        
        return insights;
    };

    // Merge budget goals with spent data
    const budgetGoalsWithSpent = budgetGoals.map(goal => {
        const spent = calculateSpentPerCategory(transactions)[goal.category] || 0;
        return {
            ...goal,
            spent
        };
    });

    if (loading) {
        return (
            <Layout>
                <div className="p-8 bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] text-slate-800 dark:text-white rounded-3xl shadow-xl sm:px-10">
                    <div className="animate-pulse">
                        <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded mb-12"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-slate-300 dark:bg-slate-700 rounded-2xl"></div>
                            ))}
                        </div>
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
            <div className={`p-8 transition-all duration-500 ease-in-out relative ${showModal ? "blur-sm pointer-events-none" : ""} 
                bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e]
                text-slate-800 dark:text-white rounded-3xl shadow-xl sm:px-10`}>
                
                <h2 className="text-4xl font-extrabold mb-12 text-center md:text-left tracking-tight">
                    Your Financial Overview
                </h2>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[{
                        title: "Total Balance",
                        amount: totalBalance,
                        icon: <Wallet className="w-8 h-8 text-green-500" />,
                        textColor: totalBalance >= 0 ? "text-green-600" : "text-red-500",
                    }, {
                        title: "Total Income",
                        amount: totalIncome,
                        icon: <ArrowUpRight className="w-8 h-8 text-blue-600" />,
                        textColor: "text-blue-600",
                    }, {
                        title: "Total Expense",
                        amount: totalExpense,
                        icon: <ArrowDownRight className="w-8 h-8 text-red-500" />,
                        textColor: "text-red-500",
                    }].map(({ title, amount, icon, textColor }, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-gradient-to-tr from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] shadow-xl border border-slate-200 dark:border-slate-700 transform hover:scale-[1.05] transition-all duration-300 ease-in-out">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">{title}</h3>
                                {icon}
                            </div>
                            <p className={`text-3xl font-bold ${textColor}`}>
                                ₹{amount !== undefined && amount !== null ? amount.toLocaleString() : "0"}
                            </p>
                        </div>
                    ))}
                    <NetWorthCard income={totalIncome} expense={totalExpense} />
                </div>

                {/* Budget Progress */}
                <div className="flex flex-col space-y-4 mt-16">
                    <h4 className="text-xl font-semibold">Monthly Budget Usage</h4>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div className="bg-blue-500 h-4 transition-all duration-700 ease-out" style={{ width: `${budgetUsed}%` }} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        ₹{totalExpense !== undefined && totalExpense !== null ? totalExpense.toLocaleString() : "0"} spent out of ₹{totalIncome !== undefined && totalIncome !== null ? totalIncome.toLocaleString() : "0"}
                    </p>
                </div>

                {/* Financial Insights and Smart Suggestions */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FinancialInsights 
                        insights={getFinancialInsights()} 
                        budgetTracking={budgetTracking}
                        totalIncome={totalIncome}
                        totalExpense={totalExpense}
                    />
                    <SmartSuggestions transactions={transactions} />
                </div>

                {/* Charts Section */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold mb-8 text-center">📊 Financial Analytics</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <MonthlyTrendsChart monthlyTrends={monthlyTrends} />
                        <EnhancedPieChart 
                            data={{
                                labels: Object.keys(calculateSpentPerCategory(transactions)),
                                values: Object.values(calculateSpentPerCategory(transactions))
                            }}
                            title="💸 Spending by Category"
                        />
                    </div>
                </div>

                {/* Budget Goals & Expense Chart */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-xl font-semibold">Budget Goals</h4>
                        <BudgetGoalProgress goals={budgetGoalsWithSpent} />
                    </div>
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-xl font-semibold">Income vs Expense</h4>
                        <ExpenseChart totalIncome={totalIncome} totalExpense={totalExpense} />
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-16">
                    <h4 className="text-xl font-semibold mb-6">Recent Transactions</h4>
                    <ul className="space-y-4">
                        {transactions.slice(0, 3).map((tx, idx) => (
                            <li key={idx} className="flex justify-between items-center text-sm bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                                <span className="font-semibold">{tx.category}</span>
                                <span className={tx.amount > 0 ? "text-green-500" : "text-red-500"}>
                                    ₹{tx.amount !== undefined && tx.amount !== null ? tx.amount.toLocaleString() : "0"}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Savings */}
                <div className="mt-16">
                    <h4 className="text-xl font-semibold mb-4">Savings This Month</h4>
                    <p className="text-4xl font-extrabold text-green-600">
                        ₹{(totalIncome - totalExpense) !== undefined && (totalIncome - totalExpense) !== null ? (totalIncome - totalExpense).toLocaleString() : "0"}
                    </p>
                </div>

                {/* Debt Overview */}
                <DebtOverview debts={debts} />
            </div>

            {/* Floating Add Button */}
            <button onClick={() => setShowModal(true)} className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-2xl z-50 transition-all duration-300">
                <Plus className="w-8 h-8" />
            </button>

            {/* Modal for Add Transaction */}
            {showModal && userId && (
                <div className="fixed inset-0 z-40 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
                    <div className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <AddTransaction userId={userId} onSuccess={() => setShowModal(false)} />
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
