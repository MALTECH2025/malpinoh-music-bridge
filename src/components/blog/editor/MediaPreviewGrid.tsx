
import React from 'react';
import { Input } from '@/components/ui/input';
import { Video, Play } from 'lucide-react';

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
  if (mediaItems.length === 0) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {mediaItems.map((media, index) => (
        <div key={index} className="border rounded-md p-3 space-y-2">
          {media.type === 'image' && (
            <img src={media.url} alt="" className="w-full h-32 object-cover rounded" />
          )}
          {media.type === 'video' && (
            <div className="relative bg-black rounded h-32 flex items-center justify-center">
              <Video className="h-10 w-10 text-muted-foreground opacity-50" />
              <Play className="h-6 w-6 absolute text-white" />
            </div>
          )}
          {media.type === 'audio' && (
            <div className="bg-muted rounded h-32 flex items-center justify-center">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Input
            placeholder="Caption (optional)"
            value={media.caption || ''}
            onChange={(e) => onCaptionChange(index, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default MediaPreviewGrid;
