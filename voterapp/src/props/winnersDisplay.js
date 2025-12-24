import React from "react";

const WinnersDisplay = ({ results, electionName }) => {
  if (!results || Object.keys(results).length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        No results available to declare winners yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in duration-500 pb-20">
      {/* 1. Celebratory Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-50 text-amber-700 font-bold text-sm mb-6 border border-amber-200 shadow-sm">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            ></path>
          </svg>
          OFFICIAL RESULTS
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Congratulations to the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            Winners
          </span>
        </h1>
        <p className="text-xl text-slate-500">
          The people have spoken for{" "}
          <span className="font-semibold text-slate-700">{electionName}</span>
        </p>
      </div>

      {/* 2. Winners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {Object.entries(results).map(([category, candidates]) => {
          // Find the winner (Highest votes)
          const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
          const winner = sorted[0];
          const totalVotes = candidates.reduce(
            (sum, c) => sum + (c.votes || 0),
            0
          );
          const percentage =
            totalVotes > 0 ? ((winner.votes / totalVotes) * 100).toFixed(1) : 0;

          // If no votes were cast, handle gracefully
          if (totalVotes === 0) return null;

          return (
            <div
              key={category}
              className="relative flex flex-col items-center bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Decorative Background Pattern */}
              <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-amber-50 to-white"></div>

              {/* Floating Trophy Icon */}
              <div className="absolute top-4 right-4 text-amber-200">
                <svg
                  className="w-12 h-12 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.699-3.181a1 1 0 011.827 1.035l-1.74 3.258 2.153.861A1 1 0 0118 9.947V10a6 6 0 11-12 0v-.053a1 1 0 01.107-.993l2.154-.861-1.74-3.258a1 1 0 011.826-1.035l1.699 3.181L9 4.323V3a1 1 0 011-1zm-5 8.947V10a5 5 0 1010 0v-.053l-5-2-5 2zm5 2.053a1 1 0 011 1v1.5h1a1 1 0 110 2h-4a1 1 0 110-2h1v-1.5a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>

              {/* Avatar Image */}
              <div className="relative mt-12 mb-4">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md ring-4 ring-amber-100">
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 border border-slate-200">
                    {winner.name ? winner.name.charAt(0).toUpperCase() : "?"}
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border-2 border-white">
                  WINNER
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center p-6 w-full">
                <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2">
                  {category.replace(/([A-Z])/g, " $1")}
                </h3>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-1 leading-tight">
                  {winner.name}
                </h2>
                <p className="text-sm text-slate-400 font-medium mb-6">
                  {winner.branch || "N/A"} • {winner.year || "N/A"}
                </p>

                {/* Stats Box */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Votes
                    </p>
                    <p className="text-xl font-bold text-slate-800">
                      {winner.votes}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      Share
                    </p>
                    <p className="text-xl font-bold text-amber-600">
                      {percentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-16 text-slate-400 text-sm">
        Results declared automatically based on vote count.
      </div>
    </div>
  );
};

export default WinnersDisplay;
