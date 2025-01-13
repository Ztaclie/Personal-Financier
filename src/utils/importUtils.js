export const importFromCSV = async (file) => {
  try {
    const text = await file.text();
    const rows = text.split("\n");
    const headers = rows[0].split(",");

    // Validate CSV structure
    const requiredHeaders = ["Date", "Description", "Amount"];
    const hasRequiredHeaders = requiredHeaders.every((header) =>
      headers.includes(header)
    );

    if (!hasRequiredHeaders) {
      throw new Error(
        "Invalid CSV format. Required headers: Date, Description, Amount"
      );
    }

    const transactions = rows
      .slice(1)
      .filter((row) => row.trim()) // Skip empty rows
      .map((row) => {
        const values = row.split(",");
        return {
          id: crypto.randomUUID(),
          date: new Date(values[headers.indexOf("Date")]).toISOString(),
          description: values[headers.indexOf("Description")].replace(
            /^"|"$/g,
            ""
          ),
          amount: parseFloat(values[headers.indexOf("Amount")]),
          category: headers.includes("Category")
            ? values[headers.indexOf("Category")]
            : "",
        };
      });

    return transactions;
  } catch (error) {
    throw new Error(`Failed to import CSV: ${error.message}`);
  }
};

export const importFromJSON = async (file) => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Handle both backup format and direct transaction array
    const transactions = data.transactions || data;

    if (!Array.isArray(transactions)) {
      throw new Error("Invalid JSON format. Expected array of transactions");
    }

    // Validate transaction structure
    transactions.forEach((transaction) => {
      if (!transaction.description || typeof transaction.amount !== "number") {
        throw new Error("Invalid transaction format");
      }
    });

    // Ensure each transaction has an ID
    return transactions.map((t) => ({
      ...t,
      id: t.id || crypto.randomUUID(),
    }));
  } catch (error) {
    throw new Error(`Failed to import JSON: ${error.message}`);
  }
};
