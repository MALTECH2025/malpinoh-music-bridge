
import { useState } from "react";
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
  amount: z.coerce.number()
    .positive("Amount must be greater than 0")
    .refine((val) => val <= 10000, "Amount cannot exceed $10,000"),
});

interface ArtistEarningsFormProps {
  artistId: string;
  artistName: string;
  onSuccess?: () => void;
}

const ArtistEarningsForm = ({ artistId, artistName, onSuccess }: ArtistEarningsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // 1. Add to earnings table
      const { error: earningsError } = await supabase
        .from('earnings')
        .insert({
          artist_id: artistId,
          amount: values.amount,
          status: 'Paid'
        });

      if (earningsError) throw earningsError;

      // 2. Fetch current balances
      const { data: artistData, error: getError } = await supabase
        .from('artists')
        .select('total_earnings, available_balance, wallet_balance')
        .eq('id', artistId)
        .single();
      
      if (getError) throw getError;

      // 3. Update artist balances with calculated values
      const totalEarnings = (artistData.total_earnings || 0) + values.amount;
      const availableBalance = (artistData.available_balance || 0) + values.amount;
      const walletBalance = (artistData.wallet_balance || 0) + values.amount;

      const { error: updateError } = await supabase
        .from('artists')
        .update({
          total_earnings: totalEarnings,
          available_balance: availableBalance,
          wallet_balance: walletBalance
        })
        .eq('id', artistId);

      if (updateError) throw updateError;

      toast.success(`Added $${values.amount.toFixed(2)} to ${artistName}'s earnings`);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding earnings:', error);
      toast.error('Failed to add earnings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Earnings</CardTitle>
        <CardDescription>Add earnings to {artistName}'s account</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
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
                        className="pl-10" 
                        placeholder="0.00" 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter the amount to add to the artist's earnings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Earnings"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ArtistEarningsForm;
