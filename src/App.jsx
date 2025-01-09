function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <h1 className="text-white text-2xl font-bold">Finance Tracker</h1>
      </nav>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Balance Summary Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Balance Summary</h2>
            <div className="text-3xl font-bold text-blue-600">$0.00</div>
          </div>

          {/* Add Transaction Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Description"
                className="w-full p-2 border rounded text-gray-700"
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full p-2 border rounded text-gray-700"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Add Transaction
              </button>
            </form>
          </div>

          {/* Transactions List */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="text-gray-600">No transactions yet</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
