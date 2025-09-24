import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const EnhancedPieChart = ({ data, title, colors = [] }) => {
    const defaultColors = [
        "#EF4444", "#F59E0B", "#10B981", "#3B82F6", 
        "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
        "#F97316", "#6366F1", "#14B8A6", "#F43F5E"
    ];

    // Sample data for demonstration when no real data is available
    const sampleData = {
        labels: ['Food', 'Entertainment', 'Transportation', 'Shopping', 'Healthcare', 'Utilities'],
        values: [4850, 800, 1050, 2500, 2000, 1200]
    };

    const displayData = (!data.labels || data.labels.length === 0) ? sampleData : data;

    const chartData = {
        labels: displayData.labels || [],
        datasets: [
            {
                data: displayData.values || [],
                backgroundColor: colors.length > 0 ? colors : defaultColors.slice(0, displayData.labels?.length || 0),
                borderWidth: 2,
                borderColor: '#fff',
                hoverBorderWidth: 3,
                hoverBorderColor: '#374151',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#64748b",
                    font: {
                        size: 12,
                        weight: '500'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#374151',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
                    }
                }
            }
        },
        interaction: {
            intersect: false,
        },
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000
        }
    };

    return (
        <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl w-full min-h-[400px] flex flex-col justify-center transition-all duration-500 hover:scale-[1.02]">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-6 tracking-tight">
                {title}
            </h2>
            <div className="flex-grow flex items-center justify-center">
                <div className="w-60 h-60 sm:w-72 sm:h-72">
                    <Pie data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default EnhancedPieChart;
