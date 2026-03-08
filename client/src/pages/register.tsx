import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@/hooks/use-auth";
import { useLocation } from "wouter";
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
import { ShieldAlert, Sparkles, Loader2, Lock, User, BookOpen } from "lucide-react";
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
  const register = useRegister();
  const [, setLocation] = useLocation();
  const [passwordValue, setPasswordValue] = useState("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "Student",
      department: "",
    },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    register.mutate(data);
  };

  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl text-md font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" 
                    disabled={register.isPending}
                  >
                    {register.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
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
                  onClick={() => setLocation("/login")}
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
