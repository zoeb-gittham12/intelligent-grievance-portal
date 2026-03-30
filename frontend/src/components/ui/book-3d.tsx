import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function Book3D({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // Gravity-defying particles local to the book stage
  const bookParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 240 - 120,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 3,
    size: Math.random() * 4 + 1,
  }));

  return (
    <div className={cn("book-stage relative z-10", className)}>
      <style dangerouslySetInnerHTML={{__html: `
        .book-stage {
          perspective: 1200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          min-height: 500px;
          position: relative;
        }

        /* Orbiting Rings */
        .orbit-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          transform-style: preserve-3d;
          pointer-events: none;
          z-index: 0;
        }
        .ring-1 {
          width: 480px;
          height: 480px;
          margin-left: -240px;
          margin-top: -240px;
          border: 1px dashed rgba(255, 255, 255, 0.4);
          animation: spin-ring-1 20s linear infinite;
        }
        .ring-2 {
          width: 600px;
          height: 600px;
          margin-left: -300px;
          margin-top: -300px;
          border: 2px dotted rgba(138, 154, 106, 0.6);
          animation: spin-ring-2 30s linear infinite reverse;
        }
        .ring-3 {
          width: 320px;
          height: 320px;
          margin-left: -160px;
          margin-top: -160px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: spin-ring-3 15s linear infinite;
        }

        @keyframes spin-ring-1 {
          0% { transform: rotateX(65deg) rotateY(15deg) rotateZ(0deg); }
          100% { transform: rotateX(65deg) rotateY(15deg) rotateZ(360deg); }
        }
        @keyframes spin-ring-2 {
          0% { transform: rotateX(55deg) rotateY(-35deg) rotateZ(0deg); }
          100% { transform: rotateX(55deg) rotateY(-35deg) rotateZ(360deg); }
        }
        @keyframes spin-ring-3 {
          0% { transform: rotateX(80deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(80deg) rotateY(0deg) rotateZ(360deg); }
        }

        /* Pulsing Glow Aura */
        .glow-aura {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          margin-left: -150px;
          margin-top: -80px;
          background: radial-gradient(circle, rgba(138, 154, 106, 0.3) 0%, transparent 60%);
          border-radius: 50%;
          animation: aura-pulse 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }

        .book-wrapper {
          position: relative;
          width: 240px;
          height: 340px;
          animation: levitate 4s ease-in-out infinite;
          transform-style: preserve-3d;
          transform: rotateX(20deg) rotateY(-20deg);
          cursor: pointer;
          z-index: 10;
        }

        .book-shadow {
          width: 220px;
          height: 25px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          filter: blur(20px);
          margin-top: 60px;
          animation: shadow-pulse 4s ease-in-out infinite;
          z-index: 0;
        }

        @keyframes levitate {
          0%, 100% { transform: rotateX(20deg) rotateY(-20deg) translateY(0); }
          50% { transform: rotateX(15deg) rotateY(5deg) translateY(-30px); }
        }

        @keyframes shadow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(0.7); opacity: 0.2; }
        }

        @keyframes aura-pulse {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.6; }
          50% { transform: scale(1.3) translateY(-15px); opacity: 1; }
        }

        .book-part {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        /* FRONT COVER */
        .front-cover {
          transform-origin: left;
          z-index: 5;
        }
        .is-open .front-cover {
          transform: rotateY(-160deg);
        }

        .cover-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          background-color: #1a1a1a;
          border: 1px solid #333;
          border-radius: 2px 6px 6px 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .front-outer {
          transform: translateZ(12px);
          box-shadow: inset 4px 0 10px rgba(0,0,0,0.5);
        }
        
        .front-outer::after {
          content: "";
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 3px;
          background: rgba(255,255,255,0.1);
        }

        .front-inner {
          transform: rotateY(180deg) translateZ(-12px);
          background-color: #fdfbf7;
          background-image: linear-gradient(transparent 95%, #cbd5e1 95%);
          background-size: 100% 24px;
          box-shadow: inset -5px 0 10px rgba(0,0,0,0.1);
        }
        
        .front-inner::before {
          content: "";
          position: absolute;
          top: 0;
          left: 32px;
          bottom: 0;
          width: 2px;
          background-color: rgba(239, 68, 68, 0.4);
        }

        /* BACK COVER */
        .back-cover {
          transform: translateZ(-12px);
          background-color: #1a1a1a;
          border-radius: 2px 6px 6px 2px;
          box-shadow: 10px 10px 40px rgba(0,0,0,0.6), inset 4px 0 10px rgba(0,0,0,0.5);
        }

        /* SPINE */
        .spine {
          width: 24px;
          height: 100%;
          background-color: #151515;
          transform: rotateY(-90deg) translateZ(12px);
          transform-origin: left;
          border-radius: 2px 0 0 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
        }
        .spine-line {
          width: 80%;
          height: 2px;
          background: rgba(255,255,255,0.1);
        }

        /* PAGES */
        .pages {
          position: absolute;
          left: 3px;
          top: 3px;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
          background: #fdfbf7;
          transform: translateZ(0);
          border-radius: 0 4px 4px 0;
          box-shadow: inset -2px 0 5px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        /* Page Edges */
        .page-edge-right {
          position: absolute;
          right: 0;
          top: 0;
          width: 24px;
          height: 100%;
          background: repeating-linear-gradient(90deg, #fdfbf7, #fdfbf7 1px, #e8e6e1 1px, #e8e6e1 2px);
          transform: rotateY(90deg);
          transform-origin: right;
        }
        .page-edge-top {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 24px;
          background: repeating-linear-gradient(0deg, #fdfbf7, #fdfbf7 1px, #e8e6e1 1px, #e8e6e1 2px);
          transform: rotateX(90deg);
          transform-origin: top;
        }
        .page-edge-bottom {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 24px;
          background: repeating-linear-gradient(0deg, #fdfbf7, #fdfbf7 1px, #e8e6e1 1px, #e8e6e1 2px);
          transform: rotateX(-90deg);
          transform-origin: bottom;
        }

        /* Inner Page Content */
        .page-content {
          padding: 24px;
          height: 100%;
          opacity: 0;
          transition: opacity 0.4s ease;
          transition-delay: 0s;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .is-open .page-content {
          opacity: 1;
          transition-delay: 0.4s;
        }
        .text-skeleton {
          height: 8px;
          background: #d1d5db;
          border-radius: 4px;
          width: 100%;
        }
      `}} />

      {/* Glow Aura */}
      <div className="glow-aura"></div>

      {/* Orbit Rings */}
      <div className="orbit-ring ring-1"></div>
      <div className="orbit-ring ring-2"></div>
      <div className="orbit-ring ring-3"></div>

      {/* Anti-gravity Particles */}
      <div className="absolute inset-0 pointer-events-none z-20 flex justify-center items-center overflow-hidden">
        {bookParticles.map(p => (
          <motion.div
            key={`bp-${p.id}`}
            className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ left: `calc(50% + ${p.x}px)`, width: p.size, height: p.size }}
            initial={{ top: "110%", opacity: 0 }}
            animate={{ 
              top: "-20%", 
              opacity: [0, 0.9, 0] 
            }}
            transition={{ 
              duration: p.duration, 
              delay: p.delay, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>

      <div className={cn("book-wrapper", isOpen && "is-open")} onClick={() => setIsOpen(!isOpen)}>
        {/* Spine */}
        <div className="book-part spine">
          <div className="spine-line" />
          <div className="spine-line" />
          <div className="spine-line" />
          <div className="text-[#8a9a6a] text-[10px] font-bold rotate-90 tracking-widest" style={{ fontFamily: "Bebas Neue" }}>SMARTGRIEVANCE</div>
          <div className="spine-line" />
          <div className="spine-line" />
          <div className="spine-line" />
        </div>

        {/* Back Cover */}
        <div className="book-part back-cover"></div>

        {/* Pages enclosed by front and back */}
        <div className="book-part pages">
          <div className="page-edge-right"></div>
          <div className="page-edge-top"></div>
          <div className="page-edge-bottom"></div>
          
          <div className="page-content">
            <h3 className="font-bold text-lg text-black mb-2" style={{ fontFamily: "Bebas Neue" }}>CHAPTER 1: RESOLUTION</h3>
            <div className="text-skeleton w-[90%]" />
            <div className="text-skeleton w-[85%]" />
            <div className="text-skeleton w-[95%]" />
            <div className="text-skeleton w-[80%]" />
            <div className="text-skeleton w-[40%] mb-4" />

            <div className="text-skeleton w-[85%]" />
            <div className="text-skeleton w-[90%]" />
            <div className="text-skeleton w-[75%]" />
            
            <div className="mt-auto self-end text-xs font-bold text-gray-400">1</div>
          </div>
        </div>

        {/* Front Cover */}
        <div className="book-part front-cover">
          <div className="cover-face front-outer">
            <div className="w-[80%] h-[80%] border-2 border-[#8a9a6a]/30 p-4 flex flex-col items-center justify-center relative">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#8a9a6a]"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#8a9a6a]"></div>
              
              <h2 className="text-[#8a9a6a] text-3xl mb-4 text-center" style={{ fontFamily: "Bebas Neue" }}>SMARTGRIEVANCE</h2>
              <div className="text-center text-[10px] tracking-[0.2em] text-[#8a9a6a]/70 font-mono mt-2">
                INTELLIGENT<br/>RESOLUTION<br/>MANUAL
              </div>
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] text-[#8a9a6a]/50 tracking-widest font-mono">v2.4</div>
          </div>
          <div className="cover-face front-inner overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div 
              className={cn(
                "absolute inset-0 pl-12 pr-4 py-8 flex flex-col transition-opacity duration-500 z-10",
                isOpen ? "opacity-100 pointer-events-auto delay-300" : "opacity-0 pointer-events-none"
              )}
            >
              <h3 className="font-bold text-lg text-black mb-4 uppercase tracking-widest border-b border-black/20 pb-1" style={{ fontFamily: "Bebas Neue" }}>Auth Profile</h3>

              <div className="flex flex-col gap-4 mt-6">
                <button 
                  style={{ pointerEvents: 'all' }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedRole("STUDENT");
                    navigate('/student/login');
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 border-2 transition-all duration-300 rounded-lg text-left group hover:scale-[1.02]",
                    selectedRole === "STUDENT" 
                      ? "bg-blue-950 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                      : "bg-white border-slate-200 text-slate-800 shadow-sm hover:border-blue-400"
                  )}
                >
                  <div className={cn("p-2 rounded-md", selectedRole === "STUDENT" ? "bg-blue-900" : "bg-slate-100 group-hover:bg-blue-50")}>
                    <User className={cn("w-6 h-6", selectedRole === "STUDENT" ? "text-blue-400" : "text-slate-600 group-hover:text-blue-600")} />
                  </div>
                  <div>
                    <div className={cn("font-extrabold text-sm tracking-widest", selectedRole === "STUDENT" && "text-blue-300")}>STUDENT </div>
                    <div className={cn("text-[10px] tracking-widest font-mono mt-1", selectedRole === "STUDENT" ? "text-blue-400/80" : "text-slate-400")}>CONNECT TO PORTAL</div>
                  </div>
                </button>

                <button 
                  style={{ pointerEvents: 'all' }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedRole("ADMIN");
                    navigate('/admin/login');
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 border-2 transition-all duration-300 rounded-lg text-left group hover:scale-[1.02]",
                    selectedRole === "ADMIN" 
                      ? "bg-slate-950 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
                      : "bg-white border-slate-200 text-slate-800 shadow-sm hover:border-indigo-400"
                  )}
                >
                  <div className={cn("p-2 rounded-md", selectedRole === "ADMIN" ? "bg-indigo-900" : "bg-slate-100 group-hover:bg-indigo-50")}>
                    <ShieldAlert className={cn("w-6 h-6", selectedRole === "ADMIN" ? "text-indigo-400" : "text-slate-600 group-hover:text-indigo-600")} />
                  </div>
                  <div>
                    <div className={cn("font-extrabold text-sm tracking-widest", selectedRole === "ADMIN" && "text-indigo-300")}>ADMINISTRATOR</div>
                    <div className={cn("text-[10px] tracking-widest font-mono mt-1", selectedRole === "ADMIN" ? "text-indigo-400/80" : "text-slate-400")}>SYSTEM ACCESS</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="book-shadow"></div>
    </div>
  );
}
