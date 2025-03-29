
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "../LoadingSpinner";

const withdrawalSchema = z.object({
  amount: z.number().min(10, { message: "Minimum withdrawal is $10" }),
  accountName: z.string().min(2, { message: "Account name is required" }),
  accountNumber: z
    .string()
    .length(10, { message: "Account number must be exactly 10 digits" })
    .regex(/^\d+$/, { message: "Account number must contain only digits" }),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

interface WithdrawalFormProps {
  availableBalance: number;
  onWithdrawalSubmitted?: () => void;
}

const WithdrawalForm = ({ availableBalance, onWithdrawalSubmitted }: WithdrawalFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 10,
      accountName: user?.name || "",
      accountNumber: "",
    },
  });
  
  const maxAmount = availableBalance;

  const onSubmit = async (values: WithdrawalFormValues) => {
    try {
      if (values.amount > maxAmount) {
        form.setError("amount", {
          type: "manual",
          message: "Amount exceeds available balance",
        });
        return;
      }

      setIsSubmitting(true);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Withdrawal request:", values);
      
      toast.success("Withdrawal Request Submitted", {
        description: `Your request for $${values.amount.toFixed(2)} is being processed.`,
      });
      
      form.reset({
        amount: 10,
        accountName: user?.name || "",
        accountNumber: "",
      });
      
      if (onWithdrawalSubmitted) {
        onWithdrawalSubmitted();
      }
    } catch (error) {
      console.error("Withdrawal request error:", error);
      toast.error("Request Failed", {
        description: "There was a problem submitting your withdrawal request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={10}
                  max={maxAmount}
                  step={0.01}
                  {...field}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    field.onChange(isNaN(value) ? 0 : value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Available balance: ${maxAmount.toFixed(2)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opay Account Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Opay Account Number (10 digits)</FormLabel>
              <FormControl>
                <Input {...field} maxLength={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting || maxAmount < 10}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size={20} className="mr-2" />
              Processing...
            </>
          ) : (
            "Request Withdrawal"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default WithdrawalForm;
