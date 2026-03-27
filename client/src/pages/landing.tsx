import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, BookOpen, GraduationCap, User, ArrowRight } from "lucide-react";
import React from "react";

function AuthProfile3D() {
  const navigate = useNavigate();
  // Motion values to track mouse position for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the motion values so it feels like a heavy fluid model
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  // Map mouse position [-0.5, 0.5] to a rotation angle [-15deg, 15deg]
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1400 }} className="w-full max-w-sm">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full flex flex-col gap-4 bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-700/60 shadow-[0_0_60px_rgba(30,58,138,0.3)] transition-shadow duration-300 hover:shadow-[0_0_80px_rgba(30,58,138,0.5)]"
      >
        {/* Deep Glow Behind Block (Pop Out inverted) */}
        <div 
          className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 pointer-events-none" 
          style={{ transform: "translateZ(-30px)", filter: "blur(20px)" }} 
        />
        
        {/* Floating Header */}
        <h3 
          className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest border-b border-slate-700/80 pb-3 flex items-center justify-between pointer-events-none"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="text-white drop-shadow-md">Auth Profile</span>
          <span className="text-xs font-mono font-normal">v2.4</span>
        </h3>
        
        <div className="flex flex-col gap-4" style={{ transformStyle: "preserve-3d" }}>
          {/* STUDENT POP-OUT CARD */}
          <button 
            onClick={() => navigate('/student/login')}
            style={{ transform: "translateZ(50px)" }}
            className="group relative flex items-center gap-5 p-5 border border-slate-700/50 bg-[#0d1326]/90 hover:bg-[#11182c]/90 transition-all duration-500 rounded-2xl text-left shadow-2xl hover:shadow-blue-900/40 hover:border-blue-500/50"
          >
            {/* Subtle light sweep effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none rounded-2xl" />

            <div className="p-3 rounded-xl bg-[#131c38] text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-inner">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-wider text-slate-100 group-hover:text-blue-300 transition-colors drop-shadow-md">STUDENT</div>
              <div className="text-[10px] tracking-widest text-slate-400 mt-1 uppercase font-mono group-hover:text-slate-300">Connect to Portal</div>
            </div>
          </button>

          {/* ADMIN POP-OUT CARD */}
          <button 
            onClick={() => navigate('/admin/login')}
            style={{ transform: "translateZ(40px)" }}
            className="group relative flex items-center gap-5 p-5 border border-slate-700/50 bg-[#0d1326]/90 hover:bg-[#11182c]/90 transition-all duration-500 rounded-2xl text-left shadow-2xl hover:shadow-purple-900/40 border-purple-500/10 hover:border-purple-500/50"
          >
            {/* Subtle light sweep effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none rounded-2xl" />

            <div className="p-3 rounded-xl bg-[#171430] text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-wider text-slate-100 group-hover:text-purple-300 transition-colors drop-shadow-md">ADMINISTRATOR</div>
              <div className="text-[10px] tracking-widest text-slate-400 mt-1 uppercase font-mono group-hover:text-slate-300">System Access</div>
            </div>
          </button>
        </div>

        {/* FLOATING REGISTER BLOCK */}
        <div 
          className="absolute -bottom-8 left-6 right-6"
          style={{ transform: "translateZ(60px)" }}
        >
          <button 
            onClick={() => navigate('/register')}
            className="w-full relative flex items-center justify-between p-4 border border-blue-500/30 bg-slate-900/95 backdrop-blur-xl hover:bg-slate-800 transition-all duration-300 rounded-[1.25rem] text-left shadow-[0_20px_40px_rgba(0,0,0,0.6)] group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
            
            <div className="flex flex-col">
              <div className="text-white font-bold tracking-wide text-sm drop-shadow-md group-hover:text-blue-300 transition-colors">NEW TO PORTAL?</div>
              <div className="text-[10px] tracking-widest text-slate-400 mt-0.5 uppercase font-mono group-hover:text-slate-300 transition-colors">Register for an account</div>
            </div>
            
            <div className="p-2.5 rounded-lg bg-[#131c38] text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-inner flex items-center justify-center">
               <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Floating Architectural Grid Accent */}
        <div 
          className="absolute -right-8 -bottom-8 w-32 h-32 opacity-[0.15] pointer-events-none rounded-full"
          style={{ 
            transform: "translateZ(70px) rotateX(15deg) rotateY(-15deg)",
            backgroundImage: "linear-gradient(rgba(120,150,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,255,1) 1px, transparent 1px)",
            backgroundSize: "16px 16px"
          }}
        />
        <div 
          className="absolute -left-4 -top-4 w-16 h-16 opacity-30 pointer-events-none border border-blue-400/30 rounded-full"
          style={{ transform: "translateZ(60px)" }}
        />
        <div 
          className="absolute -left-6 -top-6 w-20 h-20 opacity-20 pointer-events-none border border-blue-400/20 rounded-full"
          style={{ transform: "translateZ(40px)" }}
        />
      </motion.div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1e] overflow-hidden font-sans text-slate-100 selection:bg-blue-900/50 perspective-1000">
      
      {/* Dynamic Structural / Blueprint 3D Floor Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-30">
        
        {/* Architectual 3D Grid background (University floor blueprint metaphor) */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: "perspective(1200px) rotateX(70deg) translateY(-50px) translateZ(-300px)",
          transformOrigin: "top center",
          boxShadow: "inset 0 0 100px 100px #0a0f1e" // fade edges
        }} />
        
        {/* Ambient Spheres */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col p-6 md:p-12 max-w-7xl mx-auto">
        <nav className="flex justify-between items-center w-full mb-12 lg:mb-20">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <ShieldAlert className="w-6 h-6 text-white relative z-10" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white select-none hidden sm:block leading-tight">
                SmartGrievance
              </h1>
              <span className="text-xs font-bold text-blue-300 uppercase tracking-widest hidden sm:block">
                University Administration Portal
              </span>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-between w-full h-full gap-16 lg:gap-12 pb-12">
          {/* Left Text */}
          <motion.div
            className="flex-1 flex flex-col justify-center text-center lg:text-left z-20"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131b33] border border-blue-900/60 text-blue-300 text-sm font-medium w-fit mx-auto lg:mx-0 mb-8 shadow-inner">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="tracking-wide">Interactive Academic Model</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
              <span className="text-white drop-shadow-sm">Intelligent</span><br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Grievance</span><br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">Routing</span>
            </h2>
            
            <p className="max-w-xl mx-auto lg:mx-0 text-slate-300/90 text-lg md:text-xl leading-relaxed mb-10 font-light">
              A secure, automated triage engine that connects students directly with the right department. Ensure every concern is heard, routed, and resolved.
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-8 opacity-90 bg-slate-900/40 p-5 rounded-2xl backdrop-blur-sm border border-slate-800/60 w-fit mx-auto lg:mx-0 shadow-lg">
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-100"><ShieldAlert className="w-4 h-4 text-blue-400"/> SECURE</div>
                <div className="text-xs text-slate-400 font-mono">Encrypted Hub</div>
              </div>
              <div className="w-[1px] h-8 bg-slate-700"></div>
              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-100"><GraduationCap className="w-4 h-4 text-indigo-400"/> ACADEMIC</div>
                <div className="text-xs text-slate-400 font-mono">Auth Profile</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Interactive 3D Working Model Block */}
          <motion.div 
            className="flex-1 flex justify-center lg:justify-end w-full z-20"
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.2 }}
          >
            <AuthProfile3D />
          </motion.div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
