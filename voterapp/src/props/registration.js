import React, { useState, useEffect } from "react";

const RegistrationModal = ({
  isOpen,
  eNames,
  post,

  onClose,
  onSubmit,
}) => {
  // State for form inputs
  const [selectedElection, setSelectedElection] = useState("");
  const [role, setRole] = useState(post || "President");
  const [message, setMessage] = useState("");
  const elections = eNames.filter((e) => {
    return e.names;
  });

  // Automatically select the first election in the list when the modal opens
  useEffect(() => {
    if (eNames && eNames.length > 0) {
      setSelectedElection(eNames[0].name); // Assuming elections have an 'id'
    }
  }, [eNames]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass all three data points back to the parent
    onSubmit({
      name: selectedElection,
      role,
      message,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-blue-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Registration</h2>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white font-bold text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <hr className="border-gray-100" />
          {/* 2. Existing: Registered Members List */}
          {/* <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase">
              Current Elections
            </h3>
            <div className="max-h-24 overflow-y-auto space-y-1">
              {eNames.map((ename, index) => (
                <div
                  key={index}
                  className="flex items-center text-gray-600 text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                  <p>{ename.name}</p>
                </div>
              ))}
            </div>
          </div> */}
          {/* 1. NEW: Election Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Select Election
            </label>
            <select
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              className="block w-full px-3 py-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium"
            >
              {eNames.map((election, id) => (
                <option key={id} value={election.name}>
                  {election.name}
                </option>
              ))}
            </select>
          </div>
          {/* 3. Existing: Role Selection */}
          {post && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-4 animate-fade-in">
              {/* Icon Badge */}
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Text Details */}
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                  Current Nomination
                </p>
                <p className="text-lg font-bold text-gray-800 leading-none">
                  {post}
                </p>
              </div>
            </div>
          )}
          {!post && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
              >
                <option value="President">President</option>
                <option value="Vice President">Vice President</option>
                <option value="Sports Secretary">Sports Secretary</option>
                <option value="Cultural Secretary">Cultural Secretary</option>
              </select>
            </div>
          )}

          {/* 4. Existing: Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message to Admin
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full px-3 py-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
              rows="2"
              placeholder="Optional message..."
            />
          </div>
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
