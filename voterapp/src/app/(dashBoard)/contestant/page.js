"use client";
import { toast, Toaster } from "sonner";
import { useState, useEffect } from "react";
import api from "../../../(utils)/redirect";
import ElectionGridUser from "@/props/electionGridUser";
import LiveResult from "@/props/liveResults";
import WinnersDisplay from "@/props/winnersDisplay";
import RegistrationModal from "@/props/registration";
import { useRouter } from "next/navigation";
import ElectionGridResults from "@/props/electionGridResults";

const Contestant = () => {
  const [show, setShow] = useState("empty");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [post, setPost] = useState("NULL");
  const [year, setYear] = useState("Btech 1st year");
  const [branch, setBranch] = useState("Computer Science Engineering");
  const [section, setSection] = useState("");
  const [rollno, setRollno] = useState("");

  const [eNames, setENames] = useState([]);
  const [eCNames, setECNames] = useState([]);
  const [Results, setResults] = useState("");

  const [showRes, setShowRes] = useState("");
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [ePost, setEPost] = useState("");

  // Mobile Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //upcoming elections
  const updatePost = async (selectedRole) => {
    try {
      console.log("Updating post to:", selectedRole);
      const payload = { post: selectedRole };
      const res = await api.post("/api/v1/contestants/updPost", payload);
      console.log("Update Success:", res.data);
      setEPost(selectedRole);
      toast.success("Successfully nominated for " + selectedRole);
    } catch (err) {
      console.error(
        "Failed to update post:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Could not update post");
    }
  };

  const electionNames = async () => {
    try {
      const res = await api.get("/api/v1/election/active-names");
      setENames(res.data.data.electionNames);
      setEPost(res.data.data.post);
      if (ePost) {
        updatePost(ePost);
      }
    } catch (err) {
      console.error("Error fetching election names:", err);
    }
  };

  //eligible elections
  const eligibleNames = async () => {
    try {
      const res = await api.get("/api/v1/election/candidate-names");
      setECNames(res.data.data.electionNames);
    } catch (err) {
      console.error("Error fetching election names:", err);
    }
  };

  //show live results
  const fetchResults = async (electionName) => {
    try {
      const response = await api.post("/api/v1/election/live-results", {
        electionName,
      });
      setResults(response.data.results);
      setStart(response.data.startTime);
      setEnd(response.data.endTime);
      setLoading(false);
      setShowRes(`${electionName}`);
      setShow("results");
    } catch (err) {
      console.error("Error fetching results", err);
      setLoading(false);
    }
  };

  const router = useRouter();
  const roleChange = (role) => {
    router.push("/" + role);
  };

  const screen = (view) => {
    handleToggle(view);
  };

  // Toggle Logic
  const handleToggle = (view) => {
    if (show === view) {
      setShow("empty");
    } else {
      setShow(view);
    }
    // Close sidebar on mobile when a link is clicked
    setIsSidebarOpen(false);
  };

  const filledProfile = async () => {
    try {
      const res = await api.get("/api/v1/contestants/profile");
      const profile = res.data.data.profile;
      setName(profile.name);
      setAge(profile.age);
      setPost(profile.post);
      setYear(profile.year);
      setBranch(profile.branch);
      setSection(profile.section);
      setRollno(profile.rollno);
      toast.success(`${res.data.message}`);
    } catch (err) {
      console.log("Error fetching contestant profile:", err.response);
    }
  };

  const profile = async (e) => {
    e.preventDefault();
    try {
      const dat = {
        name: name,
        age: age,
        post: post,
        year: year,
        branch: branch,
        section: section,
        rollno: rollno,
      };
      const res = await api.post("/api/v1/contestants/update-profile", dat, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(res.data);
      toast.success("Profile Updated Successfully");
    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    electionNames();
    eligibleNames();
    fetchResults();
  }, []);

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

  const handleRegistrationSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        role: data.role,
        message: data.message,
      };
      const go = await api.post("/api/v1/send/register", payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Succesfully,sent registration request!");
      updatePost(data.role);
      setShow("empty");
    } catch (err) {
      console.log("Error registering:", err.response);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen font-sans text-slate-800 bg-slate-50 relative">
      <Toaster position="top-right" richColors />

      {/* --- MOBILE HEADER (Visible only on small screens) --- */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4 h-16 shadow-sm">
        <h2 className="text-lg font-bold text-blue-600 tracking-tight">
          Contestant Panel
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

      {/* --- SIDEBAR --- */}
      {/* Changed: Removed md:static so it stays 'fixed' on desktop. Added md:translate-x-0 to ensure visibility. */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col shadow-lg z-50 transform transition-transform duration-300 ease-in-out 
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header (Desktop only padding) */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 hidden md:flex">
          <h2 className="text-xl font-bold text-blue-600 tracking-tight">
            Contestant Panel
          </h2>
        </div>

        {/* Mobile Header in Sidebar */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 md:hidden">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
        </div>

        {/* Navigation Buttons */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => {
              handleToggle("updateProfile");
              filledProfile();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
              show === "updateProfile"
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
            onClick={() => {
              handleToggle("upcoming");
              electionNames();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
              show === "upcoming"
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
            View Upcoming Elections
          </button>

          <button
            onClick={() => {
              handleToggle("register");
              electionNames();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
              show === "register"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            Register for Election
          </button>

          <button
            onClick={() => {
              handleToggle("eligible");
              eligibleNames();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
              show === "results"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            View Results
          </button>

          <button
            onClick={() => roleChange("voter")}
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            Cast Vote
          </button>
        </nav>

        {/* Sidebar Footer - Always pushed to bottom due to flex-col and flex-1 above */}
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

      {/* 2. MAIN CONTENT AREA */}
      {/* Changed: Added md:ml-64 to push content to the right of fixed sidebar on desktop */}
      <main className="flex-1 w-full md:ml-64 p-4 pt-20 md:p-10 md:pt-10 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto">
          {/* Default Welcome Screen */}
          {show === "empty" && (
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
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  ></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
                  Welcome Contestant
                </h1>
                <p className="text-lg md:text-xl text-slate-500">
                  Manage your candidacy and profile here.
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
                <b>Regularly check for upcoming elections.</b>
              </div>
            </div>
          )}

          {/* Update Profile Form */}
          {show === "updateProfile" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-in slide-in-from-left-4 duration-300">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Update Candidate Profile
              </h2>

              <form
                onSubmit={profile}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                {/* Name */}
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

                {/* Age */}
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

                {/* Position Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Contesting For
                  </label>
                  <select
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="NULL">-select-</option>
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Sports Secretary">Sports Secretary</option>
                    <option value="Cultural Secretary">
                      Cultural Secretary
                    </option>
                  </select>
                </div>

                {/* Year Selection */}
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

                {/* Branch */}
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

                {/* Section */}
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

                {/* Roll No */}
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

                {/* Submit Button */}
                <div className="md:col-span-2 pt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
                    Save Candidate Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Eligible elections*/}
          {show === "eligible" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                See the live results of the elections you are contesting in:
              </h2>
              <ElectionGridResults
                elections={eCNames}
                onSelect={fetchResults}
              />
            </div>
          )}

          {/* Upcoming elections */}
          {show === "upcoming" && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                Upcoming elections:
              </h2>
              <ElectionGridUser elections={eNames} />
            </div>
          )}

          {show == "results" && (
            <div className="results-container">
              <LiveResult
                results={Results}
                electionName={showRes}
                start={start}
                end={end}
                setShow={screen}
              />
            </div>
          )}
          {/* winners */}
          {show === "winners" && (
            <WinnersDisplay results={Results} electionName={showRes} />
          )}

          {/*register*/}
          {show === "register" && (
            <RegistrationModal
              isOpen={show === "register"}
              eNames={eNames}
              post={ePost}
              onClose={() => setShow("empty")}
              onSubmit={handleRegistrationSubmit}
            />
          )}

          {/* Placeholders for other pages */}
          {show === "register" && (
            <div className="text-center py-10 md:py-20 animate-in fade-in duration-300">
              <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-400">
                Section Under Construction
              </h2>
              <p className="text-slate-400">
                You clicked:{" "}
                <span className="font-mono text-blue-400">{show}</span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Contestant;
