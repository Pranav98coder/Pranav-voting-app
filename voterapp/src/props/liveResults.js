// props/LiveResult.js
import React, { useEffect, useState } from "react";

const LiveResult = ({ results, electionName, start, end, setShow }) => {
  // 1. Define ALL Hooks first (Rules of Hooks)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Timer Logic
  useEffect(() => {
    // Helper to calculate remaining time
    const calculateTimeLeft = () => {
      const difference = new Date(end) - new Date(); // Time from NOW until END

      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        // Time is up
        timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        setShow("winners");
      }
      return timeLeft;
    };

    // Run immediately
    setTimeLeft(calculateTimeLeft());

    // Set interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup
    return () => clearInterval(timer);
  }, [end]); // Re-run if 'end' date changes

  // 2. NOW we can do the Early Return (Guard Clause)
  if (!results || Object.keys(results).length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 italic bg-white rounded-xl border border-dashed border-slate-200">
        Waiting for results data...
      </div>
    );
  }

  // Helper component for Time Blocks
  const TimeBox = ({ val, label }) => (
    <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-lg p-3 min-w-[70px]">
      <span className="text-2xl font-bold text-slate-800 tabular-nums">
        {val < 10 ? `0${val}` : val}
      </span>
      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* 1. Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-700 font-bold text-sm mb-4 border border-red-100">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          LIVE UPDATES
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          Election Results:{" "}
          <span className="text-blue-700">{electionName}</span>
        </h1>
      </div>

      {/* 2. Styled Countdown Timer */}
      <div className="flex justify-center mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Time Remaining
          </span>
          <div className="flex gap-3">
            <TimeBox val={timeLeft.days} label="Days" />
            <span className="text-2xl font-bold text-slate-300 mt-2">:</span>
            <TimeBox val={timeLeft.hours} label="Hours" />
            <span className="text-2xl font-bold text-slate-300 mt-2">:</span>
            <TimeBox val={timeLeft.minutes} label="Mins" />
            <span className="text-2xl font-bold text-slate-300 mt-2">:</span>
            <TimeBox val={timeLeft.seconds} label="Secs" />
          </div>
        </div>
      </div>

      {/* 3. Results Grid */}
      <div className="space-y-8">
        {Object.entries(results).map(([category, candidates]) => {
          const totalVotes = candidates.reduce(
            (sum, c) => sum + (c.votes || 0),
            0
          );
          const sortedCandidates = [...candidates].sort(
            (a, b) => b.votes - a.votes
          );

          return (
            <section
              key={category}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800 capitalize flex items-center gap-3">
                  <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h2>
                <span className="text-sm font-semibold text-slate-600 bg-white px-3 py-1 rounded border border-slate-200">
                  Total Votes: {totalVotes}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {sortedCandidates.map((candidate, index) => {
                  const percentage =
                    totalVotes > 0
                      ? ((candidate.votes / totalVotes) * 100).toFixed(1)
                      : 0;
                  const isWinner = index === 0 && totalVotes > 0;

                  return (
                    <div
                      key={index}
                      className={`p-5 transition-colors flex flex-col md:flex-row items-center gap-6 ${
                        isWinner ? "bg-blue-50/40" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Rank & Avatar */}
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div
                          className={`w-6 text-center font-bold text-lg ${
                            isWinner ? "text-blue-600" : "text-slate-500"
                          }`}
                        >
                          #{index + 1}
                        </div>
                        <div
                          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border ${
                            isWinner
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-slate-100 text-slate-600 border-slate-300"
                          }`}
                        >
                          {candidate.name
                            ? candidate.name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                        <div className="md:w-56 min-w-0">
                          <h3 className="font-bold text-slate-800 text-lg leading-tight truncate flex items-center gap-2">
                            {candidate.name}
                            {isWinner && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-bold tracking-wide">
                                LEAD
                              </span>
                            )}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 text-xs text-slate-500 font-medium mt-1">
                            <span>{candidate.rollno || "N/A"}</span>
                            <span className="text-slate-300">•</span>
                            <span>{candidate.branch || "N/A"}</span>
                            <span className="text-slate-300">•</span>
                            <span>{candidate.year}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-sm mb-2">
                          <span
                            className={`font-bold ${
                              isWinner ? "text-blue-700" : "text-slate-700"
                            }`}
                          >
                            {percentage}%
                          </span>
                          <span className="font-bold text-slate-900">
                            {candidate.votes} Votes
                          </span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              isWinner ? "bg-blue-600" : "bg-slate-400"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default LiveResult;
