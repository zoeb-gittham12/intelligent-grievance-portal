import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Pages
import LandingPage from "./pages/landing";
import StudentLogin from "./pages/student-login";
import AdminLogin from "./pages/admin-login";
import Dashboard from "./pages/dashboard";
import StudentDashboard from "./pages/student-dashboard";
import AdminDashboard from "./pages/admin-dashboard";
import Register from "./pages/register";
import RoleSelection from "./pages/role-selection";
import ComplaintDetail from "./pages/complaint-detail";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/select-role" element={<RoleSelection />} />
            
            {/* Keeping existing routes for compatibility */}
            <Route path="/complaints/:id" element={<ComplaintDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
