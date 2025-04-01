
// Since I don't have the original file, I'm implementing a fix for the error related to
// WithdrawalFormValues by ensuring all fields are properly handled.

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawalFormValues } from "@/types";

const formSchema = z.object({
  amount: z.coerce.number()
    .positive("Amount must be greater than 0")
    .refine((val) => val <= 10000, "Amount cannot exceed $10,000"),
  accountName: z.string().min(2, "Account name must be at least 2 characters."),
  accountNumber: z.string().min(5, "Account number must be at least 5 characters.")
});

interface WithdrawalFormProps {
  availableBalance: number;
  onSuccess?: () => void;
}

const WithdrawalForm = ({ availableBalance, onSuccess }: WithdrawalFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      accountName: "",
      accountNumber: ""
    },
  });

  const onSubmit = async (values: WithdrawalFormValues) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      
      if (values.amount > availableBalance) {
        toast.error("Withdrawal amount exceeds available balance");
        return;
      }
      
      setIsSubmitting(true);
      
      // Get artist ID from the user ID
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('id')
        .eq('id', user.id)
        .single();
        
      if (artistError) throw artistError;
      
      // Insert withdrawal record
      const { error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          artist_id: artistData.id,
          amount: values.amount,
          account_name: values.accountName,
          account_number: values.accountNumber,
          status: 'PENDING'
        });
        
      if (withdrawalError) throw withdrawalError;
      
      // Update available balance
      const { error: balanceError } = await supabase
        .from('artists')
        .update({
          available_balance: supabase.rpc('increment', { 
            x: -values.amount, 
            row_id: user.id, 
            table_name: 'artists', 
            column_name: 'available_balance' 
          })
        })
        .eq('id', user.id);
        
      if (balanceError) throw balanceError;
      
      toast.success("Withdrawal request submitted successfully");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      toast.error("Failed to submit withdrawal request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Withdrawal</CardTitle>
        <CardDescription>
          Available balance: ${availableBalance.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        {...field} 
                        type="number"
                        step="0.01"
                        min="0"
                        max={availableBalance} 
                        className="pl-10" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account holder name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account number" />
                  </FormControl>
                  <FormDescription>
                    Enter your bank account number for the withdrawal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || availableBalance <= 0}
            >
              {isSubmitting ? "Processing..." : "Request Withdrawal"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default WithdrawalForm;
