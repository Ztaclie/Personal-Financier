import PropTypes from "prop-types";
import { CATEGORIES } from "../../constants/categories";
import { TrashIcon } from '@heroicons/react/24/outline';

export function TableView({ transactions, isAdvancedMode, handleDelete }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Date</th>
            <th className="text-left p-3">Description</th>
            {isAdvancedMode && <th className="text-left p-3">Category</th>}
            <th className="text-right p-3">Amount</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="p-3">{transaction.description}</td>
              {isAdvancedMode && (
                <td className="p-3">
                  {
                    [...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE].find(
                      (cat) => cat.id === transaction.category
                    )?.label
                  }
                </td>
              )}
              <td
                className={`p-3 text-right font-semibold ${
                  transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${Math.abs(transaction.amount).toFixed(2)}
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TableView.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
