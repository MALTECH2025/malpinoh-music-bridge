
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { FileText, Shield, Copyright } from "lucide-react";

const Legal = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="transition-all hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Terms of Service
              </CardTitle>
              <CardDescription>Our terms and conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Learn about the terms that govern your use of our music distribution platform.
              </p>
              <Button asChild>
                <Link to="/legal/terms">Read Terms</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Policy
              </CardTitle>
              <CardDescription>How we handle your data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Understand how we collect, use, and protect your personal information.
              </p>
              <Button asChild>
                <Link to="/legal/privacy">Read Policy</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copyright className="h-5 w-5" />
                Copyright Policy
              </CardTitle>
              <CardDescription>Our stance on copyright</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Learn about our copyright protection policies and DMCA procedures.
              </p>
              <Button asChild>
                <Link to="/legal/copyright">Read Policy</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Legal;
