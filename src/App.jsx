import { useState, useEffect, useMemo } from "react";
import { CATEGORIES } from "./constants/categories";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Load transactions from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Filter transactions based on search, date, and category
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      let matchesDate = true;

      if (dateFilter === "custom" && startDate && endDate) {
        const transactionDate = new Date(transaction.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        matchesDate = transactionDate >= start && transactionDate <= end;
      } else if (dateFilter === "month") {
        const today = new Date();
        const transactionDate = new Date(transaction.date);
        matchesDate =
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear();
      }

      return matchesSearch && matchesDate;
    });
  }, [transactions, searchTerm, dateFilter, startDate, endDate]);

  // Calculate summaries
  const summary = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const amount = transaction.amount;
        acc.total += amount;
        if (amount >= 0) {
          acc.income += amount;
        } else {
          acc.expenses += Math.abs(amount);
        }
        return acc;
      },
      { total: 0, income: 0, expenses: 0 }
    );
  }, [filteredTransactions]);

  // Calculate category totals for charts
  const categoryTotals = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += Math.abs(transaction.amount);
      return acc;
    }, {});
  }, [filteredTransactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription("");
    setAmount("");
    setCategory("");
  };

  const handleDelete = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <h1 className="text-white text-2xl font-bold">Finance Tracker</h1>
      </nav>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Summary Cards */}
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

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded"
            />

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === "custom" && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add Transaction Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Amount (use negative for expenses)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                <optgroup label="Income">
                  {CATEGORIES.INCOME.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Expenses">
                  {CATEGORIES.EXPENSE.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Add Transaction
              </button>
            </form>
          </div>

          {/* Category Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Category Summary</h2>
            <div className="space-y-2">
              {Object.entries(categoryTotals).map(([category, total]) => {
                const categoryInfo = [
                  ...CATEGORIES.INCOME,
                  ...CATEGORIES.EXPENSE,
                ].find((cat) => cat.id === category);
                return (
                  <div
                    key={category}
                    className="flex justify-between items-center"
                  >
                    <span>{categoryInfo?.label || category}</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white p-6 rounded-lg shadow mt-4">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          {filteredTransactions.length === 0 ? (
            <div className="text-gray-600">No transactions found</div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => {
                const categoryInfo = [
                  ...CATEGORIES.INCOME,
                  ...CATEGORIES.EXPENSE,
                ].find((cat) => cat.id === transaction.category);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-semibold">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()} •{" "}
                        {categoryInfo?.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-semibold ${
                          transaction.amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
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
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
