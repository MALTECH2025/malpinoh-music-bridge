
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <Card>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-4">
                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              
              <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
              <p>
                MalpinohDistro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our music distribution services, 
                website, and applications (collectively, the "Services").
              </p>

              <h2 className="text-xl font-semibold mt-6">2. Information We Collect</h2>
              <p>
                We may collect information that identifies, relates to, describes, or is capable of being associated with you 
                ("Personal Information"), including:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Contact information (e.g., name, email address, phone number)</li>
                <li>Account information (e.g., username, password)</li>
                <li>Payment information (e.g., bank account details, payment history)</li>
                <li>Content you upload (e.g., music, artwork, metadata)</li>
                <li>Usage data (e.g., how you interact with our Services)</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6">3. How We Use Your Information</h2>
              <p>
                We may use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Providing and maintaining our Services</li>
                <li>Processing transactions and payments</li>
                <li>Distributing your music to digital streaming platforms</li>
                <li>Communicating with you about our Services</li>
                <li>Improving our Services and developing new features</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6">4. Sharing of Your Information</h2>
              <p>
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Digital streaming platforms and stores where you choose to distribute your music</li>
                <li>Service providers who help us operate our business</li>
                <li>Legal and regulatory authorities when required by law</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your information. However, no method 
                of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-xl font-semibold mt-6">6. Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your Personal Information, such as the right to:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Access your Personal Information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your Personal Information</li>
                <li>Object to or restrict certain processing activities</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6">7. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2 className="text-xl font-semibold mt-6">8. Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@malpinohdistro.com.
              </p>
            </div>
            
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button variant="outline" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/legal/terms">Terms of Service</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Privacy;
