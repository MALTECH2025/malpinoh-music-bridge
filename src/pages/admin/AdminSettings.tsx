import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import MinWithdrawalForm from "@/components/admin/MinWithdrawalForm";

const platformSettingsSchema = z.object({
  platformName: z.string().min(2, {
    message: "Platform name must be at least 2 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  releaseApprovalAutomatic: z.boolean().default(false),
  minWithdrawalAmount: z.coerce.number().min(1, {
    message: "Minimum withdrawal amount must be at least 1.",
  }),
  termsAndConditions: z.string().min(10, {
    message: "Terms and conditions must be at least 10 characters.",
  }),
});

type PlatformSettingsValues = z.infer<typeof platformSettingsSchema>;

const AdminSettings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PlatformSettingsValues>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      platformName: "MalpinohDistro",
      contactEmail: "admin@malpinoh.com",
      releaseApprovalAutomatic: false,
      minWithdrawalAmount: 10,
      termsAndConditions: "These are the terms and conditions for MalpinohDistro. All artists must agree to these terms before uploading music.",
    },
  });

  const onSubmit = async (data: PlatformSettingsValues) => {
    setIsSubmitting(true);
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Settings updated:", data);
    toast.success("Platform settings updated successfully");
    setIsSubmitting(false);
  };

  return (
    <MainLayout requireAuth adminOnly>
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="emails">Email Templates</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>
                      Configure your distribution platform settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="platformName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormDescription>
                            Support emails will be sent to this address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="termsAndConditions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terms and Conditions</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={5} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <><LoadingSpinner size={16} className="mr-2" /> Saving...</> : "Save settings"}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Configure email templates sent to users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {['Welcome', 'Submission Received', 'Release Approved', 'Release Rejected', 'Earnings Update', 'Withdrawal Requested'].map((template) => (
                    <div key={template} className="flex items-center justify-between border p-3 rounded-md">
                      <div>
                        <p className="font-medium">{template}</p>
                        <p className="text-sm text-muted-foreground">Template for {template.toLowerCase()} emails</p>
                      </div>
                      <Button variant="outline">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments">
            <div className="space-y-6">
              <MinWithdrawalForm />
              
              <Form {...form}>
                <Card>
                  <CardHeader>
                    <CardTitle>Other Payment Settings</CardTitle>
                    <CardDescription>
                      Configure additional payment and withdrawal settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">                    
                    <FormField
                      control={form.control}
                      name="releaseApprovalAutomatic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Automatic Release Approval
                            </FormLabel>
                            <FormDescription>
                              Automatically approve all releases (not recommended)
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                      {isSubmitting ? <><LoadingSpinner size={16} className="mr-2" /> Saving...</> : "Save payment settings"}
                    </Button>
                  </CardContent>
                </Card>
              </Form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminSettings;
