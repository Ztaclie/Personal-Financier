import PropTypes from "prop-types";
import { useState } from "react";
import {
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  PrinterIcon,
  Squares2X2Icon,
  TableCellsIcon,
  ClockIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export const Sidebar = ({
  currentView,
  onViewChange,
  transactions,
  onRestore,
  timeGrouping,
  setTimeGrouping,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showBackupOptions, setShowBackupOptions] = useState(false);

  const views = [
    { id: "table", label: "Table View", icon: TableCellsIcon },
    { id: "merged", label: "List View", icon: ListBulletIcon },
    { id: "split", label: "Split View", icon: ViewColumnsIcon },
    { id: "cards", label: "Card View", icon: Squares2X2Icon },
    { id: "timeline", label: "Timeline", icon: ClockIcon },
  ];

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

  const exportToJSON = () => {
    const data = {
      transactions,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  };

  const backupData = () => {
    const data = {
      transactions,
      backupDate: new Date().toISOString(),
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `finance_backup_${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  };

  const restoreData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.transactions && Array.isArray(data.transactions)) {
          onRestore(data.transactions);
        }
      } catch (error) {
        console.error("Error restoring backup:", error);
        alert("Invalid backup file");
      }
    };
    input.click();
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
    <div
      className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 flex flex-col
        ${isHovered ? "w-48" : "w-16"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowExportOptions(false);
        setShowBackupOptions(false);
      }}
    >
      <div className="flex-1 py-8">
        {/* View Options */}
        <div className="space-y-2">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={`w-full flex items-center px-4 py-3 transition-colors
                ${
                  currentView === view.id
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <view.icon className="w-6 h-6 shrink-0" />
              {isHovered && <span className="ml-3 truncate">{view.label}</span>}
            </button>
          ))}

          {/* Timeline Grouping (only show when timeline view is active) */}
          {currentView === "timeline" && isHovered && (
            <select
              value={timeGrouping}
              onChange={(e) => setTimeGrouping(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-sm border rounded"
            >
              <option value="day">Group by Day</option>
              <option value="week">Group by Week</option>
              <option value="month">Group by Month</option>
              <option value="year">Group by Year</option>
            </select>
          )}
        </div>
      </div>

      {/* Export & Backup Options */}
      <div className="border-t space-y-2">
        {/* Export Options */}
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 shrink-0 flex items-center justify-center">
              <ArrowDownTrayIcon className="w-6 h-6" />
            </div>
            {isHovered && (
              <>
                <span className="ml-3 flex-1">Export</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
                    showExportOptions ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {isHovered && showExportOptions && (
            <div className="absolute bottom-full left-0 w-full bg-white shadow-lg rounded-lg py-2 mb-1">
              <button
                onClick={exportToCSV}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                CSV
              </button>
              <button
                onClick={exportToJSON}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                JSON
              </button>
              <button
                onClick={shareViaEmail}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Email
              </button>
              <button
                onClick={printReport}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <PrinterIcon className="w-5 h-5 mr-2" />
                Print
              </button>
            </div>
          )}
        </div>

        {/* Backup Options */}
        <div className="relative">
          <button
            onClick={() => setShowBackupOptions(!showBackupOptions)}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <div className="w-6 h-6 shrink-0 flex items-center justify-center">
              <CloudArrowUpIcon className="w-6 h-6" />
            </div>
            {isHovered && (
              <>
                <span className="ml-3 flex-1">Backup</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform ${
                    showBackupOptions ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {isHovered && showBackupOptions && (
            <div className="absolute bottom-full left-0 w-full bg-white shadow-lg rounded-lg py-2 mb-1">
              <button
                onClick={backupData}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                Backup
              </button>
              <button
                onClick={restoreData}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
              >
                <CloudArrowDownIcon className="w-5 h-5 mr-2" />
                Restore
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  currentView: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  onRestore: PropTypes.func.isRequired,
  timeGrouping: PropTypes.string.isRequired,
  setTimeGrouping: PropTypes.func.isRequired,
};
