import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useComplaints } from "@/hooks/use-complaints";
import { ComplaintCard } from "@/components/complaint-card";
import { CreateComplaintDialog } from "@/components/create-complaint-dialog";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, InboxIcon, FilterX } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: complaints, isLoading } = useComplaints(
    statusFilter !== "all" ? { status: statusFilter } : undefined
  );

  const filteredComplaints = complaints?.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const isStudent = user?.role === "Student";

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            {isStudent ? "My Grievances" : "Grievance Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {isStudent 
              ? "Track and manage your submitted requests." 
              : "Monitor, assign, and resolve student issues."}
          </p>
        </motion.div>
        
        {isStudent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CreateComplaintDialog />
          </motion.div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search by keyword, category..." 
            className="pl-11 h-12 rounded-xl bg-card border-border shadow-sm text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 rounded-xl bg-card shadow-sm border-border">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-secondary/40 animate-pulse border border-border/50"></div>
          ))}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-dashed border-border shadow-sm">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            {searchQuery || statusFilter !== "all" ? (
              <FilterX className="w-10 h-10 text-muted-foreground" />
            ) : (
              <InboxIcon className="w-10 h-10 text-primary/50" />
            )}
          </div>
          <h3 className="text-xl font-bold font-display text-foreground">No grievances found</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            {searchQuery || statusFilter !== "all" 
              ? "Try adjusting your search or filters to find what you're looking for." 
              : isStudent 
                ? "You haven't submitted any grievances yet. If you have an issue, file a new grievance above."
                : "The queue is completely clear. Excellent job!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint, index) => (
            <ComplaintCard key={complaint.id} complaint={complaint} index={index} />
          ))}
        </div>
      )}
    </Layout>
  );
}
