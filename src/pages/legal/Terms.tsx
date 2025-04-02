
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <Card>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-4">
                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              
              <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
              <p>
                Welcome to MalpinohDistro ("we," "our," or "us"). By accessing or using our music distribution services, 
                website, and applications (collectively, the "Services"), you agree to be bound by these Terms of Service 
                ("Terms"). Please read these Terms carefully before using our Services.
              </p>

              <h2 className="text-xl font-semibold mt-6">2. Account Registration</h2>
              <p>
                To use our Services, you must create an account. You are responsible for maintaining the confidentiality of 
                your account credentials and for all activities that occur under your account. You agree to provide accurate 
                and complete information when creating your account and to update your information as needed.
              </p>

              <h2 className="text-xl font-semibold mt-6">3. Music Distribution Services</h2>
              <p>
                Our platform enables artists to distribute their music to various digital streaming platforms and stores. 
                By uploading content to our Services, you represent and warrant that you own or have obtained all necessary 
                rights to the content and that the distribution of your content will not violate any third-party rights.
              </p>

              <h2 className="text-xl font-semibold mt-6">4. Royalty Collection and Payments</h2>
              <p>
                We will collect royalties on your behalf from the digital platforms where your music is distributed. Royalties 
                will be calculated according to our current payment structure, which may be updated from time to time. Payments 
                will be made to you according to our payment schedule and once you've met the minimum payment threshold.
              </p>

              <h2 className="text-xl font-semibold mt-6">5. Prohibited Uses</h2>
              <p>
                You may not use our Services to upload, distribute or otherwise make available any content that:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Infringes on intellectual property rights of others</li>
                <li>Contains defamatory, obscene, or unlawful material</li>
                <li>Contains viruses or other malicious code</li>
                <li>Violates any applicable laws or regulations</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6">6. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account and access to the Services for any reason, including 
                if we believe you have violated these Terms. Upon termination, any outstanding payments owed to you will be processed 
                according to our standard payment schedule.
              </p>

              <h2 className="text-xl font-semibold mt-6">7. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. If we make material changes to these Terms, we will notify you via email 
                or through our Services. Your continued use of our Services after such modifications constitutes your acceptance 
                of the updated Terms.
              </p>
              
              <h2 className="text-xl font-semibold mt-6">8. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@malpinohdistro.com.
              </p>
            </div>
            
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/legal/privacy">Privacy Policy</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Terms;
