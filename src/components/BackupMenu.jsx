import { useState } from "react";
import PropTypes from "prop-types";
import {
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export function BackupMenu({ transactions, onRestore }) {
  const [isOpen, setIsOpen] = useState(false);

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
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.transactions) {
            onRestore(data.transactions);
          }
        } catch (error) {
          console.error("Error parsing backup file:", error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50"
      >
        <CloudArrowUpIcon className="w-5 h-5" />
        Backup
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
              backupData();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <CloudArrowUpIcon className="w-5 h-5" />
            Backup Data
          </button>

          <button
            onClick={() => {
              restoreData();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
          >
            <CloudArrowDownIcon className="w-5 h-5" />
            Restore Backup
          </button>
        </div>
      )}
    </div>
  );
}

BackupMenu.propTypes = {
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
};
