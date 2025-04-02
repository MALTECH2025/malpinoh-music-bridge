
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  return (
    <div className="max-w-md mx-auto my-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/settings">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
