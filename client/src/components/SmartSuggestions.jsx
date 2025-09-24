import { useState, useEffect } from "react";
import { 
    Lightbulb, 
    TrendingUp, 
    TrendingDown, 
    AlertTriangle, 
    CheckCircle, 
    Target,
    DollarSign,
    Calendar,
    BarChart3
} from "lucide-react";
import { getSmartSuggestions, getAISuggestions } from "../api/api";

const SmartSuggestions = ({ transactions = [] }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [insights, setInsights] = useState([]);
    const [summary, setSummary] = useState({});
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('basic'); // 'basic' or 'ai'

    // Sample AI insights for demonstration
    const sampleAISuggestions = [
        {
            title: "Smart Investment Opportunity Detected",
            message: "Based on your spending patterns, you have ₹15,000+ surplus monthly that could be invested in SIPs for long-term wealth building.",
            action: "Consider starting a ₹10,000 monthly SIP in index funds",
            reasoning: "Your income has grown 18% YoY while expenses increased only 12%, creating investment capacity",
            priority: "high",
            type: "investment"
        },
        {
            title: "Expense Optimization Alert",
            message: "AI analysis shows you're spending 23% more on dining out compared to last quarter. This could be optimized.",
            action: "Try meal prepping 3 days a week to save ₹8,000 monthly",
            reasoning: "Dining expenses increased from ₹12,000 to ₹15,000 monthly without corresponding income growth",
            priority: "medium",
            type: "optimization"
        }
    ];

    useEffect(() => {
        if (transactions.length === 0) {
            setLoading(false);
            return;
        }

        fetchSuggestions();
    }, [transactions]);

    const fetchSuggestions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch both basic and AI suggestions in parallel
            const [basicResponse, aiResponse] = await Promise.allSettled([
                getSmartSuggestions(transactions),
                getAISuggestions(transactions)
            ]);
            
            // Handle basic suggestions
            if (basicResponse.status === 'fulfilled' && basicResponse.value.success) {
                setSuggestions(basicResponse.value.data.suggestions || []);
                setInsights(basicResponse.value.data.insights || []);
                setSummary(basicResponse.value.data.summary || {});
            } else {
                console.error("Basic suggestions error:", basicResponse.reason);
                // Don't show error popup, just log it
            }
            
            // Handle AI suggestions
            if (aiResponse.status === 'fulfilled' && aiResponse.value.success) {
                setAiSuggestions(aiResponse.value.ai_suggestions || []);
            } else {
                console.error("AI suggestions error:", aiResponse.reason);
                // Don't show error popup, just log it
            }
            
        } catch (err) {
            console.error("Error fetching suggestions:", err);
            // Don't show error popup, just log it
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'border-red-500 bg-red-50 dark:bg-red-900/20';
            case 'medium':
                return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'low':
                return 'border-green-500 bg-green-50 dark:bg-green-900/20';
            default:
                return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'medium':
                return <Target className="w-5 h-5 text-yellow-500" />;
            case 'low':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            default:
                return <Lightbulb className="w-5 h-5 text-blue-500" />;
        }
    };

    const getSuggestionIcon = (type) => {
        switch (type) {
            case 'high_spending':
                return <TrendingUp className="w-5 h-5 text-red-500" />;
            case 'moderate_spending':
                return <Target className="w-5 h-5 text-yellow-500" />;
            case 'spending_spike':
                return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'weekly_pattern':
                return <Calendar className="w-5 h-5 text-blue-500" />;
            case 'low_savings':
                return <TrendingDown className="w-5 h-5 text-red-500" />;
            case 'excellent_savings':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            default:
                return <Lightbulb className="w-5 h-5 text-blue-500" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 tracking-tight">
                    🤖 Smart Suggestions
                </h3>
                <div className="text-center py-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-slate-600 dark:text-slate-300 text-lg mb-2">
                        Smart suggestions unavailable
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    // Sample data for demonstration when no transactions are available
    const sampleSuggestions = [
        {
            type: "high_spending",
            category: "Food",
            amount: 15000,
            percentage: 35.2,
            message: "You're spending 35.2% of your budget on Food. Consider reducing it by 15-20%.",
            priority: "high",
            action: "Try to reduce Food expenses by ₹2,250 this month."
        },
        {
            type: "moderate_spending",
            category: "Entertainment",
            amount: 8000,
            percentage: 18.7,
            message: "Your Entertainment expenses are 18.7% of total spending. Monitor this category.",
            priority: "medium",
            action: "Consider setting a monthly limit for Entertainment expenses."
        },
        {
            type: "low_savings",
            message: "Your savings rate is only 8.5%. Financial experts recommend saving at least 20%.",
            priority: "high",
            action: "Try to increase your savings by reducing discretionary expenses."
        }
    ];

    const sampleInsights = [
        {
            type: "top_category",
            message: "Your biggest expense category is Food (₹15,000)",
            icon: "📊"
        },
        {
            type: "payment_method",
            message: "You prefer using UPI for most transactions",
            icon: "💳"
        }
    ];

    const sampleSummary = {
        total_income: 45000,
        total_expenses: 42000,
        net_savings: 3000,
        savings_rate: 6.7,
        avg_daily_expense: 1400,
        total_transactions: 25,
        categories_used: 8
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 tracking-tight">
                    🤖 Smart Suggestions
                </h3>

                {/* Sample Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Income</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">
                            ₹{sampleSummary.total_income.toLocaleString()}
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Expenses</span>
                        </div>
                        <div className="text-xl font-bold text-red-600">
                            ₹{sampleSummary.total_expenses.toLocaleString()}
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Savings Rate</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                            {sampleSummary.savings_rate.toFixed(1)}%
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Categories</span>
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                            {sampleSummary.categories_used}
                        </div>
                    </div>
                </div>

                {/* Sample Suggestions */}
                <div className="mb-8">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        Sample Suggestions (Demo Data)
                    </h4>
                    <div className="space-y-4">
                        {sampleSuggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-xl border-l-4 ${getPriorityColor(suggestion.priority)} transition-all hover:shadow-md`}
                            >
                                <div className="flex items-start gap-3">
                                    {getSuggestionIcon(suggestion.type)}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-slate-800 dark:text-white">
                                                {suggestion.message}
                                            </span>
                                            {getPriorityIcon(suggestion.priority)}
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                                            {suggestion.action}
                                        </p>
                                        {suggestion.amount && (
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                Amount: ₹{suggestion.amount.toLocaleString()}
                                                {suggestion.percentage && ` (${suggestion.percentage}% of budget)`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sample Insights */}
                <div>
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        Sample Insights (Demo Data)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sampleInsights.map((insight, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{insight.icon}</span>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                                        {insight.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Demo Notice */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="flex items-center gap-2">
                        <div className="text-blue-500">ℹ️</div>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                            This is sample data for demonstration. Add real transactions to get personalized suggestions!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-slate-100/60 to-slate-200/60 dark:from-[#0c0f1c] dark:to-[#1a1d2e] border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 tracking-tight">
                🤖 Smart Suggestions
            </h3>

            {/* Summary Stats */}
            {Object.keys(summary).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Income</span>
                        </div>
                        <div className="text-xl font-bold text-green-600">
                            ₹{summary.total_income?.toLocaleString() || 0}
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Expenses</span>
                        </div>
                        <div className="text-xl font-bold text-red-600">
                            ₹{summary.total_expenses?.toLocaleString() || 0}
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Savings Rate</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                            {summary.savings_rate?.toFixed(1) || 0}%
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4 text-purple-500" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Categories</span>
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                            {summary.categories_used || 0}
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === 'basic'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        <Lightbulb className="w-4 h-4 inline mr-2" />
                        Basic Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab('ai')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === 'ai'
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        <Target className="w-4 h-4 inline mr-2" />
                        AI Insights
                    </button>
                </div>
            </div>

            {/* Suggestions */}
            <div className="mb-8">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    {activeTab === 'basic' ? (
                        <>
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            Personalized Suggestions
                        </>
                    ) : (
                        <>
                            <Target className="w-5 h-5 text-purple-500" />
                            AI-Powered Insights
                        </>
                    )}
                </h4>
                
                {activeTab === 'basic' ? (
                    suggestions.length === 0 ? (
                        <div className="text-center py-6">
                            <div className="text-4xl mb-2">🎉</div>
                            <p className="text-slate-600 dark:text-slate-300">
                                Great! No immediate suggestions at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl border-l-4 ${getPriorityColor(suggestion.priority)} transition-all hover:shadow-md`}
                                >
                                    <div className="flex items-start gap-3">
                                        {getSuggestionIcon(suggestion.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-slate-800 dark:text-white">
                                                    {suggestion.message}
                                                </span>
                                                {getPriorityIcon(suggestion.priority)}
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                                                {suggestion.action}
                                            </p>
                                            {suggestion.amount && (
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    Amount: ₹{suggestion.amount.toLocaleString()}
                                                    {suggestion.percentage && ` (${suggestion.percentage}% of budget)`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    (aiSuggestions.length === 0 && transactions.length === 0) ? (
                        <div className="text-center py-6">
                            <div className="text-4xl mb-2">🤖</div>
                            <p className="text-slate-600 dark:text-slate-300">
                                AI is analyzing your spending patterns...
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                                Add more transactions to get personalized AI insights
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(aiSuggestions.length > 0 ? aiSuggestions : sampleAISuggestions).map((suggestion, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-xl border-l-4 ${getPriorityColor(suggestion.priority)} transition-all hover:shadow-md`}
                                >
                                    <div className="flex items-start gap-3">
                                        <Target className="w-5 h-5 text-purple-500" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-slate-800 dark:text-white">
                                                    {suggestion.title || suggestion.message}
                                                </span>
                                                {getPriorityIcon(suggestion.priority)}
                                                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                                                    AI
                                                </span>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">
                                                {suggestion.message}
                                            </p>
                                            {suggestion.action && (
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2 font-medium">
                                                    💡 {suggestion.action}
                                                </p>
                                            )}
                                            {suggestion.reasoning && (
                                                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                                    <strong>Why:</strong> {suggestion.reasoning}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Insights */}
            {insights.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-500" />
                        Spending Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{insight.icon}</span>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                                        {insight.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartSuggestions;
