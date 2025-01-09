import PropTypes from "prop-types";
import { useState } from "react";
import {
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  PrinterIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const ExportMenu = ({ transactions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount"];
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          new Date(t.date).toLocaleDateString(),
          `"${t.description}"`,
          t.category,
          t.amount,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Transaction Report", 14, 22);

    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.autoTable({
      startY: 40,
      head: [["Date", "Description", "Category", "Amount"]],
      body: transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        `$${t.amount.toFixed(2)}`,
      ]),
    });

    doc.save(`transactions_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const shareViaEmail = () => {
    const subject = "Finance Tracker Report";
    const body = "Please find attached the transaction report.";
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50"
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
        Export
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
          <button
            onClick={() => {
              exportToCSV();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Export to CSV
          </button>

          <button
            onClick={() => {
              exportToPDF();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Export to PDF
          </button>

          <button
            onClick={() => {
              shareViaEmail();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <EnvelopeIcon className="w-5 h-5" />
            Share via Email
          </button>

          <button
            onClick={() => {
              printReport();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <PrinterIcon className="w-5 h-5" />
            Print Report
          </button>
        </div>
      )}
    </div>
  );
};

ExportMenu.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
};
