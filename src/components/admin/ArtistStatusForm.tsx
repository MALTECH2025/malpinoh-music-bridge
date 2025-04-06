
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, PauseCircle } from "lucide-react";

const formSchema = z.object({
  status: z.enum(["active", "paused", "banned"]),
  reason: z.string().optional(),
});

interface ArtistStatusFormProps {
  artistId: string;
  artistName: string;
  currentStatus: string;
  currentReason?: string;
  onSuccess?: () => void;
}

const ArtistStatusForm = ({ 
  artistId, 
  artistName, 
  currentStatus = "active",
  currentReason = "",
  onSuccess 
}: ArtistStatusFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: (currentStatus as "active" | "paused" | "banned") || "active",
      reason: currentReason || "",
    },
  });

  // Update form values when props change
  useEffect(() => {
    const validStatus = ["active", "paused", "banned"].includes(currentStatus) 
      ? currentStatus as "active" | "paused" | "banned"
      : "active";
      
    form.setValue("status", validStatus);
    form.setValue("reason", currentReason || "");
  }, [currentStatus, currentReason, form]);

  // Watch the status to show/hide reason field
  const watchStatus = form.watch("status");
  const needsReason = watchStatus === "banned" || watchStatus === "paused";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Updating artist status:", artistId, "New status:", values.status);

      const updateData: Record<string, any> = {
        status: values.status,
      };

      // Only update ban_reason when needed
      if (needsReason) {
        updateData.ban_reason = values.reason || null;
      } else {
        // Clear reason if status is active
        updateData.ban_reason = null;
      }

      console.log("Update data:", updateData);

      const { error } = await supabase
        .from('artists')
        .update(updateData)
        .eq('id', artistId);

      if (error) {
        console.error("Update artist status error:", error);
        throw error;
      }

      toast.success(`${artistName}'s status updated to ${values.status}`);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating artist status:', error);
      toast.error('Failed to update artist status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Artist Status</CardTitle>
        <CardDescription>Control {artistName}'s account status</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span>Active</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="paused">
                        <div className="flex items-center">
                          <PauseCircle className="mr-2 h-4 w-4 text-yellow-500" />
                          <span>Paused</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="banned">
                        <div className="flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                          <span>Banned</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {needsReason && (
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Reason for ${watchStatus} status`}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="brand" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ArtistStatusForm;
