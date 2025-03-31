
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Release } from "@/types";
import { Music, PlayCircle, StopCircle } from "lucide-react";
import { useState, useRef } from "react";
import MusicWave from "../MusicWave";
import StatusBadge from "../StatusBadge";
import { toast } from "sonner";

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard = ({ release }: ReleaseCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    <Card className="overflow-hidden">
      <div 
        className="h-32 bg-gradient-to-r from-brand-purple to-brand-blue flex items-center justify-center"
      >
        {release.coverArt ? (
          <img 
            src={release.coverArt} 
            alt={release.title} 
            className="h-full w-full object-cover"
          />
        ) : (
          <Music size={48} className="text-white" />
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{release.title}</CardTitle>
            <CardDescription>{release.artist}</CardDescription>
          </div>
          <StatusBadge status={release.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm">Genre: {release.genre}</p>
        <p className="text-sm">Release Date: {release.releaseDate}</p>
        {release.upc && <p className="text-sm">UPC: {release.upc}</p>}
        {release.isrc && <p className="text-sm">ISRC: {release.isrc}</p>}
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={togglePlay}
          disabled={!release.audioFile}
        >
          {isPlaying ? (
            <>
              <StopCircle className="h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4" />
              {release.audioFile ? "Play" : "No audio"}
            </>
          )}
        </Button>
        <Button variant="outline" size="sm">Details</Button>
      </CardFooter>
    </Card>
  );
};

export default ReleaseCard;
