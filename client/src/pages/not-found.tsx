import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md p-8 bg-card rounded-3xl border border-border/50 shadow-xl shadow-black/5">
        <div className="mx-auto w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-display font-bold text-foreground">404</h1>
        <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground pb-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="rounded-xl px-8 shadow-md">
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
