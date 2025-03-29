
import ReleaseReviewCard from "@/components/admin/ReleaseReviewCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { mockReleases } from "@/lib/mock-data";
import { Release, ReleaseStatus } from "@/types";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminReleases = () => {
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<Release[]>([]);

  const handleStatusChange = (id: string, newStatus: ReleaseStatus, codes?: { upc?: string; isrc?: string }) => {
    setReleases(currentReleases => 
      currentReleases.map(release => 
        release.id === id 
          ? { 
              ...release, 
              status: newStatus,
              ...(codes ? { upc: codes.upc, isrc: codes.isrc } : {}),
            } 
          : release
      )
    );
  };

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        // Simulating API request delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setReleases(mockReleases);
      } catch (error) {
        console.error("Error fetching releases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  const pendingReleases = releases.filter(r => r.status === ReleaseStatus.PENDING);
  const approvedReleases = releases.filter(r => r.status === ReleaseStatus.APPROVED);
  const rejectedReleases = releases.filter(r => r.status === ReleaseStatus.REJECTED);

  if (loading) {
    return (
      <MainLayout requireAuth adminOnly>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth adminOnly>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Manage Releases</h2>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingReleases.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedReleases.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedReleases.length})</TabsTrigger>
            <TabsTrigger value="all">All ({releases.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            {pendingReleases.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingReleases.map((release) => (
                  <ReleaseReviewCard 
                    key={release.id} 
                    release={release}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No pending releases to review.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            {approvedReleases.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {approvedReleases.map((release) => (
                  <ReleaseReviewCard 
                    key={release.id} 
                    release={release}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No approved releases.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-6">
            {rejectedReleases.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {rejectedReleases.map((release) => (
                  <ReleaseReviewCard 
                    key={release.id} 
                    release={release}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No rejected releases.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            {releases.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {releases.map((release) => (
                  <ReleaseReviewCard 
                    key={release.id} 
                    release={release}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  No releases found.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminReleases;
