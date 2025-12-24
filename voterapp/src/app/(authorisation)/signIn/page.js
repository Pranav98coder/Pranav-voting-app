"use client";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

const signIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        toast.error("Please fill all fields");
        return;
      }

      const info = {
        username: username,
        password: password,
      };
      const respo = await axios.post("/api/v1/users/login", info, {
        headers: { "Content-Type": "application/json" },
      });
      //console.log("backend error", respo.data.message);
      console.log(respo);
      console.log("role", (await respo).data.data.user.role);
      setRole(respo.data.data.user.role);
      router.push("/" + respo.data.data.user.role);
      toast.success("Signed In Successfully as " + respo.data.data.user.role);
    } catch (err) {
      console.log("response", err.response);
      console.log("request", err.request);

      console.log("message", err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    // 1. Outer Container: Matches the Home page background and centering
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      {/* 2. The Card: White background, shadow, and rounded corners */}
      <Toaster position="top-right" richColors />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-8">
          Sign In
        </h1>

        <form className="space-y-6" onSubmit={handleSignIn}>
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default signIn;
