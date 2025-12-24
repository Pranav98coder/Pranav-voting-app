"use client";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter");
  const router = useRouter();

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      if (!name || !password) {
        toast.error("Please fill all fields");
        return;
      }
      const dat = {
        username: name,
        password: password,
        role: role,
      };
      console.log("data: ", dat);
      const response = await axios.post("/api/v1/users/register", dat, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response.data);
      toast.success("Registered Successfully");
      router.push("/" + role);
    } catch (err) {
      console.log("response");
      console.log(err.response);
      console.log("request");
      console.log(err.request);

      console.log("message");
      console.log(err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
      console.log(err.response);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 p-4">
      <Toaster position="top-right" richColors />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-8">
          Sign Up
        </h1>
        <form className="space-y-6" onSubmit={registerHandler}>
          {/* ... (Username and Password inputs remain the same) ... */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300"
              placeholder="Enter password"
            />
          </div>

          {/* CRITICAL FIX: Role Dropdown */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Role
            </label>
            <div className="relative">
              <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer"
              >
                {/* Values MUST match your folder names in src/app exactly */}
                <option value="voter">Voter</option>

                {/* CHANGED value from "candidate" to "contestant" to match folder name */}
                <option value="contestant">Candidate</option>

                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
