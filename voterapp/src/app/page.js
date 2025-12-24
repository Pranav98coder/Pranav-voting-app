import Link from "next/link";

export default function Home() {
  return (
    // Main Container: Full viewport height, flex column layout, light background
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Navigation Bar: Pushes content to the right */}
      <nav className="w-full flex justify-end items-center p-6 gap-4">
        <Link href="/signIn">
          {/* Secondary Button: Outline style with hover effect */}
          <button className="px-6 py-2.5 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-white hover:border-slate-400 transition-all duration-200">
            Sign In
          </button>
        </Link>

        <Link href="/signUp">
          {/* Primary Button: Blue background, shadow, lift on hover */}
          <button className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 transition-all duration-200">
            Sign Up
          </button>
        </Link>
      </nav>

      {/* Hero Section: Grows to fill remaining space, centers content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Main Title: Large, bold, with a text gradient */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          Welcome to VoterApp
        </h1>

        {/* Subtitle: Muted text color, limited width for readability */}
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed">
          Your gateway to secure, transparent, and efficient voting for the
          modern era.
        </p>
      </main>
    </div>
  );
}
