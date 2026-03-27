import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 bg-slate-900/50 p-10 rounded-2xl border border-slate-800 shadow-2xl">
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome, Student</h1>
        <p className="text-slate-400">Your portal is ready.</p>
        
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl py-4 transition-all">
          Submit a Grievance
        </button>

        <div className="pt-4">
          <Link to="/" className="text-slate-400 hover:text-white underline transition-colors">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}
