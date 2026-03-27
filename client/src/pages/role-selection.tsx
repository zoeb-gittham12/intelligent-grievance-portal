import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, ShieldAlert, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    id: "Student",
    title: "Student",
    description: "Submit grievances and track resolution progress",
    icon: User,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    glow: "shadow-blue-500/20",
    hoverBorder: "hover:border-blue-400/60",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    loginPath: "/student/login",
  },
  {
    id: "Faculty",
    title: "Faculty",
    description: "Review and respond to department grievances",
    icon: BookOpen,
    color: "indigo",
    gradient: "from-indigo-500 to-indigo-600",
    glow: "shadow-indigo-500/20",
    hoverBorder: "hover:border-indigo-400/60",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    loginPath: "/student/login",
  },
  {
    id: "Admin",
    title: "Administrator",
    description: "Manage, route, and resolve all grievances",
    icon: ShieldAlert,
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
    glow: "shadow-purple-500/20",
    hoverBorder: "hover:border-purple-400/60",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    loginPath: "/admin/login",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 14 },
  },
};

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: (typeof roles)[number]) => {
    localStorage.setItem("selectedRole", role.id);
    navigate(role.loginPath);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0a0f1e] overflow-hidden font-sans text-slate-100 selection:bg-blue-900/50">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.07) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6 md:p-12 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131b33] border border-blue-900/60 text-blue-300 text-sm font-medium mb-6 shadow-inner">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            <span className="tracking-wide">SmartGrievance Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            <span className="text-white">Choose Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Role
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Select how you'd like to access the grievance portal
          </p>
        </motion.div>

        {/* Role Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={`group relative flex flex-col items-center text-center p-8 rounded-3xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl cursor-pointer transition-all duration-300 ${role.hoverBorder} hover:shadow-2xl ${role.glow}`}
                onClick={() => handleRoleSelect(role)}
              >
                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-2xl ${role.iconBg} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}
                >
                  <Icon
                    className={`w-10 h-10 ${role.iconColor} transition-colors`}
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                  {role.description}
                </p>

                {/* Continue Button */}
                <Button
                  className={`w-full h-11 rounded-xl font-semibold bg-gradient-to-r ${role.gradient} text-white border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 mt-auto`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          <button
            onClick={() => navigate("/")}
            className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
          >
            ← Back to Landing Page
          </button>
        </motion.div>
      </div>
    </div>
  );
}
