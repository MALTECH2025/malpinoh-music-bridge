
import React from 'react';
import { Input } from '@/components/ui/input';
import { Video, Play, Music } from 'lucide-react';

interface MediaItem {
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
}

interface MediaPreviewGridProps {
  mediaItems: MediaItem[];
  onCaptionChange: (index: number, caption: string) => void;
}

const MediaPreviewGrid: React.FC<MediaPreviewGridProps> = ({
  mediaItems,
  onCaptionChange
}) => {
  if (!mediaItems || mediaItems.length === 0) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {mediaItems.map((media, index) => (
        <div key={index} className="border rounded-md p-3 space-y-2">
          {media.type === 'image' && (
            <div className="relative h-32 bg-muted rounded overflow-hidden">
              <img 
                src={media.url} 
                alt={media.caption || ""} 
                className="w-full h-32 object-cover rounded" 
                onError={(e) => {
                  // Handle image load errors
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                  target.alt = 'Failed to load image';
                }}
              />
            </div>
          )}
          {media.type === 'video' && (
            <div className="relative bg-black rounded h-32 flex items-center justify-center">
              <Video className="h-10 w-10 text-muted-foreground opacity-50" />
              <Play className="h-6 w-6 absolute text-white" />
            </div>
          )}
          {media.type === 'audio' && (
            <div className="bg-muted rounded h-32 flex items-center justify-center">
              <Music className="h-8 w-8 text-muted-foreground" />
              <Play className="h-6 w-6 absolute text-primary" />
            </div>
          )}
          <Input
            placeholder="Caption (optional)"
            value={media.caption || ''}
            onChange={(e) => onCaptionChange(index, e.target.value)}
            className="mt-2"
          />
        </div>
      ))}
    </div>
  );
};

export default MediaPreviewGrid;
