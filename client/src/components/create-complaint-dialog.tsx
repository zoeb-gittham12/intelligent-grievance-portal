import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateComplaint } from "@/hooks/use-complaints";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { insertComplaintSchema } from "@shared/routes";

export function CreateComplaintDialog() {
  const [open, setOpen] = useState(false);
  const createComplaint = useCreateComplaint();

  const form = useForm<z.infer<typeof insertComplaintSchema>>({
    resolver: zodResolver(insertComplaintSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  });

  const onSubmit = (data: z.infer<typeof insertComplaintSchema>) => {
    createComplaint.mutate(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-6 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
          <PlusCircle className="w-5 h-5 mr-2" />
          File New Grievance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
          <DialogTitle className="text-2xl font-display font-bold">Submit a Grievance</DialogTitle>
          <DialogDescription className="text-white/80 mt-2">
            Please provide details about your issue. Our AI engine will automatically route it to the correct department.
          </DialogDescription>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6 bg-card">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief summary of the issue" className="rounded-xl bg-secondary/30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl bg-secondary/30">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Academics">Academics & Grading</SelectItem>
                      <SelectItem value="Hostel">Hostel & Accommodation</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure & Facilities</SelectItem>
                      <SelectItem value="Administration">Administration & Fees</SelectItem>
                      <SelectItem value="Harassment">Harassment / Bullying</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please explain the situation in detail..." 
                      className="min-h-[120px] rounded-xl bg-secondary/30 resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Be specific. This helps our AI prioritize your request accurately.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={createComplaint.isPending} className="rounded-xl px-8">
                {createComplaint.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Grievance"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
