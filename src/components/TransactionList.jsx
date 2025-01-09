import PropTypes from "prop-types";
import { CATEGORIES } from "../constants/categories";

export function TransactionList({
  transactions,
  isAdvancedMode,
  handleDelete,
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mt-4">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      {transactions.length === 0 ? (
        <div className="text-gray-600">No transactions found</div>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
            >
              <div>
                <div className="font-semibold">{transaction.description}</div>
                <div className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                  {isAdvancedMode && (
                    <>
                      {" • "}
                      {
                        [...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE].find(
                          (cat) => cat.id === transaction.category
                        )?.label
                      }
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold ${
                    transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${transaction.amount.toFixed(2)}
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
      )}
    </div>
  );
}

TransactionList.propTypes = {
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
};
