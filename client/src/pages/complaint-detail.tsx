import { useRoute, Link } from "wouter";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useComplaint, useUpdateComplaintStatus } from "@/hooks/use-complaints";
import { Layout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { AIInsight } from "@/components/ai-insight";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, Loader2, Tag, User as UserIcon, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ComplaintDetail() {
  const [, params] = useRoute("/complaints/:id");
  const complaintId = params?.id ? parseInt(params.id) : 0;
  
  const { user } = useAuth();
  const { data: complaint, isLoading } = useComplaint(complaintId);
  const updateStatus = useUpdateComplaintStatus();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </Layout>
    );
  }

  if (!complaint) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Grievance not found</h2>
          <Button asChild><Link href="/">Return to Dashboard</Link></Button>
        </div>
      </Layout>
    );
  }

  const isStaff = user?.role !== "Student";

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate({ id: complaint.id, status: newStatus });
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.predictedPriority} />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
              {complaint.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-3 flex items-center">
              <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded-md mr-3">ID: #{complaint.id.toString().padStart(5, '0')}</span>
              Submitted on {complaint.createdAt ? format(new Date(complaint.createdAt), 'MMMM do, yyyy') : 'Unknown date'}
            </p>
          </div>

          {/* Admin Action Controls */}
          {isStaff && (
            <Card className="p-4 bg-background border-border/60 shadow-sm w-full md:w-64 shrink-0 rounded-2xl">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                Update Status
              </label>
              <Select 
                value={complaint.status} 
                onValueChange={handleStatusChange}
                disabled={updateStatus.isPending}
              >
                <SelectTrigger className="w-full bg-card rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="p-6 md:p-8 rounded-3xl border-border/40 shadow-md bg-card">
              <h3 className="text-lg font-bold font-display border-b border-border/50 pb-4 mb-6">Description</h3>
              <div className="prose max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </div>
            </Card>

            {/* Timeline / Audit trail could go here in future */}
            <div className="flex items-center text-sm text-muted-foreground pl-4 border-l-2 border-border py-2">
              <Clock className="w-4 h-4 mr-2" />
              Last updated recently
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6 rounded-3xl border-border/40 shadow-sm bg-card">
              <h3 className="text-lg font-bold font-display mb-4">Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center">
                    <UserIcon className="w-3 h-3 mr-1" /> Submitter ID
                  </label>
                  <p className="font-medium">User #{complaint.userId}</p>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center">
                    <Tag className="w-3 h-3 mr-1" /> Category
                  </label>
                  <p className="font-medium">{complaint.category}</p>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> Date Created
                  </label>
                  <p className="font-medium">
                    {complaint.createdAt ? format(new Date(complaint.createdAt), 'MMM d, yyyy p') : 'N/A'}
                  </p>
                </div>
              </div>
            </Card>

            {isStaff && complaint.predictedDepartment && (
              <AIInsight 
                department={complaint.predictedDepartment} 
                confidenceScore={complaint.confidenceScore} 
              />
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
