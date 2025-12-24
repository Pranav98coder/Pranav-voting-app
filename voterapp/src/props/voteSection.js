import CandidateCard from "./candidateList"; // Adjust path as needed

const VotingSection = ({ categories, votes, onVote, onSubmit }) => {
  // Helper Component for a single category
  const CategoryGroup = ({ title, list }) => (
    <div className="mb-12 animate-in slide-in-from-right-8 duration-500">
      <h3 className="text-lg md:text-xl font-bold text-slate-700 mb-4 md:mb-6 flex flex-wrap items-center gap-3 border-l-4 border-blue-500 pl-4">
        {title}
        <span className="text-[10px] md:text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-wide">
          Select One
        </span>
      </h3>

      {list && list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {list.map((candidate) => {
            const isSelected = votes[title] === candidate.ContestantProfile;

            return (
              <div
                key={candidate.ContestantProfile}
                onClick={() => onVote(title, candidate.ContestantProfile)}
                className={`relative cursor-pointer rounded-xl transition-all duration-200 group border
                  ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50/30 shadow-lg scale-[1.01]"
                      : "border-slate-200 hover:border-blue-300 hover:shadow-md bg-white"
                  }`}
              >
                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 z-10 bg-blue-600 text-white rounded-full p-1 shadow-md scale-in-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                )}

                {/* Card Content - Pointer events disabled to let parent handle click */}
                <div className="pointer-events-none p-1">
                  <CandidateCard user={candidate.ContestantProfile} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 md:p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-sm md:text-base text-slate-400 italic">
          No candidates registered for {title}.
        </div>
      )}
    </div>
  );

  return (
    <div className="pb-32 md:pb-24">
      {/* Page Header */}
      <div className="mb-6 md:mb-8 border-b border-slate-200 pb-4 md:pb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
          Official Ballot
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-2">
          Select your preferred candidate for each position below.
        </p>
      </div>

      {/* Render All Categories */}
      {categories.map((cat) => (
        <CategoryGroup key={cat.title} title={cat.title} list={cat.list} />
      ))}

      {/* --- RESPONSIVE FLOATING SUBMIT BAR --- */}
      <div
        className="fixed bottom-0 right-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-md p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300
        left-0 md:left-64"
      >
        <div className="max-w-5xl w-full mx-auto flex justify-between items-center px-2 md:px-4 gap-4">
          {/* Selection Counter */}
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Selections
            </span>
            <span className="text-base md:text-lg font-bold text-slate-800">
              <span className="text-blue-600">{Object.keys(votes).length}</span>
              <span className="text-slate-400 mx-1">/</span>
              {categories.length}
            </span>
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 md:px-8 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="text-sm md:text-base">Submit Ballot</span>
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingSection;
