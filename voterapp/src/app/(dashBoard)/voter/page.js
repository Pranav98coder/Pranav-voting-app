"use client";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import api from "../../../(utils)/redirect";
import VotingSection from "@/props/voteSection";
import ElectionGridUser from "@/props/electionGridUser";
import LiveResult from "@/props/liveResults";
import { useRouter } from "next/navigation";

const Voter = () => {
  const [disp, setDisp] = useState("empty");

  // Profile State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("Btech 1st year");
  const [branch, setBranch] = useState("Computer Science Engineering");
  const [section, setSection] = useState("");
  const [rollno, setRollno] = useState("");

  // Candidate Data State
  const [contestantList, setContestantList] = useState([]);
  const [presidentList, setPresidentList] = useState([]);
  const [vicePresidentList, setVicePresidentList] = useState([]);
  const [sportsSecretaryList, setSportsSecretaryList] = useState([]);
  const [culturalSecretaryList, setCulturalSecretaryList] = useState([]);

  // Votes State
  const [votes, setVotes] = useState({});

  const [eNames, setENames] = useState([]);
  const [vNames, setVNames] = useState([]);
  const [ballot, setBallot] = useState("");

  // NEW: Sidebar State for Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggle = (view) => {
    if (disp === view) {
      setDisp("empty");
    } else {
      setDisp(view);
    }
    // Close sidebar on mobile selection
    setIsSidebarOpen(false);
  };

  const router = useRouter();
  const roleChange = (role) => {
    router.push("/" + role);
  };

  const initProfile = async () => {
    try {
      const res = await api.get("/api/v1/voter/profile");
      console.log("Voter profile data:", res.data);
      const profile = res.data.data.voterProfile;
      if (profile) {
        setName(profile.name || "");
        setAge(profile.age || "");
        setYear(profile.year || "Btech 1st year");
        setBranch(profile.branch || "Computer Science Engineering");
        setSection(profile.section || "");
        setRollno(profile.rollno || "");
      }
      toast.success(`${res.data.message}`);
    } catch (err) {
      console.log("Error fetching voter profile:", err.response);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const data = { name, age, year, branch, section, rollno };
      const rec = await api.post("/api/v1/voter/register", data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Profile updated successfully:", rec.data);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.log("Error updating profile:", err.response);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await api.post("/api/v1/users/logout");
      toast.success("Signed out successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const contestants = async () => {
    try {
      const res = await api.get("/api/v1/contestants/data");
      const users = res.data.data.contestants || []; // Safety check

      setPresidentList(
        users.filter((u) => u.ContestantProfile?.post === "President")
      );
      setVicePresidentList(
        users.filter((u) => u.ContestantProfile?.post === "Vice President")
      );
      setSportsSecretaryList(
        users.filter((u) => u.ContestantProfile?.post === "Sports Secretary")
      );
      setCulturalSecretaryList(
        users.filter((u) => u.ContestantProfile?.post === "Cultural Secretary")
      );
      setContestantList(users);
    } catch (err) {
      console.log("Error fetching contestants data:", err.response);
      toast.error("Failed to load candidates");
    }
  };

  const electionNames = async () => {
    try {
      const res = await api.get("/api/v1/election/active-names");
      console.log("Election names fetched:", res.data);
      setENames(res.data.data.electionNames);
      console.log("Election Names:", res.data.data.electionNames);
    } catch (err) {
      console.error("Error fetching election names:", err);
    }
  };

  const voteNames = async () => {
    try {
      const res = await api.get("/api/v1/election/vote-names");
      console.log("Election names fetched:", res.data);
      setVNames(res.data.data.electionNames);
      console.log("Election Names:", res.data.data.electionNames);
    } catch (err) {
      console.error("Error fetching election names:", err);
    }
  };

  //election candidates retrieval
  const electionCand = async (electionName) => {
    try {
      const res = await api.post("/api/v1/election/vote", { electionName });
      const serverResponse = res.data;

      if (serverResponse.statusCode === 203) {
        toast.error(serverResponse.message || "Not authorized by admin");
        setDisp("empty");
        return;
      }

      if (serverResponse.statusCode === 205) {
        toast.info(serverResponse.message || "You have already voted");
        setDisp("empty");
        return;
      }

      if (serverResponse.statusCode === 208) {
        toast.warning(serverResponse.message || "Election has not started yet");
        setDisp("empty");
        return;
      }

      if (serverResponse.statusCode === 209) {
        toast.error(
          serverResponse.message || "This election has already ended"
        );
        setDisp("empty");
        return;
      }

      const candidateData = serverResponse.data?.candidates || [];

      setPresidentList(
        candidateData.filter((c) => c.ContestantProfile?.post === "President")
      );
      setVicePresidentList(
        candidateData.filter(
          (c) => c.ContestantProfile?.post === "Vice President"
        )
      );
      setSportsSecretaryList(
        candidateData.filter(
          (c) => c.ContestantProfile?.post === "Sports Secretary"
        )
      );
      setCulturalSecretaryList(
        candidateData.filter(
          (c) => c.ContestantProfile?.post === "Cultural Secretary"
        )
      );

      setBallot(`${electionName}`);
      setDisp("vote");
    } catch (err) {
      console.error("Error loading candidates:", err);
      toast.error(err.response?.data?.message || "Error loading candidates");
      setDisp("empty");
    }
  };

  useEffect(() => {
    contestants();
    electionNames();
    voteNames();
  }, []);

  const handleVoteSelect = (category, candidateId) => {
    setVotes((prev) => ({ ...prev, [category]: candidateId }));
  };

  const handleSubmitVotes = async () => {
    const totalCategories = 4;
    const selectedCount = Object.keys(votes).length;

    if (selectedCount < totalCategories) {
      toast.warning(
        `You have selected candidates for ${selectedCount} out of ${totalCategories} categories.`
      );
      return;
    }

    try {
      console.log("with names", votes);

      const submitVotes = await api.post(
        "/api/v1/election/ballot",
        { votes: votes, electionName: ballot },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Final Votes:", submitVotes.data);
      toast.success("Votes recorded successfully!");
      setDisp("empty");
    } catch (err) {
      console.log("Error submitting votes:", err.response);
      console.log("Request data:", err.request);
      toast.error(err.response?.data?.message || "Failed to submit votes");
    }
  };

  const electionCategories = [
    { title: "President", list: presidentList },
    { title: "Vice President", list: vicePresidentList },
    { title: "Sports Secretary", list: sportsSecretaryList },
    { title: "Cultural Secretary", list: culturalSecretaryList },
  ];

  return (
    <div className="flex min-h-screen font-sans text-slate-800 bg-slate-50 relative">
      <Toaster position="top-right" richColors />

      {/* --- MOBILE HEADER (Visible only on small screens) --- */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 h-16 shadow-sm">
        <h2 className="text-lg font-bold text-blue-600 tracking-tight">
          Voter Panel
        </h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-600 focus:outline-none"
        >
          {isSidebarOpen ? (
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

      {/* --- OVERLAY (For Mobile) --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden glass-blur"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- LEFT SIDEBAR --- */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col shadow-lg z-50 transform transition-transform duration-300 ease-in-out 
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100 hidden md:flex">
          <h2 className="text-xl font-bold text-blue-600 tracking-tight">
            Voter Dashboard
          </h2>
        </div>

        {/* Mobile Header in Sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 md:hidden">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => {
              handleToggle("update");
              initProfile();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
              disp === "update"
                ? "bg-blue-50 text-blue-600 font-semibold shadow-inner"
                : "text-slate-600 hover:bg-slate-50"
            }`}
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Update Profile
          </button>

          <button
            onClick={() => handleToggle("upcoming")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
              disp === "upcoming"
                ? "bg-blue-50 text-blue-600 font-semibold shadow-inner"
                : "text-slate-600 hover:bg-slate-50"
            }`}
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Upcoming Elections
          </button>

          <button
            onClick={() => handleToggle("canVote")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
              disp === "vote"
                ? "bg-blue-50 text-blue-600 font-semibold shadow-inner"
                : "text-slate-600 hover:bg-slate-50"
            }`}
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            Cast Vote
          </button>

          <button
            onClick={() => {
              roleChange("contestant");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-slate-600 hover:bg-slate-50"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            Register for Election
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 w-full md:ml-64 p-4 pt-20 md:p-10 md:pt-10 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {/* WELCOME */}
          {disp === "empty" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] md:h-[80vh] text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="p-6 bg-white rounded-full shadow-md">
                <svg
                  className="w-16 h-16 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
                  Welcome Voter!
                </h1>
                <p className="text-lg md:text-xl text-slate-500">
                  Please select an option from the sidebar to get started.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-3 rounded-lg flex items-center gap-3 text-sm md:text-base">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <b>Note: Please try to be an attentive voter.</b>
              </div>
            </div>
          )}

          {/* UPDATE PROFILE */}
          {disp === "update" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-in slide-in-from-left-4 duration-300">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Update Profile
              </h2>

              <form
                onSubmit={handleUpdateProfile}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Age
                  </label>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option>Btech 1st year</option>
                    <option>Btech 2nd year</option>
                    <option>Btech 3rd year</option>
                    <option>Btech 4th year</option>
                    <option>Mtech 1st year</option>
                    <option>Mtech 2nd year</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option>Computer Science Engineering</option>
                    <option>Electronics and Communication Engineering</option>
                    <option>Electrical Engineering</option>
                    <option>Mechanical Engineering</option>
                    <option>Chemical Engineering</option>
                    <option>Civil Engineering</option>
                    <option>Biotechnology Engineering</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Section
                  </label>
                  <input
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Roll Number
                  </label>
                  <input
                    value={rollno}
                    onChange={(e) => setRollno(e.target.value)}
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2 pt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
                    Submit Updates
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* canVote */}
          {disp == "canVote" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Cast Your Vote:
              </h2>
              <p className="text-lg font-medium text-slate-500 mb-6">
                These are the elections you are eligible to vote in:
              </p>
              <ElectionGridUser elections={vNames} onSelect={electionCand} />
            </div>
          )}

          {/* VOTING SECTION */}
          {disp === "vote" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                {ballot}
              </h2>
              <VotingSection
                categories={electionCategories}
                votes={votes}
                onVote={handleVoteSelect}
                onSubmit={handleSubmitVotes}
              />
            </div>
          )}

          {disp == "upcoming" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Currently ongoing elections are:
              </h2>
              <ElectionGridUser elections={eNames} />
            </div>
          )}

          {/* PLACEHOLDER FOR UPCOMING */}
          {disp === "upco" && (
            <div className="text-center py-20 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-slate-400">
                Section Under Construction
              </h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Voter;
