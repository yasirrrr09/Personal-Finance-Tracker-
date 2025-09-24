import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const ExpenseCategoryChart = ({ transactions = [] }) => {
    // Sample data for demonstration when no real data is available
    const sampleCategoryTotals = {
        "Food": 4850,
        "Shopping": 2500,
        "Healthcare": 2000,
        "Utilities": 1200,
        "Transportation": 1050,
        "Entertainment": 800
    };

    // Ensure safe array extraction
    const safeTxns = Array.isArray(transactions)
        ? transactions
        : transactions?.transactions || [];

    const categoryTotals = safeTxns.reduce((acc, txn) => {
        if (txn.amount < 0) {
            const category = txn.category || "Other";
            acc[category] = (acc[category] || 0) + Math.abs(txn.amount);
        }
        return acc;
    }, {});

    // Use sample data if no real data is available
    const displayData = Object.keys(categoryTotals).length > 0 ? categoryTotals : sampleCategoryTotals;

    const data = {
        labels: Object.keys(displayData),
        datasets: [
            {
                data: Object.values(displayData),
                backgroundColor: [
                    "#EF4444", "#F59E0B", "#10B981",
                    "#3B82F6", "#8B5CF6", "#EC4899",
                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#64748b",
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl w-full min-h-[400px] flex flex-col justify-center transition-all duration-500 hover:scale-[1.02]">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-6 tracking-tight">
                💸 Category-wise Expenses
            </h2>
            <div className="flex-grow flex items-center justify-center">
                <div className="w-60 h-60 sm:w-72 sm:h-72">
                    <Doughnut data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default ExpenseCategoryChart;
