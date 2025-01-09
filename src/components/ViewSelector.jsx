import PropTypes from "prop-types";
import { TableCellsIcon, ListBulletIcon, ViewColumnsIcon, Square3Stack3DIcon, ClockIcon } from '@heroicons/react/24/outline';

export function ViewSelector({ currentView, onViewChange }) {
  const views = [
    { id: 'table', label: 'Table View', icon: TableCellsIcon },
    { id: 'merged', label: 'Combined List', icon: ListBulletIcon },
    { id: 'split', label: 'Split View', icon: ViewColumnsIcon },
    { id: 'cards', label: 'Card Grid', icon: Square3Stack3DIcon },
    { id: 'timeline', label: 'Timeline', icon: ClockIcon },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex gap-2">
        {views.map(view => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${currentView === view.id 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{view.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

ViewSelector.propTypes = {
  currentView: PropTypes.string.isRequired,
  onViewChange: PropTypes.func.isRequired,
}; 