
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
import { Textarea } from "@/components/ui/textarea";
import { Release, ReleaseStatus } from "@/types";
import { Download, Music, PlayCircle, StopCircle, Image } from "lucide-react";
import { useState, useRef } from "react";
import StatusBadge from "../StatusBadge";

interface ReleaseReviewCardProps {
  release: Release;
  onStatusChange?: (id: string, newStatus: string, metadata?: { upc?: string; isrc?: string; rejectionReason?: string }) => void;
}

const ReleaseReviewCard = ({ release, onStatusChange }: ReleaseReviewCardProps) => {
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [upc, setUpc] = useState("");
  const [isrc, setIsrc] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const additionalAudioFiles = release.additionalAudioFiles 
    ? (typeof release.additionalAudioFiles === 'string' 
        ? JSON.parse(release.additionalAudioFiles) 
        : release.additionalAudioFiles) 
    : [];
  
  const allAudioFiles = release.audioFile 
    ? [{ url: release.audioFile, name: `${release.title}.mp3` }, ...additionalAudioFiles]
    : [...additionalAudioFiles];

  const handleApprove = () => {
    if (!upc || !isrc) {
      toast.error("Both UPC and ISRC codes are required");
      return;
    }

    onStatusChange?.(release.id, ReleaseStatus.APPROVED, { upc, isrc });
    setIsApprovalDialogOpen(false);
    toast.success(`"${release.title}" has been approved`);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    onStatusChange?.(release.id, ReleaseStatus.REJECTED, { rejectionReason });
    setIsRejectionDialogOpen(false);
    toast.info(`"${release.title}" has been rejected`);
  };

  const handleDownloadAudio = (audioUrl?: string, fileName?: string) => {
    const url = audioUrl || release.audioFile;
    const name = fileName || `${release.title}.mp3`;
    
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
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

  const togglePlay = (audioIndex: number = 0) => {
    const audioFile = allAudioFiles[audioIndex]?.url;
    
    if (!audioFile) {
      toast.error("No audio preview available");
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
    }

    if (currentAudioIndex !== audioIndex || !isPlaying) {
      audioRef.current = new Audio(audioFile);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
        toast.error("Could not play audio file");
      });
      setCurrentAudioIndex(audioIndex);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
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
        <div className="flex items-start space-x-4">
          <div 
            className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0"
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
            <p className="text-sm">Genre: {release.genre || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">Submitted: {new Date(release.createdAt).toLocaleDateString()}</p>
            {release.status === ReleaseStatus.REJECTED && release.rejectionReason && (
              <p className="text-sm text-red-600 mt-2">
                <span className="font-semibold">Rejection reason:</span> {release.rejectionReason}
              </p>
            )}
          </div>
        </div>

        {/* Display additional audio files if available */}
        {allAudioFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Audio Files:</p>
            <div className="space-y-2">
              {allAudioFiles.map((audio, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-md">
                  <span className="text-sm truncate max-w-[60%]">
                    {audio.name || `Track ${index + 1}`}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => togglePlay(index)}
                    >
                      {isPlaying && currentAudioIndex === index ? (
                        <StopCircle className="h-4 w-4" />
                      ) : (
                        <PlayCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDownloadAudio(audio.url, audio.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => togglePlay(0)}
          >
            {isPlaying && currentAudioIndex === 0 ? (
              <><StopCircle className="h-4 w-4 mr-2" /> Stop</>
            ) : (
              <><PlayCircle className="h-4 w-4 mr-2" /> Play</>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDownloadAudio()}
            disabled={!release.audioFile && allAudioFiles.length === 0}
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
              <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Release</DialogTitle>
                    <DialogDescription>
                      Provide a reason for rejecting "{release.title}" by {release.artist}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="rejectionReason">Rejection Reason</Label>
                      <Textarea
                        id="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explain why this release is being rejected..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleReject}>Reject Release</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
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
                    <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>Cancel</Button>
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
