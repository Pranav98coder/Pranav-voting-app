"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import api from "../../../(utils)/redirect.js";

// Imported Props
import VoterCard from "@/props/voterList";
import CandidateCard from "@/props/candidateList.js";
import SelectionGroup from "@/props/selectionGroup.js";
import ElectionGrid from "@/props/electionGrid.js";
import AdminNotifications from "@/props/adminNotifications.js";

// NEW IMPORTS
import ElectionGridResults from "@/props/electionGridResults";
import LiveResult from "@/props/liveResults";
import WinnersDisplay from "@/props/winnersDisplay";

const Admin = () => {
  // --- UI States ---
  const [isOpen, setIsOpen] = useState(true); // Desktop Sidebar State (Expanded/Collapsed)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Mobile Sidebar State (Hidden/Visible)

  const [activeView, setActiveView] = useState("welcome");

  // --- Data States ---
  const [voterList, setVoterList] = useState([]);
  const [contestantList, setContestantList] = useState([]);

  // Categorized Candidates
  const [presidentList, setPresidentList] = useState([]);
  const [vicePresidentList, setVicePresidentList] = useState([]);
  const [sportsSecretaryList, setSportsSecretaryList] = useState([]);
  const [culturalSecretaryList, setCulturalSecretaryList] = useState([]);

  // --- Selection States ---
  const [selectedPresidents, setSelectedPresidents] = useState([]);
  const [selectedVicePresidents, setSelectedVicePresidents] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedCultural, setSelectedCultural] = useState([]);
  const [selectedVoters, setSelectedVoters] = useState([]);

  // --- Form State ---
  const [electionData, setElectionData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [start, setStart] = useState(true);
  const [eNames, setENames] = useState([]);

  // --- Notification State ---
  const [notifications, setNotifications] = useState([]);

  // --- Results State ---
  const [Results, setResults] = useState("");
  const [showRes, setShowRes] = useState("");
  const [resStart, setResStart] = useState(new Date());
  const [resEnd, setResEnd] = useState(new Date());

  // --- Helpers ---
  const handleViewChange = (view) => {
    setActiveView(activeView === view ? "welcome" : view);
    setMobileSidebarOpen(false); // Close mobile sidebar on selection
  };

  // --- Fetch Results Logic ---
  const fetchResults = async (electionName) => {
    try {
      const response = await api.post("/api/v1/election/live-results", {
        electionName,
      });
      setResults(response.data.results);
      setResStart(response.data.startTime);
      setResEnd(response.data.endTime);
      setShowRes(`${electionName}`);
      setActiveView("liveResultsDisplay");
      setMobileSidebarOpen(false);
    } catch (err) {
      console.error("Error fetching results", err);
      toast.error("Failed to fetch results.");
    }
  };

  const screen = (view) => {
    if (view === "results") setActiveView("liveResultsDisplay");
    else if (view === "winners") setActiveView("winners");
    else setActiveView(view);
  };

  // --- Notifications Logic ---
  const handleNotification = async () => {
    try {
      const res = await api.get("/api/v1/send/recieve");
      setNotifications(res.data.data);
      setActiveView("viewMessage");
      setMobileSidebarOpen(false);
    } catch (error) {
      console.error("Error fetching notifications:", error.response);
      toast.error(
        error.response?.data?.message || "Failed to load notifications."
      );
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      await api.post("/api/v1/send/delete", { id: id });
      toast.success("Message Marked as Read");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error marking as read");
    }
  };

  // --- API Functions (Data Loading) ---
  const contestants = async () => {
    try {
      const res = await api.get("/api/v1/contestants/data");
      const users = res.data.data.contestants || [];
      setPresidentList(users.filter((u) => u.post === "President"));
      setVicePresidentList(users.filter((u) => u.post === "Vice President"));
      setSportsSecretaryList(
        users.filter((u) => u.post === "Sports Secretary")
      );
      setCulturalSecretaryList(
        users.filter((u) => u.post === "Cultural Secretary")
      );
      setContestantList(users);
    } catch (err) {
      toast.error("Failed to load candidates");
    }
  };

  const voterData = async () => {
    try {
      const info = await api.get("/api/v1/voter/data");
      setVoterList(info.data.data.user || []);
    } catch (err) {
      toast.error("Failed to load voters");
    }
  };

  const handleSignOut = async () => {
    try {
      await api.post("/api/v1/users/logout");
      toast.success("Signed out successfully");
      setTimeout(() => (window.location.href = "/"), 1000);
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const electionNames = async () => {
    try {
      const res = await api.get("/api/v1/election/names");
      setENames(res.data.data.electionNames);
    } catch (err) {
      console.error("Error fetching election names:", err);
    }
  };

  const showElection = async (pick) => {
    try {
      const res = await api.post(
        "/api/v1/election/update",
        { electionName: pick },
        { headers: { "Content-Type": "application/json" } }
      );
      const detail = res.data.data.details;
      const voterDetails = res.data.data.voters;
      const candidateDetails = res.data.data.candidates;

      setElectionData({
        name: detail.electionName,
        startDate: formatDateForInput(detail.startTime),
        endDate: formatDateForInput(detail.endTime),
      });

      if (detail.voters) setSelectedVoters(voterDetails.map((v) => v._id));

      if (detail.candidates) {
        const cands = candidateDetails;
        setSelectedPresidents(
          cands
            .filter((u) => u.ContestantProfile?.post === "President")
            .map((u) => u._id)
        );
        setSelectedVicePresidents(
          cands
            .filter((u) => u.ContestantProfile?.post === "Vice President")
            .map((u) => u._id)
        );
        setSelectedSports(
          cands
            .filter((u) => u.ContestantProfile?.post === "Sports Secretary")
            .map((u) => u._id)
        );
        setSelectedCultural(
          cands
            .filter((u) => u.ContestantProfile?.post === "Cultural Secretary")
            .map((u) => u._id)
        );
      }

      handleViewChange("startVoting");
    } catch (err) {
      toast.error("Failed to fetch election details");
    }
  };

  const resetForm = () => {
    setElectionData({ name: "", startDate: "", endDate: "" });
    setSelectedPresidents([]);
    setSelectedVicePresidents([]);
    setSelectedSports([]);
    setSelectedCultural([]);
    setSelectedVoters([]);
  };

  // --- Selection Handlers ---
  const handleToggle = (id, currentList, setFunction) => {
    if (currentList.includes(id)) {
      setFunction(currentList.filter((itemId) => itemId !== id));
    } else {
      setFunction([...currentList, id]);
    }
  };

  const handleSelectAll = (allIds, isAllSelected, setFunction) => {
    setFunction(isAllSelected ? [] : allIds);
  };

  const handleStartElection = async (e) => {
    e.preventDefault();
    const allCandidates = [
      ...selectedPresidents,
      ...selectedVicePresidents,
      ...selectedSports,
      ...selectedCultural,
    ];

    if (
      selectedCultural.length === 0 ||
      selectedSports.length === 0 ||
      selectedVicePresidents.length === 0 ||
      selectedPresidents.length === 0
    ) {
      return toast.error(
        "Please select at least one candidate for each position."
      );
    }
    if (
      !electionData.name ||
      !electionData.startDate ||
      !electionData.endDate
    ) {
      return toast.error("Please fill in all election details.");
    }
    if (allCandidates.length < 4) {
      return toast.error(
        "Please select at least 4 candidates to start an election."
      );
    }
    if (selectedVoters.length === 0) {
      toast.warning("Warning: No voters selected.");
    }

    const payload = {
      ...electionData,
      candidates: allCandidates,
      voters: selectedVoters,
      start: start,
    };

    try {
      await api.post("/api/v1/election/details", payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(
        `Election "${electionData.name}" started and is ${
          start ? "Active" : "Inactive"
        }!`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start election");
    }
  };

  // --- Helper Component for Read-Only Candidate Views ---
  const ReadOnlyCandidateSection = ({ title, list, colorClass }) => (
    <div className="mb-12">
      <h2
        className={`text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 border-b pb-2 ${colorClass}`}
      >
        {title}
        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {list.length}
        </span>
      </h2>
      {list.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((user) => (
            <CandidateCard key={user._id} user={user.ContestantProfile} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
          No candidates registered for {title}.
        </div>
      )}
    </div>
  );

  useEffect(() => {
    voterData();
    contestants();
    electionNames();
  }, []);

  return (
    <div className="flex min-h-screen font-sans text-slate-800 bg-slate-50 relative">
      <Toaster position="top-right" richColors />

      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 h-16 shadow-sm">
        <h2 className="text-lg font-bold text-blue-600 tracking-tight">
          Admin Panel
        </h2>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-600 focus:outline-none"
        >
          {mobileSidebarOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden glass-blur"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 flex flex-col shadow-sm transition-all duration-300 ease-in-out z-50 
        ${isOpen ? "md:w-64" : "md:w-20"} 
        ${
          mobileSidebarOpen
            ? "translate-x-0 w-64"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 hidden md:flex">
          <h2
            className={`font-bold text-blue-600 tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            VoterApp
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 md:hidden">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          <p
            className={`px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 md:hidden"
            }`}
          >
            Manage Data
          </p>

          <button
            onClick={() => {
              handleViewChange("voters");
              voterData();
            }}
            className={`w-full flex items-center gap-4 px-3 py-3 text-left rounded-lg transition-colors group ${
              activeView === "voters"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <svg
              className="min-w-[20px] w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            <span
              className={`whitespace-nowrap transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 md:hidden"
              }`}
            >
              Show all voters
            </span>
          </button>

          <button
            onClick={() => {
              handleViewChange("candidates");
              contestants();
            }}
            className={`w-full flex items-center gap-4 px-3 py-3 text-left rounded-lg transition-colors group ${
              activeView === "candidates"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <svg
              className="min-w-[20px] w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            <span
              className={`whitespace-nowrap transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 md:hidden"
              }`}
            >
              Show all candidates
            </span>
          </button>

          <button
            onClick={() => {
              handleNotification();
              handleViewChange("viewMessage");
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
              activeView === "viewMessage"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <svg
              className="w-5 h-5 min-w-[20px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            <span
              className={`whitespace-nowrap transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 md:hidden"
              }`}
            >
              See Notifications
            </span>
          </button>

          <button
            onClick={() => {
              handleViewChange("pickElection");
              electionNames();
            }}
            className={`w-full flex items-center gap-4 px-3 py-3 text-left rounded-lg transition-colors group ${
              activeView === "pickElection"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <svg
              className="min-w-[20px] w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            <span
              className={`whitespace-nowrap transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 md:hidden"
              }`}
            >
              Update Election
            </span>
          </button>

          <button
            onClick={() => {
              handleViewChange("resultSelection");
              electionNames();
            }}
            className={`w-full flex items-center gap-4 px-3 py-3 text-left rounded-lg transition-colors group ${
              activeView === "resultSelection" ||
              activeView === "liveResultsDisplay"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <svg
              className="min-w-[20px] w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            <span
              className={`whitespace-nowrap transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 md:hidden"
              }`}
            >
              View Results
            </span>
          </button>
        </nav>

        {/* Start Election Link */}
        <div className="p-4 border-t border-slate-100 overflow-hidden">
          <button
            onClick={() => {
              handleViewChange("startVoting");
              contestants();
              voterData();
              resetForm();
            }}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg shadow-md transition-all ${
              isOpen ? "px-4" : "px-0"
            }`}
          >
            <svg
              className="w-5 h-5 min-w-[20px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span
              className={`whitespace-nowrap ${
                isOpen ? "block" : "hidden md:hidden"
              }`}
            >
              Start Election
            </span>
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-3 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium group"
          >
            <svg
              className="min-w-[20px] w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            <span
              className={`whitespace-nowrap transition-opacity duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 md:hidden"
              }`}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main
        className={`flex-1 transition-all duration-300 
        ${isOpen ? "md:ml-64" : "md:ml-20"} 
        p-4 pt-20 md:p-8 md:pt-8 min-h-screen bg-slate-50`}
      >
        {/* VIEW 1: WELCOME */}
        {activeView === "welcome" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] md:h-[80vh] text-center space-y-4 animate-in fade-in duration-500">
            <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              Welcome, Admin
            </h1>
            <p className="text-slate-500 text-base md:text-lg max-w-md mx-auto">
              Select an option from the sidebar to manage the election.
            </p>
          </div>
        )}

        {/* VIEW 2: VOTERS LIST */}
        {activeView === "voters" && (
          <div className="max-w-7xl mx-auto animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h1 className="text-2xl font-bold text-slate-800">
                Registered Voters
              </h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full w-fit">
                Total: {voterList.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {voterList.length > 0 ? (
                voterList.map((user) => (
                  <VoterCard
                    key={user._id}
                    user={user.voterProfile || user.ContestantProfile}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                  No voters found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: CANDIDATES LIST */}
        {activeView === "candidates" && (
          <div className="max-w-7xl mx-auto animate-in slide-in-from-right-4 duration-300 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h1 className="text-3xl font-bold text-slate-800">
                Election Candidates
              </h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full w-fit">
                Total: {contestantList.length}
              </span>
            </div>
            <ReadOnlyCandidateSection
              title="President"
              list={presidentList}
              colorClass="border-blue-500"
            />
            <ReadOnlyCandidateSection
              title="Vice President"
              list={vicePresidentList}
              colorClass="border-purple-500"
            />
            <ReadOnlyCandidateSection
              title="Sports Secretary"
              list={sportsSecretaryList}
              colorClass="border-green-500"
            />
            <ReadOnlyCandidateSection
              title="Cultural Secretary"
              list={culturalSecretaryList}
              colorClass="border-pink-500"
            />
          </div>
        )}

        {/* VIEW 4: PICK ELECTION TO UPDATE */}
        {activeView === "pickElection" && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-slate-800">
                Update Election
              </h1>
              <p className="text-slate-500 mt-2">
                Select an active or upcoming election below to modify its
                details.
              </p>
            </div>
            <ElectionGrid elections={eNames} onSelect={showElection} />
          </div>
        )}

        {/* VIEW 5: NOTIFICATIONS */}
        {activeView === "viewMessage" && (
          <AdminNotifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
          />
        )}

        {/* VIEW 6: PICK ELECTION TO VIEW RESULTS */}
        {activeView === "resultSelection" && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-slate-800">
                Election Results
              </h1>
              <p className="text-slate-500 mt-2">
                Select an election to view live results or winners.
              </p>
            </div>
            <ElectionGridResults elections={eNames} onSelect={fetchResults} />
          </div>
        )}

        {/* VIEW 7: LIVE RESULT DISPLAY */}
        {activeView === "liveResultsDisplay" && (
          <div className="results-container animate-in zoom-in duration-300">
            <div className="mb-4">
              <button
                onClick={() => setActiveView("resultSelection")}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                ← Back to Election List
              </button>
            </div>
            <LiveResult
              results={Results}
              electionName={showRes}
              start={resStart}
              end={resEnd}
              setShow={screen}
            />
          </div>
        )}

        {/* VIEW 8: WINNERS DISPLAY */}
        {activeView === "winners" && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-4">
              <button
                onClick={() => setActiveView("liveResultsDisplay")}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                ← Back to Results
              </button>
            </div>
            <WinnersDisplay results={Results} electionName={showRes} />
          </div>
        )}

        {/* VIEW 9: START ELECTION FORM */}
        {activeView === "startVoting" && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-slate-800">
                Launch Election
              </h1>
              <p className="text-slate-500 mt-2">
                Configure details and confirm participant lists.
              </p>
            </div>
            <form onSubmit={handleStartElection} className="space-y-8">
              {/* Election Meta Data */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Election Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder={
                        electionData.name || "ex: Student Council 2026"
                      }
                      value={electionData.name}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                      onChange={(e) =>
                        setElectionData({
                          ...electionData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={electionData.startDate}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-slate-600 font-sans"
                      onChange={(e) =>
                        setElectionData({
                          ...electionData,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={electionData.endDate}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all text-slate-600 font-sans"
                      onChange={(e) =>
                        setElectionData({
                          ...electionData,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Selection Groups */}
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Select Candidates
                </h2>
                <SelectionGroup
                  title="President"
                  data={presidentList}
                  selectedIds={selectedPresidents}
                  onToggle={(id) =>
                    handleToggle(id, selectedPresidents, setSelectedPresidents)
                  }
                  onSelectAll={(ids, isAll) =>
                    handleSelectAll(ids, isAll, setSelectedPresidents)
                  }
                />
                <SelectionGroup
                  title="Vice President"
                  data={vicePresidentList}
                  selectedIds={selectedVicePresidents}
                  onToggle={(id) =>
                    handleToggle(
                      id,
                      selectedVicePresidents,
                      setSelectedVicePresidents
                    )
                  }
                  onSelectAll={(ids, isAll) =>
                    handleSelectAll(ids, isAll, setSelectedVicePresidents)
                  }
                />
                <SelectionGroup
                  title="Sports Secretary"
                  data={sportsSecretaryList}
                  selectedIds={selectedSports}
                  onToggle={(id) =>
                    handleToggle(id, selectedSports, setSelectedSports)
                  }
                  onSelectAll={(ids, isAll) =>
                    handleSelectAll(ids, isAll, setSelectedSports)
                  }
                />
                <SelectionGroup
                  title="Cultural Secretary"
                  data={culturalSecretaryList}
                  selectedIds={selectedCultural}
                  onToggle={(id) =>
                    handleToggle(id, selectedCultural, setSelectedCultural)
                  }
                  onSelectAll={(ids, isAll) =>
                    handleSelectAll(ids, isAll, setSelectedCultural)
                  }
                />

                <div className="my-8 border-t border-slate-200"></div>

                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Select Voters
                </h2>
                <SelectionGroup
                  title="Eligible Voters"
                  data={voterList}
                  type="voter"
                  selectedIds={selectedVoters}
                  onToggle={(id) =>
                    handleToggle(id, selectedVoters, setSelectedVoters)
                  }
                  onSelectAll={(ids, isAll) =>
                    handleSelectAll(ids, isAll, setSelectedVoters)
                  }
                />
              </div>

              <div>
                <label className="text-lg font-bold text-slate-800 mb-4">
                  State of Election
                </label>
                <div className="relative">
                  <select
                    value={start.toString()}
                    onChange={(e) => setStart(e.target.value === "true")}
                    className="w-full px-4 py-2 appearance-none bg-white rounded-lg border border-slate-300 text-slate-700 font-medium focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="true">Active (Live)</option>
                    <option value="false">Inactive (Pending/Closed)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
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
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  {start ? (
                    <span className="flex items-center gap-1.5 text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Election is live.
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Election is currently paused or closed.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                  Launch Election
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
