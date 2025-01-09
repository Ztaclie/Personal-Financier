import { useState, useEffect, useMemo } from "react";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { SummaryCards } from "./components/SummaryCards";
import { TransactionModal } from "./components/TransactionModal";
import { CategorySummary } from "./components/CategorySummary";
import { ViewSelector } from "./components/ViewSelector";
import { TableView } from "./components/views/TableView";
import { SplitView } from "./components/views/SplitView";
import { TimelineView } from "./components/views/TimelineView";
import { CardView } from "./components/views/CardView";
import { CATEGORIES } from "./constants/categories";

function App() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(() => {
    const saved = localStorage.getItem("isAdvancedMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("table");
  const [timeGrouping, setTimeGrouping] = useState("day");

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

  // Save mode preference
  useEffect(() => {
    localStorage.setItem("isAdvancedMode", JSON.stringify(isAdvancedMode));
  }, [isAdvancedMode]);

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

  // Calculate category totals for the CategorySummary
  const categoryTotals = useMemo(() => {
    return filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += Math.abs(transaction.amount);
      return acc;
    }, {});
  }, [filteredTransactions]);

  // Split the handleSubmit into two functions for better UX
  const handleSubmit = (type) => (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    // Ensure amount is positive for income and negative for expense
    const finalAmount =
      type === "income"
        ? Math.abs(parseFloat(amount))
        : -Math.abs(parseFloat(amount));

    const newTransaction = {
      id: Date.now(),
      description,
      amount: finalAmount,
      category:
        isAdvancedMode && category
          ? category
          : type === "income"
          ? "other_income"
          : "other_expense",
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

  const renderTransactionView = () => {
    switch (currentView) {
      case "table":
        return (
          <TableView
            transactions={filteredTransactions}
            isAdvancedMode={isAdvancedMode}
            handleDelete={handleDelete}
          />
        );
      case "split":
        return (
          <SplitView
            transactions={filteredTransactions}
            isAdvancedMode={isAdvancedMode}
            handleDelete={handleDelete}
          />
        );
      case "cards":
        return (
          <CardView
            transactions={filteredTransactions}
            isAdvancedMode={isAdvancedMode}
            handleDelete={handleDelete}
          />
        );
      case "timeline":
        return (
          <>
            <div className="mb-4">
              <select
                value={timeGrouping}
                onChange={(e) => setTimeGrouping(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="day">Group by Day</option>
                <option value="week">Group by Week</option>
                <option value="month">Group by Month</option>
                <option value="year">Group by Year</option>
              </select>
            </div>
            <TimelineView
              transactions={filteredTransactions}
              isAdvancedMode={isAdvancedMode}
              handleDelete={handleDelete}
              groupBy={timeGrouping}
            />
          </>
        );
      case "merged":
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-start p-3 border rounded hover:bg-gray-50"
                >
                  <div>
                    <div className="font-semibold">
                      {transaction.description}
                    </div>
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
        );
      default:
        return (
          <TableView
            transactions={filteredTransactions}
            isAdvancedMode={isAdvancedMode}
            handleDelete={handleDelete}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        isAdvancedMode={isAdvancedMode}
        setIsAdvancedMode={setIsAdvancedMode}
      />

      <main className="container mx-auto p-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        <SummaryCards summary={summary} />

        {/* Add CategorySummary for advanced mode */}
        {isAdvancedMode && (
          <div className="mb-4">
            <CategorySummary categoryTotals={categoryTotals} />
          </div>
        )}

        <ViewSelector currentView={currentView} onViewChange={setCurrentView} />

        {renderTransactionView()}

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isAdvancedMode={isAdvancedMode}
          amount={amount}
          setAmount={setAmount}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          handleSubmit={handleSubmit}
        />

        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            + Add Transaction
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
