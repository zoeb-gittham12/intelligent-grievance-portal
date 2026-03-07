import { Link } from "wouter";
import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type Complaint } from "@shared/routes";
import { StatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { ChevronRight, Calendar, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface ComplaintCardProps {
  complaint: Complaint;
  index: number;
}

export function ComplaintCard({ complaint, index }: ComplaintCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/complaints/${complaint.id}`}>
        <Card className="group relative overflow-hidden rounded-2xl border border-border/60 hover:border-primary/30 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer h-full flex flex-col bg-card">
          {/* Subtle gradient strip on top based on priority */}
          <div className={`h-1.5 w-full absolute top-0 left-0 ${
            complaint.predictedPriority?.toLowerCase() === 'high' ? 'bg-red-500' :
            complaint.predictedPriority?.toLowerCase() === 'medium' ? 'bg-orange-400' :
            'bg-slate-300'
          }`} />
          
          <CardContent className="p-6 flex-1 pt-7">
            <div className="flex justify-between items-start mb-4 gap-4">
              <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2 font-display">
                {complaint.title}
              </h3>
              <div className="flex shrink-0 gap-2">
                <PriorityBadge priority={complaint.predictedPriority} />
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
              {complaint.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center bg-secondary/50 px-2.5 py-1 rounded-md">
                <Tag className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                {complaint.category}
              </div>
              <div className="flex items-center bg-secondary/50 px-2.5 py-1 rounded-md">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                {complaint.createdAt ? format(new Date(complaint.createdAt), 'MMM d, yyyy') : 'Unknown'}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-6 py-4 bg-secondary/20 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge status={complaint.status} />
              {complaint.predictedDepartment && (
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
                  → {complaint.predictedDepartment}
                </span>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
