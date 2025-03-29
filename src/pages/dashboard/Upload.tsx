
import ReleaseForm from "@/components/dashboard/ReleaseForm";
import MainLayout from "@/components/layout/MainLayout";

const Upload = () => {
  return (
    <MainLayout requireAuth>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Upload New Release</h2>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to submit your music for distribution.
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-6">
          <ReleaseForm />
        </div>

        <div className="bg-muted/30 rounded-lg p-6">
          <h3 className="font-medium mb-2">Release Guidelines</h3>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Audio files must be high-quality MP3 (320kbps) or WAV format</li>
            <li>Cover art should be 3000x3000 pixels square JPG/PNG format</li>
            <li>Make sure you have all rights to distribute the music</li>
            <li>All featured artists must be properly credited</li>
            <li>Our team will review your submission within 2-3 business days</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upload;
