import PropTypes from "prop-types";

export function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Total Balance</h2>
        <div
          className={`text-3xl font-bold ${
            summary.total >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          ${summary.total.toFixed(2)}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Total Income</h2>
        <div className="text-3xl font-bold text-green-600">
          ${summary.income.toFixed(2)}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Total Expenses</h2>
        <div className="text-3xl font-bold text-red-600">
          ${summary.expenses.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

SummaryCards.propTypes = {
  summary: PropTypes.shape({
    total: PropTypes.number.isRequired,
    income: PropTypes.number.isRequired,
    expenses: PropTypes.number.isRequired,
  }).isRequired,
};
