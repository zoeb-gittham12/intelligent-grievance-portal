import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { api } from "@shared/routes";
import { motion } from "framer-motion";
import { ShieldAlert, Terminal, User, Lock, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Determine role from query string if available
    const searchParams = new URLSearchParams(window.location.search);
    const r = searchParams.get("role");
    if (r) {
      setRole(r);
      // Pre-fill demo accounts for easy testing based on role
      if (r === "student") {
        form.setValue("username", "student1");
        form.setValue("password", "password");
      } else if (r === "admin") {
        form.setValue("username", "admin");
        form.setValue("password", "password");
      }
    }
  }, []);

  const form = useForm<z.infer<typeof api.auth.login.input>>({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof api.auth.login.input>) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.message || "Invalid credentials");
        return;
      }
      
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      
      const pathRole = String(result.role).toLowerCase();
      if (pathRole === "student") {
        setLocation("/student/dashboard");
      } else if (pathRole === "admin") {
        setLocation("/admin/dashboard");
      } else {
        setLocation("/");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#8a9a6a] overflow-hidden">
      {/* Retro Cassette Aesthetics Base CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --ink: #1a1e12;
          --paper: #c8cc9a;
          --glow: #b8cc6a;
          --sage: #8a9a6a;
        }

        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-tech { font-family: 'Share Tech Mono', monospace; }

        .grain-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.25;
          z-index: 50;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 40;
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15));
          background-size: 100% 4px;
        }

        .blueprint-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(26, 30, 18, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26, 30, 18, 0.1) 1px, transparent 1px);
        }

        /* Cassette Player Container */
        .cassette-deck {
          background-color: var(--paper);
          border: 4px solid var(--ink);
          box-shadow: 12px 12px 0px rgba(26, 30, 18, 0.8), inset -4px -4px 0px rgba(0,0,0,0.1), inset 4px 4px 0px rgba(255,255,255,0.4);
          border-radius: 12px;
          position: relative;
          z-index: 20;
          overflow: hidden;
        }

        .cassette-window {
          background-color: var(--ink);
          border: 4px solid var(--ink);
          box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
          border-radius: 8px;
          color: var(--glow);
          position: relative;
        }
        
        .cassette-window::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.4) 100%);
          pointer-events: none;
        }

        .cassette-reel {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 10px solid var(--ink);
          border-top-color: var(--glow);
          border-bottom-color: var(--glow);
          opacity: 0.6;
          animation: reel-spin 3s linear infinite;
        }
        
        @keyframes reel-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .input-tech {
          background: transparent;
          border: none;
          border-bottom: 2px solid var(--ink);
          color: var(--ink);
          font-family: 'Share Tech Mono', monospace;
          outline: none;
          border-radius: 0;
        }
        .input-tech:focus {
          border-bottom-color: var(--sage);
          background: rgba(138,154,106,0.15);
        }
        .input-tech::placeholder {
          color: rgba(26, 30, 18, 0.3);
        }

        .btn-tech {
          background-color: var(--ink);
          color: var(--glow);
          text-transform: uppercase;
          border: 2px solid var(--ink);
          box-shadow: 4px 4px 0px rgba(26,30,18,0.4);
          transition: all 0.1s;
        }
        .btn-tech:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px rgba(26,30,18,0.4);
        }
        .btn-tech:hover {
          background-color: #2a2e22;
        }
      `}} />

      <div className="grain-overlay" />
      <div className="scanlines" />
      <div className="blueprint-grid" />

      <motion.div 
        initial={{ opacity: 0, y: 50, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-xl px-4 z-20"
      >
        <div className="cassette-deck p-6 md:p-8 flex flex-col gap-6 font-tech text-[#1a1e12]">
          
          {/* Deck Header */}
          <div className="flex justify-between items-start border-b-2 border-[#1a1e12] pb-4">
            <div>
              <h1 className="font-bebas text-5xl md:text-6xl tracking-widest leading-none mb-1">
                {role ? `${role} LINK` : "AUTH LINK"}
              </h1>
              <div className="text-xs font-bold uppercase tracking-widest opacity-80">
                DECK ENGAGED // AWAITING CREDENTIALS
              </div>
            </div>
            <div className="flex gap-2 p-1 border-2 border-[#1a1e12] rounded bg-[#8a9a6a]/20">
              <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-[#1a1e12]"></div>
              <div className="w-3 h-3 rounded-full bg-[#1a1e12]"></div>
            </div>
          </div>

          {/* Cassette Tape Window (Glowing Display) */}
          <div className="cassette-window p-6 flex flex-col items-center justify-center gap-6 my-2">
            <div className="flex w-full justify-around items-center px-2">
              <div className="cassette-reel"></div>
              <div className="flex flex-col items-center flex-1">
                {role === "admin" ? (
                  <Terminal className="w-12 h-12 mb-2 drop-shadow-[0_0_10px_rgba(184,204,106,0.8)] text-[#b8cc6a]" />
                ) : role === "student" ? (
                  <User className="w-12 h-12 mb-2 drop-shadow-[0_0_10px_rgba(184,204,106,0.8)] text-[#b8cc6a]" />
                ) : (
                  <ShieldAlert className="w-12 h-12 mb-2 drop-shadow-[0_0_10px_rgba(184,204,106,0.8)] text-[#b8cc6a]" />
                )}
                <div className="text-[12px] tracking-[0.4em] font-bold text-[#b8cc6a] uppercase">
                  {role || "IDENTIFY"}
                </div>
              </div>
              <div className="cassette-reel" style={{ animationDirection: "reverse" }}></div>
            </div>
            
            {/* Audio Level Indicator */}
            <div className="w-full h-3 border border-[#b8cc6a]/40 rounded-sm overflow-hidden flex gap-1 p-0.5">
              {Array.from({length: 25}).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-[#b8cc6a]" 
                  style={{ opacity: Math.random() > 0.3 ? 1 : 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <div className="relative flex flex-col">
                <label className="text-sm font-bold mb-1 uppercase tracking-widest">Username [ID]</label>
                <div className="relative">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                  <input
                    {...form.register("username")}
                    className="input-tech w-full pl-8 py-2 text-xl font-bold uppercase tracking-wider"
                    placeholder="ENTER ID"
                  />
                </div>
                {form.formState.errors.username && (
                   <div className="text-red-700 text-xs mt-1 font-bold">{form.formState.errors.username.message}</div>
                )}
              </div>
              
              <div className="relative flex flex-col">
                <label className="text-sm font-bold mb-1 uppercase tracking-widest">Passphrase</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
                  <input
                    {...form.register("password")}
                    type="password"
                    className="input-tech w-full pl-8 py-2 text-xl tracking-widest"
                    placeholder="••••••••"
                  />
                </div>
                {form.formState.errors.password && (
                   <div className="text-red-700 text-xs mt-1 font-bold">{form.formState.errors.password.message}</div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-tech w-full py-5 text-2xl font-bebas tracking-[0.2em] flex justify-center items-center gap-3 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>INITIATE LINK <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </form>

          {/* Footer Controls */}
          <div className="flex justify-between items-center text-[10px] font-bold border-t-2 border-[#1a1e12] pt-4 mt-2 tracking-widest uppercase">
            <div>SYS.MODE: {error ? <span className="text-red-700 font-extrabold text-[12px]">ERROR</span> : "READY"}</div>
            {error && <div className="text-red-700 font-bold">{error}</div>}
            <button onClick={() => setLocation("/register")} className="hover:underline flex items-center gap-1 font-extrabold text-[#1a1e12]">
              Create New Record <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
