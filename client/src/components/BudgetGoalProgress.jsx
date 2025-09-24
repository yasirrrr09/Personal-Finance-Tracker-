const BudgetGoalProgress = ({ goals = [] }) => {
    // Log to check the structure of goals data
    console.log(goals);

    // Check if 'goals' is indeed an array
    if (!Array.isArray(goals)) {
        return <div className="text-red-500">Error: Invalid goals data</div>;
    }

    // Sample data for demonstration when no real data is available
    const sampleGoals = [
        { category: 'Food', goal: 8000, spent: -4850 },
        { category: 'Entertainment', goal: 3000, spent: -800 },
        { category: 'Transportation', goal: 2000, spent: -1050 },
        { category: 'Shopping', goal: 5000, spent: -2500 },
        { category: 'Healthcare', goal: 3000, spent: -2000 },
        { category: 'Utilities', goal: 2000, spent: -1200 }
    ];

    // Use sample data if no real goals are available
    const displayGoals = goals.length > 0 ? goals : sampleGoals;

    // 🛑 Savings ko filter out karo
    const filteredGoals = displayGoals.filter(
        (goal) => goal.category?.toLowerCase() !== "savings"
    );

    return (
        <div className="mt-5">
            <h4 className="text-lg font-semibold mb-4">Budget Goal Progress</h4>
            <div className="space-y-4">
                {filteredGoals.map(({ category, goal, spent }, idx) => {
                    const absoluteSpent = Math.abs(spent);
                    const percentage = Math.min((absoluteSpent / goal) * 100, 100);
                    const isOver = spent < 0 && absoluteSpent > goal;
                    const isSurplus = spent > 0;

                    return (
                        <div key={idx}>
                            <div className="flex justify-between mb-1">
                                <span className="font-medium text-sm">{category}</span>
                                <span className="text-sm">₹{-spent} / ₹{goal}</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-700 ease-out ${
                                        isOver
                                            ? "bg-red-500"
                                            : isSurplus
                                            ? "bg-green-500"
                                            : "bg-yellow-500"
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            {isOver && (
                                <div className="text-red-500 text-sm mt-1">
                                    Over budget by ₹{absoluteSpent - goal}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BudgetGoalProgress;
