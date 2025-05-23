
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ArtistEarningsForm from "@/components/admin/ArtistEarningsForm";
import ArtistStatusForm from "@/components/admin/ArtistStatusForm";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Artist {
  id: string;
  name: string;
  email: string;
  total_earnings: number;
  available_balance: number;
  wallet_balance: number;
  status: string;
  ban_reason: string | null;
}

const ManageArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [dialogContent, setDialogContent] = useState<"earnings" | "status">("earnings");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching artists:', error);
        throw error;
      }
      
      if (data) {
        console.log('Artists data:', data);
        setArtists(data as Artist[]);
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast.error('Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleAddEarnings = (artist: Artist) => {
    setSelectedArtist(artist);
    setDialogContent("earnings");
    setIsDialogOpen(true);
  };

  const handleManageStatus = (artist: Artist) => {
    setSelectedArtist(artist);
    setDialogContent("status");
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    fetchArtists();
    setIsDialogOpen(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout requireAuth adminOnly>
      <Helmet>
        <title>Manage Artists | MalpinohDistro - Music Distribution Platform</title>
        <meta name="description" content="Efficiently manage all artists on MalpinohDistro. Control earnings, statuses, and balances for your music distribution platform." />
        <meta name="keywords" content="music distribution, artist management, music platform, digital music distribution" />
        <meta property="og:title" content="Manage Artists | MalpinohDistro" />
        <meta property="og:description" content="Efficiently manage all artists on our music distribution platform. Control earnings, statuses, and balances." />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Manage Artists | MalpinohDistro" />
        <meta name="twitter:description" content="Efficiently manage all artists on our music distribution platform." />
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Manage Artists</h1>
        <p className="text-muted-foreground">
          Manage artist accounts, control earnings, and update account statuses for all music creators on the platform.
        </p>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size={40} />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Earnings</TableHead>
                  <TableHead className="text-right">Available Balance</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artists.length > 0 ? (
                  artists.map((artist) => (
                    <TableRow key={artist.id}>
                      <TableCell className="font-medium">{artist.name || 'Unnamed'}</TableCell>
                      <TableCell>{artist.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(artist.status || 'active')}`}>
                          {(artist.status || 'active').charAt(0).toUpperCase() + (artist.status || 'active').slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${artist.total_earnings?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell className="text-right">${artist.available_balance?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAddEarnings(artist)}
                          >
                            Add Earnings
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleManageStatus(artist)}
                          >
                            Manage Status
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No artists found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogContent === 'earnings' ? 'Add Earnings' : 'Manage Artist Status'}
            </DialogTitle>
            <DialogDescription>
              {selectedArtist?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedArtist && dialogContent === 'earnings' && (
            <ArtistEarningsForm
              artistId={selectedArtist.id}
              artistName={selectedArtist.name}
              onSuccess={handleSuccess}
            />
          )}
          
          {selectedArtist && dialogContent === 'status' && (
            <ArtistStatusForm
              artistId={selectedArtist.id}
              artistName={selectedArtist.name}
              currentStatus={selectedArtist.status || 'active'}
              currentReason={selectedArtist.ban_reason || ''}
              onSuccess={handleSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ManageArtists;
