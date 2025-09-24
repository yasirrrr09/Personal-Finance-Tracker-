import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Target } from "lucide-react";

const FinancialInsights = ({ insights = [], budgetTracking = [], totalIncome = 0, totalExpense = 0 }) => {
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    const totalBudget = budgetTracking.reduce((sum, budget) => sum + budget.budgetGoal, 0);
    const totalSpent = budgetTracking.reduce((sum, budget) => sum + budget.currentSpent, 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Enhanced sample insights for demonstration when no real data
    const sampleInsights = [
        { type: 'success', message: 'Excellent! Your savings rate is 15.2% - well above the recommended 10%' },
        { type: 'info', message: 'Your income has grown 18% year-over-year, outpacing inflation' },
        { type: 'warning', message: 'Dining expenses increased 23% this quarter - consider meal planning' },
        { type: 'success', message: 'Great job! You\'re managing your Entertainment budget well (27% used)' },
        { type: 'warning', message: 'Healthcare budget is 67% used - monitor your spending' },
        { type: 'info', message: 'You have ₹15,000+ monthly surplus available for investments' }
    ];

    // Use sample insights if no real insights are available
    const displayInsights = insights.length > 0 ? insights : sampleInsights;

    const getInsightIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'error':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getInsightColor = (type) => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
            case 'error':
                return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
            default:
                return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
        }
    };

    return (
        <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 tracking-tight">
                💡 Financial Insights
            </h3>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Savings Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {savingsRate.toFixed(1)}%
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Budget Used</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {budgetUtilization.toFixed(1)}%
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Alerts</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">
                        {displayInsights.length}
                    </div>
                </div>
            </div>

            {/* Insights List */}
            <div className="space-y-3">
                {displayInsights.map((insight, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-xl border ${getInsightColor(insight.type)} transition-all hover:shadow-md`}
                    >
                        <div className="flex items-start gap-3">
                            {getInsightIcon(insight.type)}
                            <p className="text-slate-700 dark:text-slate-300 flex-1">
                                {insight.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Budget Status Summary */}
            {budgetTracking.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Budget Status</h4>
                    <div className="space-y-2">
                        {budgetTracking.slice(0, 3).map((budget, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 dark:text-slate-400">{budget.category}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${
                                                budget.percentage >= 100 ? 'bg-red-500' :
                                                budget.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-slate-600 dark:text-slate-400 w-12 text-right">
                                        {budget.percentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialInsights;
