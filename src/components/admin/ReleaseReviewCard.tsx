
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Release, ReleaseStatus } from "@/types";
import { Download, Music, PlayCircle, StopCircle, Image } from "lucide-react";
import { useState, useRef } from "react";
import StatusBadge from "../StatusBadge";

interface ReleaseReviewCardProps {
  release: Release;
  onStatusChange?: (id: string, newStatus: string, codes?: { upc?: string; isrc?: string }) => void;
}

const ReleaseReviewCard = ({ release, onStatusChange }: ReleaseReviewCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [upc, setUpc] = useState("");
  const [isrc, setIsrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleApprove = () => {
    if (!upc || !isrc) {
      toast.error("Both UPC and ISRC codes are required");
      return;
    }

    onStatusChange?.(release.id, ReleaseStatus.APPROVED, { upc, isrc });
    setIsDialogOpen(false);
    toast.success(`"${release.title}" has been approved`);
  };

  const handleReject = () => {
    onStatusChange?.(release.id, ReleaseStatus.REJECTED);
    toast.info(`"${release.title}" has been rejected`);
  };

  const handleDownloadAudio = () => {
    if (release.audioFile) {
      const link = document.createElement('a');
      link.href = release.audioFile;
      link.download = `${release.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error("No audio file available for download");
    }
  };

  const handleDownloadCover = () => {
    if (release.coverArt) {
      const link = document.createElement('a');
      link.href = release.coverArt;
      link.download = `${release.title}_cover.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error("No cover art available for download");
    }
  };

  const togglePlay = () => {
    if (!release.audioFile) {
      toast.error("No audio preview available");
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(release.audioFile);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        toast.error("Could not play audio file");
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{release.title}</CardTitle>
          <StatusBadge status={release.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center space-x-4">
          <div 
            className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden"
          >
            {release.coverArt ? (
              <img 
                src={release.coverArt} 
                alt={release.title} 
                className="h-full w-full object-cover"
              />
            ) : (
              <Music size={24} className="text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm">Artist: {release.artist}</p>
            <p className="text-sm">Genre: {release.genre}</p>
            <p className="text-sm text-muted-foreground">Submitted: {new Date(release.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={togglePlay}
          >
            {isPlaying ? (
              <><StopCircle className="h-4 w-4 mr-2" /> Stop</>
            ) : (
              <><PlayCircle className="h-4 w-4 mr-2" /> Play</>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadAudio}
            disabled={!release.audioFile}
          >
            <Download className="h-4 w-4 mr-2" /> Audio
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadCover}
            disabled={!release.coverArt}
          >
            <Image className="h-4 w-4 mr-2" /> Cover
          </Button>
        </div>
        <div className="space-x-2">
          {release.status === ReleaseStatus.PENDING && (
            <>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleReject}
              >
                Reject
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">Approve</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Release</DialogTitle>
                    <DialogDescription>
                      Enter UPC and ISRC codes for "{release.title}" by {release.artist}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="upc" className="text-right">UPC</Label>
                      <Input
                        id="upc"
                        value={upc}
                        onChange={(e) => setUpc(e.target.value)}
                        className="col-span-3"
                        placeholder="Enter 12-digit UPC"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="isrc" className="text-right">ISRC</Label>
                      <Input
                        id="isrc"
                        value={isrc}
                        onChange={(e) => setIsrc(e.target.value)}
                        className="col-span-3"
                        placeholder="Enter ISRC code"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleApprove}>Confirm Approval</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReleaseReviewCard;
