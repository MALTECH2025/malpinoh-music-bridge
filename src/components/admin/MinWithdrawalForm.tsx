
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";

const formSchema = z.object({
  minAmount: z.coerce.number()
    .positive("Amount must be greater than 0")
    .refine((val) => val <= 1000, "Amount cannot exceed $1,000"),
});

const MinWithdrawalForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minAmount: 10,
    },
  });

  // Fetch current minimum withdrawal amount
  useEffect(() => {
    const fetchMinWithdrawal = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching minimum withdrawal setting");

        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'minimum_withdrawal')
          .single();

        if (error) {
          console.error('Error fetching minimum withdrawal:', error);
          // If error is "No rows found", create the setting with default value
          if (error.code === 'PGRST116') {
            console.log("Setting not found, creating default");
            await supabase
              .from('system_settings')
              .insert({
                key: 'minimum_withdrawal',
                value: { amount: 10 },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
            form.setValue('minAmount', 10);
          } else {
            throw error;
          }
        } else if (data) {
          console.log("Minimum withdrawal setting found:", data);
          const minAmount = data.value?.amount || 10;
          form.setValue('minAmount', minAmount);
        }
      } catch (error) {
        console.error('Error fetching minimum withdrawal:', error);
        toast.error('Failed to load minimum withdrawal setting');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMinWithdrawal();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Updating minimum withdrawal amount to:", values.minAmount);

      const { data, error: checkError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('key', 'minimum_withdrawal')
        .single();
      
      if (checkError && checkError.code === 'PGRST116') {
        console.log("Setting not found, creating new");
        // Insert if not exists
        const { error: insertError } = await supabase
          .from('system_settings')
          .insert({
            key: 'minimum_withdrawal',
            value: { amount: values.minAmount },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }
      } else {
        console.log("Setting found, updating existing record");
        // Update if exists
        const { error: updateError } = await supabase
          .from('system_settings')
          .update({
            value: { amount: values.minAmount },
            updated_at: new Date().toISOString()
          })
          .eq('key', 'minimum_withdrawal');
        
        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }
      }

      toast.success(`Minimum withdrawal amount set to $${values.minAmount.toFixed(2)}`);
    } catch (error) {
      console.error('Error updating minimum withdrawal:', error);
      toast.error('Failed to update minimum withdrawal amount');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Card className="min-h-[200px] flex items-center justify-center"><LoadingSpinner size={24} /></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minimum Withdrawal Amount</CardTitle>
        <CardDescription>Set the minimum amount required for withdrawal requests</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="minAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Amount ($)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        className="pl-10" 
                        placeholder="0.00" 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Artists cannot request withdrawals below this amount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><LoadingSpinner size={16} className="mr-2" /> Saving...</> : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default MinWithdrawalForm;
