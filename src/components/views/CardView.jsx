import PropTypes from "prop-types";
import { CATEGORIES } from "../../constants/categories";
import { TrashIcon } from "@heroicons/react/24/outline";

export function CardView({ transactions, isAdvancedMode, handleDelete }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold">{transaction.description}</h3>
            <button
              onClick={() => handleDelete(transaction.id)}
              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <div
              className={`text-xl font-bold ${
                transaction.amount >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${Math.abs(transaction.amount).toFixed(2)}
            </div>

            <div className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString()}
            </div>

            {isAdvancedMode && (
              <div className="text-sm text-gray-600">
                {
                  [...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE].find(
                    (cat) => cat.id === transaction.category
                  )?.label
                }
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

CardView.propTypes = {
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
