import PropTypes from "prop-types";
import { useState } from "react";
import { CATEGORIES } from "../constants/categories";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export function TransactionModal({
  isOpen,
  onClose,
  isAdvancedMode,
  amount,
  setAmount,
  description,
  setDescription,
  category,
  setCategory,
  handleSubmit,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transactionType, setTransactionType] = useState("income");

  if (!isOpen) return null;

  const handleTypeChange = (type) => {
    setTransactionType(type);
    if (type === "income") {
      setAmount(Math.abs(amount || 0));
    } else {
      setAmount(-Math.abs(amount || 0));
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTransactionSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    handleSubmit(transactionType)(e);
    // Reset form state
    setIsExpanded(false);
    setTransactionType("income");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Transaction Type Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            className={`py-4 px-6 rounded-lg font-semibold transition-colors flex flex-col items-center justify-center
              ${
                transactionType === "income"
                  ? "bg-green-600 text-white ring-2 ring-green-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => handleTypeChange("income")}
          >
            <ArrowUpIcon className="w-6 h-6 mb-1" />
            <span>Income</span>
          </button>
          <button
            className={`py-4 px-6 rounded-lg font-semibold transition-colors flex flex-col items-center justify-center
              ${
                transactionType === "expense"
                  ? "bg-red-600 text-white ring-2 ring-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => handleTypeChange("expense")}
          >
            <ArrowDownIcon className="w-6 h-6 mb-1" />
            <span>Expense</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Quick Title Input */}
          <input
            type="text"
            placeholder="Transaction Name"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          {/* Amount Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              placeholder="0.00"
              value={amount ? Math.abs(amount) : ""}
              onChange={(e) =>
                setAmount(
                  transactionType === "income"
                    ? Math.abs(e.target.value)
                    : -Math.abs(e.target.value)
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && amount && description) {
                  handleTransactionSubmit(e);
                }
              }}
              className="w-full pl-8 p-3 border rounded-lg"
              required
            />
          </div>

          {/* More Details Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-2 text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2"
          >
            {isExpanded ? "Less Details" : "More Details"}
            <ChevronDownIcon
              className={`w-5 h-5 transform transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Expanded Section */}
          {isExpanded && (
            <div className="space-y-4 pt-2">
              {/* Description Textarea */}
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border rounded-lg resize-none h-24"
                rows={3}
              />

              {/* Categories - Only in Advanced Mode */}
              {isAdvancedMode && (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select Category (Optional)</option>
                  <optgroup
                    label={
                      transactionType === "income"
                        ? "Income Categories"
                        : "Expense Categories"
                    }
                  >
                    {(transactionType === "income"
                      ? CATEGORIES.INCOME
                      : CATEGORIES.EXPENSE
                    ).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleTransactionSubmit}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors
              ${
                transactionType === "income"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            Add {transactionType === "income" ? "Income" : "Expense"}
          </button>
        </div>
      </div>
    </div>
  );
}

TransactionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  amount: PropTypes.number,
  setAmount: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  setDescription: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
