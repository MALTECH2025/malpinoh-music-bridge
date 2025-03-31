
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
import { Download, Music } from "lucide-react";
import { useState } from "react";
import StatusBadge from "../StatusBadge";

interface ReleaseReviewCardProps {
  release: Release;
  onStatusChange?: (id: string, newStatus: string, codes?: { upc?: string; isrc?: string }) => void;
}

const ReleaseReviewCard = ({ release, onStatusChange }: ReleaseReviewCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [upc, setUpc] = useState("");
  const [isrc, setIsrc] = useState("");

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

  const handleDownload = () => {
    // In a real app, this would trigger a file download
    toast.info(`Downloading "${release.title}"`);
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
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" /> Download
        </Button>
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
