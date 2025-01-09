import PropTypes from "prop-types";
import { CATEGORIES } from "../constants/categories";

export function CategorySummary({ categoryTotals }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Category Summary</h2>
      <div className="space-y-3">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-green-600 mb-2">Income</h3>
          {CATEGORIES.INCOME.map((category) => {
            const total = categoryTotals[category.id] || 0;
            return (
              <div
                key={category.id}
                className="flex justify-between items-center py-1"
              >
                <span className="text-gray-600">{category.label}</span>
                <span className="font-semibold text-green-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        <div>
          <h3 className="text-lg font-medium text-red-600 mb-2">Expenses</h3>
          {CATEGORIES.EXPENSE.map((category) => {
            const total = categoryTotals[category.id] || 0;
            return (
              <div
                key={category.id}
                className="flex justify-between items-center py-1"
              >
                <span className="text-gray-600">{category.label}</span>
                <span className="font-semibold text-red-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

CategorySummary.propTypes = {
  categoryTotals: PropTypes.objectOf(PropTypes.number).isRequired,
};
