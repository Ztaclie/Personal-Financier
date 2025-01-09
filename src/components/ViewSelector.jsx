import PropTypes from "prop-types";

export function ViewSelector({ currentView, onViewChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <select 
        value={currentView} 
        onChange={(e) => onViewChange(e.target.value)}
        className="w-full p-2 border rounded-lg"
      >
        <option value="table">Table View</option>
        <option value="merged">Combined List</option>
        <option value="split">Split Income/Expense</option>
        <option value="cards">Card Grid</option>
        <option value="timeline">Timeline View</option>
      </select>
    </div>
  );
}

ViewSelector.propTypes = {
  currentView: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
}; 