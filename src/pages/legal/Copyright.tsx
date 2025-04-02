
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

const Copyright = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Copyright Policy</h1>
        
        <Card>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg mb-4">
                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              
              <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
              <p>
                MalpinohDistro respects the intellectual property rights of others and expects users of our services to do 
                the same. This Copyright Policy outlines our procedures for addressing claims of copyright infringement on our 
                platform.
              </p>

              <h2 className="text-xl font-semibold mt-6">2. Content Ownership</h2>
              <p>
                By uploading content to our platform, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>You own all rights to the content, including sound recordings and compositions</li>
                <li>You have obtained all necessary licenses and permissions from all relevant rightsholders</li>
                <li>Your content does not infringe upon the intellectual property rights of any third party</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6">3. DMCA Notice & Takedown Procedure</h2>
              <p>
                If you believe that your copyrighted work has been used on our platform in a way that constitutes copyright 
                infringement, please submit a notification containing the following information:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Physical or electronic signature of the copyright owner or authorized agent</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Contact information, including address, telephone number, and email</li>
                <li>Statement that you have a good faith belief that use of the material is not authorized</li>
                <li>Statement that the information is accurate and, under penalty of perjury, that you are the copyright owner or authorized agent</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6">4. Counter-Notification</h2>
              <p>
                If you believe your content was wrongfully removed due to a mistake or misidentification, you may submit a 
                counter-notification containing:
              </p>
              <ul className="list-disc pl-6 my-4">
                <li>Your physical or electronic signature</li>
                <li>Identification of the material that has been removed</li>
                <li>Statement under penalty of perjury that you have a good faith belief that the material was removed by mistake</li>
                <li>Your contact information</li>
                <li>Statement that you consent to the jurisdiction of the federal court in your district</li>
              </ul>

              <h2 className="text-xl font-semibold mt-6">5. Repeat Infringers</h2>
              <p>
                MalpinohDistro maintains a policy to terminate accounts of users who are repeat copyright infringers. We 
                reserve the right to terminate accounts that have been subject to multiple valid copyright infringement notices.
              </p>
              
              <h2 className="text-xl font-semibold mt-6">6. Contact Information</h2>
              <p>
                Please send all DMCA notices and counter-notifications to:
              </p>
              <p className="my-2">
                <strong>Email:</strong> copyright@malpinohdistro.com
              </p>
              <p className="my-2">
                <strong>Postal Address:</strong><br />
                MalpinohDistro Copyright Agent<br />
                123 Distribution Lane<br />
                Music City, MS 12345<br />
                United States
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

export default Copyright;
