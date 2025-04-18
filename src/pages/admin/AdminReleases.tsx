
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Release, ReleaseStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReleaseReviewCard from "@/components/admin/ReleaseReviewCard";
import LoadingSpinner from "@/components/LoadingSpinner";

const AdminReleases = () => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

  const fetchReleases = async (status?: string) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('releases')
        .select(`
          *,
          artists: artist_id (
            name
          )
        `)
        .order('release_date', { ascending: false });
      
      // Only apply status filter if it's a valid release status and not "all"
      if (status && status !== "all" && 
          (status === "Pending" || status === "Approved" || status === "Rejected")) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const formattedReleases = data.map(item => ({
          id: item.id,
          title: item.title,
          artist: item.artists?.name || 'Unknown Artist',
          status: item.status as ReleaseStatus,
          coverArt: item.cover_art_url || null,
          audioFile: item.audio_file_url || null,
          createdAt: item.release_date,
          platforms: item.platforms || [],
          userId: item.artist_id,
          genre: "Unknown",
          releaseDate: item.release_date,
          upc: item.upc || null,
          isrc: item.isrc || null,
          rejectionReason: item.rejection_reason || null,
          additionalAudioFiles: item.additional_audio_files || null,
        }));

        setReleases(formattedReleases);
      }
    } catch (error) {
      console.error('Error fetching releases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch releases. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases(activeTab);
  }, [activeTab]);

  const handleStatusChange = async (id: string, newStatus: string, metadata?: { upc?: string; isrc?: string; rejectionReason?: string }) => {
    try {
      const updateData: Record<string, any> = { status: newStatus };
      
      if (metadata?.upc) updateData.upc = metadata.upc;
      if (metadata?.isrc) updateData.isrc = metadata.isrc;
      if (metadata?.rejectionReason) updateData.rejection_reason = metadata.rejectionReason;
      
      const { error } = await supabase
        .from('releases')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Refresh the releases
      fetchReleases(activeTab);

      toast({
        title: "Success",
        description: `Release has been marked as ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating release status:', error);
      toast({
        title: "Error",
        description: "Failed to update release status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout requireAuth adminOnly>
      <h1 className="text-3xl font-bold mb-6">Manage Releases</h1>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Approved">Approved</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="flex justify-center p-8">
              <LoadingSpinner size={40} />
            </div>
          ) : releases.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {releases.map((release) => (
                <ReleaseReviewCard 
                  key={release.id} 
                  release={release} 
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center p-8">
              No releases found in this category.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default AdminReleases;
