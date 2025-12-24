import React from "react";

const ElectionGridResults = ({ elections, onSelect }) => {
  // Helper for display of date and time
  const formatDisplayDate = (isoDate) => {
    if (!isoDate) return { date: "N/A", time: "--:--" };
    const date = new Date(isoDate);

    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (!elections || elections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-center col-span-full">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            ></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800">
          No Elections Found
        </h3>
        <p className="text-slate-500 max-w-sm mt-1">
          There are no elections available to update right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {elections.map((ename, index) => {
        const start = formatDisplayDate(ename.startTime);
        const end = formatDisplayDate(ename.endTime);

        return (
          <div
            key={index}
            onClick={() => onSelect(ename.name)}
            className="group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
          >
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div>
              {/* Header: Name & Edit Badge */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight pr-2">
                  {ename.name}
                </h3>
              </div>

              {/* Time Duration Box */}
              <div className="bg-slate-50 rounded-lg border border-slate-100 p-3 space-y-2.5">
                {/* Start Row */}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                    Starts
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      {start.date}
                    </span>
                    <span className="text-xs font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {start.time}
                    </span>
                  </div>
                </div>

                {/* Dotted Divider */}
                <div className="border-t border-slate-200 border-dashed w-full"></div>

                {/* End Row */}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
                    Ends
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-slate-700">
                      {end.date}
                    </span>
                    <span className="text-xs font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {end.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Status */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              {ename.started ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold">view live results</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span className="text-xs font-bold">view final results</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ElectionGridResults;
