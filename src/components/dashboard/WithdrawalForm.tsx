
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { WithdrawalFormValues } from "@/types";
import { DollarSign } from "lucide-react";

export interface WithdrawalFormProps {
  maxAmount: number;
  onSubmit: (data: WithdrawalFormValues) => Promise<void>;
}

const WithdrawalForm = ({ maxAmount, onSubmit }: WithdrawalFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .positive("Amount must be greater than 0")
      .refine((val) => val <= maxAmount, `Amount cannot exceed $${maxAmount.toFixed(2)}`),
    accountName: z.string().min(2, "Account name is required"),
    accountNumber: z.string().min(5, "Valid account number is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      accountName: "",
      accountNumber: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        amount: values.amount,
        accountName: values.accountName,
        accountNumber: values.accountNumber,
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                    max={maxAmount}
                    placeholder="0.00"
                    className="pl-10"
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value) || 0);
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Maximum withdrawal: ${maxAmount.toFixed(2)}
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
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe" />
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
                <Input {...field} placeholder="1234567890" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting || maxAmount <= 0}
          className="w-full"
        >
          {isSubmitting ? "Processing..." : "Request Withdrawal"}
        </Button>
      </form>
    </Form>
  );
};

export default WithdrawalForm;
