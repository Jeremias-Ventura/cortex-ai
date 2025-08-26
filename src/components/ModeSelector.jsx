import { useState, useRef, useEffect, memo } from "react";
import { ChevronDown } from "lucide-react";

// Individual dropdown item component
const DropdownItem = memo(({ tab, currentMode, onSelect, onClose }) => {
  const isSelected = tab.value === currentMode;
  
  const handleClick = () => {
    if (tab.available) {
      onSelect(tab.value);
    }
    onClose();
  };

  return (
    <button
      onClick={handleClick}
      disabled={!tab.available}
      className={`w-full flex items-center justify-between px-4 py-2 text-left text-sm transition-colors
        ${isSelected 
          ? 'bg-purple1 text-white' 
          : tab.available
            ? 'hover:bg-zinc-700 text-gray-300 hover:text-white'
            : 'text-gray-500 cursor-not-allowed'
        }`}
    >
      <span>{tab.label}</span>
      {!tab.available && (
        <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded">
          Soon
        </span>
      )}
    </button>
  );
});

DropdownItem.displayName = 'DropdownItem';

const ModeSelector = memo(({ mode, tabs, onModeChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isDropdownOpen]);

  const selectedTab = tabs.find(t => t.value === mode) || tabs[0];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center bg-purple1 px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors group"
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
        aria-label="Select chat mode"
      >
        <span className="text-white text-sm font-medium mr-2">
          {selectedTab.label}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-white transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-40 bg-zinc-800 rounded-lg border border-zinc-600 shadow-xl overflow-hidden z-50"
          role="listbox"
          aria-label="Chat mode options"
        >
          {tabs.map((tab) => (
            <DropdownItem
              key={tab.value}
              tab={tab}
              currentMode={mode}
              onSelect={onModeChange}
              onClose={closeDropdown}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ModeSelector.displayName = 'ModeSelector';

export default ModeSelector;