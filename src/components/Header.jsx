import PropTypes from "prop-types";

export function Header({ isAdvancedMode, setIsAdvancedMode }) {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Finance Tracker</h1>
        <button
          onClick={() => setIsAdvancedMode(!isAdvancedMode)}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
        >
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
