
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ totalIncome, totalExpense }) => {
    // Use sample data if both income and expense are 0
    const displayIncome = (totalIncome || 0) > 0 ? totalIncome : 45000;
    const displayExpense = (totalExpense || 0) > 0 ? totalExpense : 42000;
    
    const data = {
        labels: ["Income", "Expense"],
        datasets: [
            {
                data: [displayIncome, displayExpense],
                backgroundColor: ["#34D399", "#EF4444"],
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
                💰 Income vs Expense
            </h2>
            <div className="flex-grow flex items-center justify-center">
                <div className="w-60 h-60 sm:w-72 sm:h-72">
                    <Pie data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default ExpenseChart;
