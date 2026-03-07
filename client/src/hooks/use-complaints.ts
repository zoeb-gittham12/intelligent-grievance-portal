import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type Complaint, type InsertComplaint } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useComplaints(filters?: { status?: string; department?: string }) {
  return useQuery<Complaint[]>({
    queryKey: [api.complaints.list.path, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.department) params.append("department", filters.department);
      
      const url = `${api.complaints.list.path}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      return api.complaints.list.responses[200].parse(data);
    },
  });
}

export function useComplaint(id: number) {
  return useQuery<Complaint | null>({
    queryKey: [api.complaints.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.complaints.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch complaint");
      const data = await res.json();
      return api.complaints.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertComplaint) => {
      const validated = api.complaints.create.input.parse(data);
      const res = await fetch(api.complaints.create.path, {
        method: api.complaints.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) throw new Error("Validation failed");
        throw new Error("Failed to create complaint");
      }
      return api.complaints.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.complaints.list.path] });
      toast({
        title: "Complaint Submitted",
        description: "Your grievance has been successfully recorded and routed for review.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const validated = api.complaints.updateStatus.input.parse({ status });
      const url = buildUrl(api.complaints.updateStatus.path, { id });
      
      const res = await fetch(url, {
        method: api.complaints.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 404) throw new Error("Complaint not found");
        throw new Error("Failed to update status");
      }
      return api.complaints.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: (updatedComplaint) => {
      queryClient.invalidateQueries({ queryKey: [api.complaints.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.complaints.get.path, updatedComplaint.id] });
      toast({
        title: "Status Updated",
        description: `Grievance is now marked as ${updatedComplaint.status}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
