import React from "react";

const AdminNotifications = ({ notifications = [], onMarkAsRead }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Registration Requests
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Review and approve candidate applications
          </p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          {notifications.length} New
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifications.map((notif, index) => (
          <div
            key={notif._id || index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* Top Section: User Info */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-start gap-4">
                {/* Avatar: First Letter of Name */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                  {notif.userName?.charAt(0) || "U"}
                </div>

                <div className="overflow-hidden">
                  <h3
                    className="font-bold text-gray-900 leading-tight truncate"
                    title={notif.userName}
                  >
                    {notif.userName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <span className="font-mono bg-gray-100 px-1.5 rounded text-xs">
                      {notif.rollNo}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-medium text-gray-400">
                      {notif.branch}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Election Details */}
            <div className="p-5 flex-grow bg-gray-50/50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Contesting For
              </p>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-gray-800 line-clamp-2">
                  {notif.electionName}
                </h4>
                <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  {notif.post}
                </div>
              </div>

              {/* Message Block */}
              {notif.message && notif.message !== "No message left" && (
                <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase">
                    Candidate Message
                  </p>
                  <p className="text-sm text-gray-600 italic line-clamp-3">
                    "{notif.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Section: Actions */}
            <div className="p-4 bg-white border-t border-gray-100 mt-auto">
              <button
                onClick={() => onMarkAsRead(notif._id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approve & Mark Read
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-lg font-medium text-gray-500">All caught up!</p>
          <p className="text-sm">No new registration requests found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
