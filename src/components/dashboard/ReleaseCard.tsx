
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { Release } from "@/types";
import { Music } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard = ({ release }: ReleaseCardProps) => {
  const releaseDate = new Date(release.createdAt);
  const formattedDate = formatDistanceToNow(releaseDate, { addSuffix: true });
  
  const displayedPlatforms = release.platforms?.slice(0, 3) || [];
  const remainingPlatforms = (release.platforms?.length || 0) - displayedPlatforms.length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          {release.coverArt ? (
            <img 
              src={release.coverArt} 
              alt={release.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="h-16 w-16 text-muted-foreground opacity-25" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <StatusBadge status={release.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4">
        <div className="mb-auto">
          <h3 className="font-semibold text-lg truncate">{release.title}</h3>
          <p className="text-muted-foreground text-sm mb-2">Uploaded {formattedDate}</p>
          
          {/* Show UPC and ISRC when approved */}
          {release.upc && (
            <p className="text-xs text-muted-foreground mt-1">UPC: {release.upc}</p>
          )}
          {release.isrc && (
            <p className="text-xs text-muted-foreground mt-1">ISRC: {release.isrc}</p>
          )}
          
          {/* Show rejection reason when rejected */}
          {release.rejectionReason && release.status === 'Rejected' && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-xs font-semibold text-red-700">Rejection reason:</p>
              <p className="text-xs text-red-600">{release.rejectionReason}</p>
            </div>
          )}
        </div>
        
        {displayedPlatforms.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Platforms:</p>
            <div className="flex flex-wrap gap-1">
              {displayedPlatforms.map((platform, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-muted text-xs rounded-full"
                >
                  {platform}
                </span>
              ))}
              {remainingPlatforms > 0 && (
                <span className="px-2 py-1 bg-muted text-xs rounded-full">
                  +{remainingPlatforms} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReleaseCard;
