import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MonthlyTrendsChart = ({ monthlyTrends = [] }) => {
    // Enhanced sample data for demonstration when no real data is available
    const sampleTrends = [
        { month: '2024-01', income: 85000, expense: 72000 },
        { month: '2024-02', income: 88000, expense: 75000 },
        { month: '2024-03', income: 92000, expense: 78000 },
        { month: '2024-04', income: 87000, expense: 82000 },
        { month: '2024-05', income: 95000, expense: 85000 },
        { month: '2024-06', income: 98000, expense: 88000 },
        { month: '2024-07', income: 102000, expense: 92000 },
        { month: '2024-08', income: 105000, expense: 95000 },
        { month: '2024-09', income: 108000, expense: 98000 },
        { month: '2024-10', income: 112000, expense: 102000 },
        { month: '2024-11', income: 115000, expense: 105000 },
        { month: '2024-12', income: 118000, expense: 108000 },
        { month: '2025-01', income: 125000, expense: 112000 },
        { month: '2025-02', income: 128000, expense: 115000 },
        { month: '2025-03', income: 132000, expense: 118000 },
        { month: '2025-04', income: 135000, expense: 122000 },
        { month: '2025-05', income: 138000, expense: 125000 },
        { month: '2025-06', income: 142000, expense: 128000 },
        { month: '2025-07', income: 145000, expense: 132000 },
        { month: '2025-08', income: 148000, expense: 135000 },
        { month: '2025-09', income: 152000, expense: 138000 }
    ];

    const displayTrends = monthlyTrends.length > 0 ? monthlyTrends : sampleTrends;

    const data = {
        labels: displayTrends.map(trend => {
            const [year, month] = trend.month.split('-');
            const date = new Date(year, month - 1);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }),
        datasets: [
            {
                label: 'Income',
                data: displayTrends.map(trend => trend.income),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#10B981',
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: 'Expenses',
                data: displayTrends.map(trend => trend.expense),
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#EF4444',
                pointBorderColor: '#EF4444',
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#64748b',
                    font: {
                        size: 12,
                        weight: '500'
                    }
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
                        return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                ticks: {
                    color: '#64748b',
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                ticks: {
                    color: '#64748b',
                    callback: function(value) {
                        return '₹' + value.toLocaleString();
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl w-full min-h-[400px] transition-all duration-500 hover:scale-[1.02]">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-6 tracking-tight">
                📊 Monthly Trends
            </h2>
            <div className="h-80">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default MonthlyTrendsChart;
