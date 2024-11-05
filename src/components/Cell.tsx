import React from 'react';

interface CellProps {
  value: number;
  isInitial: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  hasError: boolean;
  onClick: () => void;
  darkMode: boolean;
}

export const Cell: React.FC<CellProps> = ({
  value,
  isInitial,
  isSelected,
  isHighlighted,
  hasError,
  onClick,
  darkMode,
}) => {
  const baseClasses = "w-full h-full flex items-center justify-center text-2xl font-medium transition-all duration-200";
  const colorClasses = isInitial
    ? darkMode ? "text-white" : "text-gray-800"
    : darkMode ? "text-blue-300" : "text-blue-600";
  const bgClasses = isSelected
    ? darkMode ? "bg-blue-900/70" : "bg-blue-100"
    : isHighlighted
    ? darkMode ? "bg-blue-900/40" : "bg-blue-50"
    : darkMode ? "bg-gray-800/70" : "bg-white";
  const errorClasses = hasError ? darkMode ? "text-red-300" : "text-red-500" : "";
  const hoverClasses = !isInitial ? darkMode ? "hover:bg-blue-800/60" : "hover:bg-blue-50" : "";

  return (
    <button
      className={`${baseClasses} ${colorClasses} ${bgClasses} ${errorClasses} ${hoverClasses} backdrop-blur-sm`}
      onClick={onClick}
    >
      {value || ""}
    </button>
  );
};