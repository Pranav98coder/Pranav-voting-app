// const VoterCard = ({ user }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
//       {/* Header: Name and Roll No */}
//       <div className="flex justify-between items-start">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm">
//             {user.name.charAt(0)}
//           </div>
//           <div>
//             <h3 className="font-bold text-slate-800 leading-tight">
//               {user.name}
//             </h3>
//             <p className="text-xs text-slate-400 font-mono">
//               {user.rollNumber}
//             </p>
//           </div>
//         </div>
//       </div>

//       <hr className="border-slate-100 my-1" />

//       {/* Details Section */}
//       <div className="space-y-2 text-sm">
//         <div className="flex items-center justify-between text-slate-600">
//           <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
//             Branch
//           </span>
//           <span className="font-medium">{user.branch}</span>
//         </div>
//         <div className="flex items-center justify-between text-slate-600">
//           <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
//             Year
//           </span>
//           <span className="font-medium">{user.year}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VoterCard;

// component name capitalized for React standards
// const VoterCard = ({ user }) => {
//   return (
//     <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-none">
//       {/* Name Column with Avatar Placeholder */}
//       <td className="px-6 py-4">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
//             {user.name.charAt(0)}
//           </div>
//           <span className="font-medium text-slate-900">{user.name}</span>
//         </div>
//       </td>

//       {/* Roll Number */}
//       <td className="px-6 py-4 text-sm text-slate-600 font-mono">
//         {user.rollNumber}
//       </td>

//       {/* Branch */}
//       <td className="px-6 py-4 text-sm text-slate-600">
//         <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium">
//           {user.branch}
//         </span>
//       </td>

//       {/* Year */}
//       <td className="px-6 py-4 text-sm text-slate-600">{user.year}</td>
//     </tr>
//   );
// };

// export default VoterCard;

const VoterCard = ({ user }) => {
  // Safe check to prevent crashes if user data is missing
  if (!user) return null;

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
      {/* 1. Header Section: Avatar & Name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar Circle */}
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm uppercase ring-2 ring-purple group-hover:ring-green-100 transition-all">
            {user.name ? user.name.charAt(0) : "?"}
          </div>

          {/* Name & Roll No */}
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight group-hover:text-green-600 transition-colors">
              {user.name || "Unknown"}
            </h3>
            <p className="text-xs text-amber-700font-mono mt-0.5">
              {user.rollno || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Divider Line */}
      <hr className="border-slate-100 group-hover:border-slate-200 transition-colors" />

      {/* 3. Details Grid (Branch & Year) */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
            Branch
          </p>
          <p className="font-semibold text-slate-700 ">{user.branch || "-"}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
            Year
          </p>
          <p className="font-semibold text-slate-700 ">{user.year || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default VoterCard;
