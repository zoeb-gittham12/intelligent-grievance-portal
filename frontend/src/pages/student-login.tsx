import { useNavigate, Link } from "react-router-dom";
import { User, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import React from "react";
export default function StudentLogin() {
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock Auth: Any email/password works
    navigate("/student/dashboard");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0a0f1e] text-slate-100 font-sans">
      <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
        <ShieldAlert className="w-8 h-8 text-blue-500" />
        <span className="font-bold text-xl tracking-tight text-white hidden sm:block">SmartGrievance</span>
        <span className="text-slate-400 text-sm hidden sm:block">| Student Portal</span>
      </div>

      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 relative">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-full mb-4 bg-blue-500/10 text-blue-500">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Student Login</h1>
          <p className="text-slate-400 text-sm">Access your grievance portal</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                required
                type="text"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Username"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                required
                type="password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl py-3.5 mt-2 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
          >
            Login as Student <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
