import React from "react";
import PropTypes from "prop-types";
import { CATEGORIES } from "../../constants/categories";

export function TimelineView({
  transactions,
  isAdvancedMode,
  handleDelete,
  groupBy = "day",
}) {
  const groupedTransactions = React.useMemo(() => {
    return transactions.reduce((groups, transaction) => {
      const date = new Date(transaction.date);
      let key;

      switch (groupBy) {
        case "week":
          key = getWeekNumber(date);
          break;
        case "month":
          key = date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          break;
        case "year":
          key = date.getFullYear().toString();
          break;
        default: // day
          key = date.toLocaleDateString();
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(transaction);
      return groups;
    }, {});
  }, [transactions, groupBy]);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(
        ([dateGroup, groupTransactions]) => (
          <div key={dateGroup} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{dateGroup}</h3>
            <div className="space-y-3">
              {groupTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-start p-3 border rounded hover:bg-gray-50"
                >
                  <div>
                    <div className="font-semibold">
                      {transaction.description}
                    </div>
                    {isAdvancedMode && (
                      <div className="text-sm text-gray-500">
                        {
                          [...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE].find(
                            (cat) => cat.id === transaction.category
                          )?.label
                        }
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold ${
                        transaction.amount >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

TimelineView.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  groupBy: PropTypes.oneOf(["day", "week", "month", "year"]),
};

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return `Week ${Math.ceil(
    (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
  )} - ${date.getFullYear()}`;
}
