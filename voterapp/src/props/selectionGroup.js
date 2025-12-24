// props/SelectionGroup.js
import React, { useState } from "react";

const SelectionGroup = ({
  title,
  data,
  type = "candidate",
  selectedIds = [],
  onToggle,
  onSelectAll,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate stats
  const selectedCount = selectedIds.length;
  const totalCount = data.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div
      className={`border rounded-xl overflow-hidden shadow-sm mb-4 transition-all duration-300 ${
        selectedCount > 0
          ? "border-blue-200 bg-blue-50/10"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* 1. Header Section */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
              selectedCount > 0
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-300"
            }`}
          >
            {selectedCount > 0 && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            )}
          </div>

          <h3
            className={`font-semibold ${
              selectedCount > 0 ? "text-blue-700" : "text-slate-700"
            }`}
          >
            {title}
          </h3>

          {/* Dynamic Counter */}
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
              selectedCount > 0
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }`}
          >
            {selectedCount} / {totalCount} Selected
          </span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>

      {/* 2. Expandable Body */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-100 bg-white">
          {/* Actions Bar */}
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectAll(
                  data.map((d) => d._id),
                  isAllSelected
                );
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              {isAllSelected ? "Deselect All" : "Select All"}
            </button>
          </div>

          {/* Grid of Cards */}
          {data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.map((user) => {
                // Determine data source based on type
                const profile =
                  type === "candidate"
                    ? user.ContestantProfile
                    : user.voterProfile || user.ContestantProfile;
                const name = profile?.name || "Unknown";
                const idLabel = profile?.rollno || "N/A";
                const isSelected = selectedIds.includes(user._id);

                return (
                  <div
                    key={user._id}
                    onClick={() => onToggle(user._id)}
                    className={`relative flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm"
                          : "border-slate-200 hover:border-blue-300 hover:shadow-md bg-white"
                      }`}
                  >
                    {/* Visual Checkmark for selected items */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-blue-600">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    )}

                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                      ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : type === "candidate"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium truncate ${
                          isSelected ? "text-blue-900" : "text-slate-700"
                        }`}
                      >
                        {name}
                      </p>
                      <p
                        className={`text-xs font-mono ${
                          isSelected ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        {idLabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-4">
              No participants found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectionGroup;
