
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
        // Using the any type to bypass TypeScript checking for this custom table
        const { data, error } = await supabase
          .from('system_settings' as any)
          .select('value')
          .eq('key', 'minimum_withdrawal')
          .single();

        if (error) throw error;

        if (data) {
          const minAmount = data.value.amount || 10;
          form.setValue('minAmount', minAmount);
        }
      } catch (error) {
        console.error('Error fetching minimum withdrawal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMinWithdrawal();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('system_settings' as any)
        .update({
          value: { amount: values.minAmount },
          updated_at: new Date().toISOString()
        })
        .eq('key', 'minimum_withdrawal');

      if (error) throw error;

      toast.success(`Minimum withdrawal amount set to $${values.minAmount.toFixed(2)}`);
    } catch (error) {
      console.error('Error updating minimum withdrawal:', error);
      toast.error('Failed to update minimum withdrawal amount');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Card className="min-h-[200px] flex items-center justify-center"><p>Loading...</p></Card>;
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default MinWithdrawalForm;
