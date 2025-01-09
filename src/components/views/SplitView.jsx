import PropTypes from 'prop-types';
import { CATEGORIES } from '../../constants/categories';

export function SplitView({ transactions, isAdvancedMode, handleDelete }) {
  const income = transactions.filter(t => t.amount >= 0);
  const expenses = transactions.filter(t => t.amount < 0);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Income List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-green-600">Income</h3>
        <div className="space-y-3">
          {income.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              isAdvancedMode={isAdvancedMode}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Expenses</h3>
        <div className="space-y-3">
          {expenses.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              isAdvancedMode={isAdvancedMode}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TransactionItem({ transaction, isAdvancedMode, handleDelete }) {
  return (
    <div className="flex justify-between items-start p-3 border rounded hover:bg-gray-50">
      <div>
        <div className="font-semibold">{transaction.description}</div>
        <div className="text-sm text-gray-500">
          {new Date(transaction.date).toLocaleDateString()}
          {isAdvancedMode && (
            <>
              {' • '}
              {[...CATEGORIES.INCOME, ...CATEGORIES.EXPENSE]
                .find(cat => cat.id === transaction.category)?.label}
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-semibold ${
          transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
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
  );
}

// PropTypes for the main component
SplitView.propTypes = {
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

// PropTypes for the child component
TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
}; 