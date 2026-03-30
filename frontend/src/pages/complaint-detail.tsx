import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useComplaint } from "@/hooks/use-complaints";
import { Layout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { AIInsight } from "@/components/ai-insight";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Loader2, Tag, User as UserIcon, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ComplaintDetail() {
  const params = useParams<{ id: string }>();
  const complaintId = params?.id ? parseInt(params.id) : 0;

  const { user } = useAuth();
  const { data: complaint, isLoading } = useComplaint(complaintId);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!complaint) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Grievance not found</h2>
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isStaff = user?.role !== "Student";

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        {/* Back Button */}
        <Link to="/">
          <Button
            variant="ghost"
            className="mb-6 -ml-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={complaint.status} />

              <PriorityBadge
                priority={complaint.priority || "Medium"}
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
              Complaint #{complaint.id}
            </h1>

            <p className="text-muted-foreground text-sm mt-3 flex items-center">
              <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded-md mr-3">
                ID: #{complaint.id.toString().padStart(5, "0")}
              </span>

              Submitted on{" "}
              {complaint.created_at
                ? format(
                  new Date(complaint.created_at),
                  "MMMM do, yyyy"
                )
                : "Unknown date"}
            </p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Description */}
          <div className="md:col-span-2 space-y-8">
            <Card className="p-6 md:p-8 rounded-3xl border-border/40 shadow-md bg-card">
              <h3 className="text-lg font-bold font-display border-b border-border/50 pb-4 mb-6">
                Description
              </h3>

              <div className="prose max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </div>
            </Card>

            {/* Timeline placeholder */}
            <div className="flex items-center text-sm text-muted-foreground pl-4 border-l-2 border-border py-2">
              <Clock className="w-4 h-4 mr-2" />
              Last updated recently
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 rounded-3xl border-border/40 shadow-sm bg-card">
              <h3 className="text-lg font-bold font-display mb-4">
                Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center">
                    <UserIcon className="w-3 h-3 mr-1" />
                    Submitter ID
                  </label>

                  <p className="font-medium">
                    User #{complaint.id}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    Department
                  </label>

                  <p className="font-medium">
                    {complaint.department}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Date Created
                  </label>

                  <p className="font-medium">
                    {complaint.created_at
                      ? format(
                        new Date(complaint.created_at),
                        "MMM d, yyyy p"
                      )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </Card>

            {/* AI Insight panel */}
            {isStaff && complaint.department && (
              <AIInsight
                department={complaint.department}
                confidenceScore={
                  complaint.ai_confidence || 0
                }
              />
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}