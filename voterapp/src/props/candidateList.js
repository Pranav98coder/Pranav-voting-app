const CandidateCard = ({ user }) => {
  // Guard clause to prevent crashes if data is missing
  if (!user) return null;

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 flex flex-col gap-4">
      {/* 1. Header: Avatar & Name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar: Purple Theme */}
          <div className="w-12 h-12 rounded-full bg-purple-50 text-orange-500 flex items-center justify-center font-bold text-lg uppercase ring-2 ring-purple group-hover:ring-orange-100 transition-all shadow-sm">
            {user.name ? user.name.charAt(0) : "C"}
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-orange-500 transition-colors">
              {user.name || "Unknown Candidate"}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {user.rollno || "No Roll No"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Position Badge (The most important info) */}
      <div className="mt-1">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-orange-100 to-fuchsia-100 text-orange-700 border border-orange-200">
          {user.post || "Position Unknown"}
        </span>
      </div>

      {/* 3. Divider */}
      <hr className="border-slate-100 group-hover:border-slate-200 transition-colors" />

      {/* 4. Details Grid (Branch & Year) */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
            Branch
          </p>
          <p className="font-semibold text-slate-700 ">{user.branch || "-"}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
            Year
          </p>
          <p className="font-semibold text-slate-700 ">{user.year || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
