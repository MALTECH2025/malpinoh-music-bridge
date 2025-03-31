
import ReleaseReviewCard from "@/components/admin/ReleaseReviewCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { Release, ReleaseStatus } from "@/types";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminReleases = () => {
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<Release[]>([]);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('releases')
        .select(`
          id,
          title,
          release_date,
          status,
          cover_art_url,
          platforms,
          artists (
            name
          )
        `)
        .order('release_date', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedReleases: Release[] = data.map(item => ({
          id: item.id,
          title: item.title,
          artist: item.artists?.name || 'Unknown Artist',
          genre: 'Various', // Assuming genre is not stored in the database
          status: item.status as ReleaseStatus,
          coverArt: item.cover_art_url || null,
          createdAt: new Date(item.release_date).toISOString(),
          platforms: item.platforms || [],
        }));
        
        setReleases(formattedReleases);
      }
    } catch (error: any) {
      console.error("Error fetching releases:", error);
      toast.error("Failed to fetch releases");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ReleaseStatus, codes?: { upc?: string; isrc?: string }) => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({
          status: newStatus,
          ...(codes ? { upc: codes.upc, isrc: codes.isrc } : {})
        })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setReleases(currentReleases => 
        currentReleases.map(release => 
          release.id === id 
            ? { 
                ...release, 
                status: newStatus,
              } 
            : release
        )
      );
      
      toast.success(`Release status updated to ${newStatus}`);
    } catch (error: any) {
      console.error("Error updating release status:", error);
      toast.error("Failed to update release status");
    }
  };

  useEffect(() => {
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
