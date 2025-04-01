
import ReleaseCard from "@/components/dashboard/ReleaseCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ReleaseStatus } from "@/types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Release } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Releases = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<Release[]>([]);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        
        if (!user) return;

        const { data, error } = await supabase
          .from('releases')
          .select(`
            *,
            artists: artist_id (
              name
            )
          `)
          .eq('artist_id', user.id)
          .order('release_date', { ascending: false });
        
        if (error) throw error;

        if (data) {
          const formattedReleases = data.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.artists?.name || 'Unknown Artist',
            status: item.status as ReleaseStatus,
            coverArt: item.cover_art_url,
            audioFile: item.audio_file_url,
            createdAt: new Date(item.release_date).toISOString(),
            userId: item.artist_id,
            genre: "Unknown",
            releaseDate: item.release_date,
            platforms: item.platforms || [],
            upc: item.upc || null,
            isrc: item.isrc || null
          }));

          setReleases(formattedReleases);
        }
      } catch (error) {
        console.error("Error fetching releases:", error);
        toast.error("Failed to load releases data");
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [user]);

  const approvedReleases = releases.filter(r => r.status === ReleaseStatus.APPROVED);
  const pendingReleases = releases.filter(r => r.status === ReleaseStatus.PENDING);
  const rejectedReleases = releases.filter(r => r.status === ReleaseStatus.REJECTED);

  if (loading) {
    return (
      <MainLayout requireAuth>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Your Releases</h2>
          <Button asChild>
            <Link to="/upload">Upload New Release</Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({releases.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedReleases.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingReleases.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedReleases.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {releases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {releases.map((release) => (
                  <ReleaseCard key={release.id} release={release} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <h4 className="font-medium mb-2">No releases yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start uploading your music to distribute it worldwide.
                </p>
                <Button asChild>
                  <Link to="/upload">Upload Your First Release</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            {approvedReleases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedReleases.map((release) => (
                  <ReleaseCard key={release.id} release={release} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No approved releases yet.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            {pendingReleases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingReleases.map((release) => (
                  <ReleaseCard key={release.id} release={release} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No pending releases.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-6">
            {rejectedReleases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rejectedReleases.map((release) => (
                  <ReleaseCard key={release.id} release={release} />
                ))}
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No rejected releases.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Releases;
