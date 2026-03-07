import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/hooks/use-auth";
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
import { ShieldAlert, Sparkles, Loader2, Lock, User } from "lucide-react";
import { api } from "@shared/routes";
import { motion } from "framer-motion";

export default function Login() {
  const login = useLogin();

  const form = useForm<z.infer<typeof api.auth.login.input>>({
    resolver: zodResolver(api.auth.login.input),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof api.auth.login.input>) => {
    login.mutate(data);
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
            Intelligent resolution for student issues.
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8">
            An automated triage system that uses AI to analyze, route, and prioritize grievances directly to the right department—ensuring faster and fairer resolutions.
          </p>
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-fit">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <span className="font-medium text-sm">Powered by AI Routing Engine</span>
          </div>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} University Administration
        </div>
      </div>

      {/* Right side - Login Form */}
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
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Welcome back</h2>
              <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                            placeholder="Enter your username" 
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground font-semibold">Password</FormLabel>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-11 h-12 rounded-xl bg-secondary/30 focus:bg-background transition-colors" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl text-md font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" 
                    disabled={login.isPending}
                  >
                    {login.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                Demo Accounts: <br />
                Student: <code className="bg-secondary px-1 py-0.5 rounded text-xs text-foreground">student / pass</code> <br />
                Admin: <code className="bg-secondary px-1 py-0.5 rounded text-xs text-foreground">admin / pass</code>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
