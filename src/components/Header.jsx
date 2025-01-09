import PropTypes from "prop-types";
import { CurrencyDollarIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export function Header({ isAdvancedMode, setIsAdvancedMode }) {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 text-white">
          <CurrencyDollarIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Finance Tracker</h1>
        </div>
        <button
          onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 flex items-center gap-2"
        >
          <Cog6ToothIcon className="w-5 h-5" />
          {isAdvancedMode ? "Switch to Basic" : "Switch to Advanced"}
        </button>
      </div>
    </nav>
  );
}

Header.propTypes = {
  isAdvancedMode: PropTypes.bool.isRequired,
  setIsAdvancedMode: PropTypes.func.isRequired,
};
