import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldAlert, Sparkles, Loader2, Lock, User, BookOpen, CheckCircle } from "lucide-react";
import { api, ROLES } from "@shared/routes";
import { motion } from "framer-motion";

const registerSchema = api.auth.register.input;

const PasswordRequirements = ({ password }: { password: string }) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isLongEnough = password.length >= 6;

  const allRequirementsMet = hasUppercase && hasLowercase && hasSpecialChar && isLongEnough;

  return (
    <div className="space-y-2 mt-3 p-3 bg-secondary/30 rounded-lg border border-border/40">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password Requirements:</p>
      <div className="space-y-1.5">
        <div className={`flex items-center gap-2 text-sm transition-colors ${isLongEnough ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isLongEnough ? "bg-green-600 dark:bg-green-400" : "border border-muted-foreground"}`}>
            {isLongEnough && <span className="text-white text-xs">✓</span>}
          </div>
          <span>At least 6 characters</span>
        </div>
        <div className={`flex items-center gap-2 text-sm transition-colors ${hasUppercase ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasUppercase ? "bg-green-600 dark:bg-green-400" : "border border-muted-foreground"}`}>
            {hasUppercase && <span className="text-white text-xs">✓</span>}
          </div>
          <span>At least 1 uppercase letter (A-Z)</span>
        </div>
        <div className={`flex items-center gap-2 text-sm transition-colors ${hasLowercase ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasLowercase ? "bg-green-600 dark:bg-green-400" : "border border-muted-foreground"}`}>
            {hasLowercase && <span className="text-white text-xs">✓</span>}
          </div>
          <span>At least 1 lowercase letter (a-z)</span>
        </div>
        <div className={`flex items-center gap-2 text-sm transition-colors ${hasSpecialChar ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasSpecialChar ? "bg-green-600 dark:bg-green-400" : "border border-muted-foreground"}`}>
            {hasSpecialChar && <span className="text-white text-xs">✓</span>}
          </div>
          <span>At least 1 special character (!@#$%^&*, etc.)</span>
        </div>
      </div>
    </div>
  );
};

export default function Register() {
  const navigate = useNavigate();
  const [passwordValue, setPasswordValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showSuccessModal) {
      timeout = setTimeout(() => {
        navigate("/");
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [showSuccessModal, navigate]);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "Student",
      department: "",
    },
  });

  const handleRegister = async () => {
    const data = form.getValues();
    
    if (!data.username || !data.password || !data.role) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const payload = {
        username: data.username,
        password: data.password,
        role: data.role,
        department: data.department
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.message || "Registration failed");
        return;
      }
      
      setShowSuccessModal(true);
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => navigate("/")}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-card border border-border/60 shadow-2xl rounded-3xl p-10 max-w-sm w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, duration: 0.5, bounce: 0.4 }}
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              Account Created Successfully!
            </h3>
            <p className="text-muted-foreground mb-8">
              Welcome to SmartGrievance
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full h-12 rounded-xl text-md font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              Continue
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Redirecting automatically in 2 seconds…</p>
          </motion.div>
        </motion.div>
      )}
      {/* Left side - Branding/Info */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/40 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight">SmartGrievance</h1>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-5xl font-display font-bold leading-tight mb-6">
            Join SmartGrievance
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8">
            Create your account to submit grievances and get them resolved faster with our AI-powered routing system.
          </p>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-fit">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <span className="font-medium text-sm">Instant AI Analysis & Routing</span>
          </div>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} University Administration
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="p-3 bg-primary rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">SmartGrievance</h1>
          </div>

          <div className="bg-card border border-border/60 shadow-2xl shadow-black/5 rounded-3xl p-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Create Account</h2>
              <p className="text-muted-foreground">Choose your role and set up your account.</p>
            </div>

            <Form {...form}>
              <form className="space-y-5">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Role</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-secondary/30 focus:bg-background border-border">
                            <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Faculty">Faculty</SelectItem>
                          <SelectItem value="HOD">HOD (Head of Department)</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input 
                            placeholder="Choose a unique username" 
                            className="pl-11 h-12 rounded-xl bg-secondary/30 focus:bg-background transition-colors" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-11 h-12 rounded-xl bg-secondary/30 focus:bg-background transition-colors" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setPasswordValue(e.target.value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <PasswordRequirements password={passwordValue} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Department (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Computer Science, Engineering" 
                          className="h-12 rounded-xl bg-secondary/30 focus:bg-background transition-colors" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="p-3 text-sm font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl mt-2 text-center">
                    {error}
                  </div>
                )}

                <div className="pt-4">
                  <Button 
                    type="button"
                    onClick={handleRegister}
                    className="w-full h-12 rounded-xl text-md font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating...</>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account? <br />
                <button 
                  onClick={() => navigate("/student/login")}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in instead
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
