
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash, ImageIcon, Music, Upload } from 'lucide-react';

interface MediaUploaderProps {
  type: 'image' | 'audio';
  preview: string | null;
  fileName?: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const MediaUploader = ({ type, preview, fileName, onFileChange, onClear }: MediaUploaderProps) => {
  const isImage = type === 'image';
  const Icon = isImage ? ImageIcon : Music;
  const label = isImage ? 'Image' : 'Audio';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-base font-medium">Cover {label}</div>
        {(preview || fileName) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            <Trash className="h-4 w-4 mr-1" /> Remove
          </Button>
        )}
      </div>
      
      {isImage && preview ? (
        <div className="relative aspect-video rounded-md overflow-hidden">
          <img 
            src={preview} 
            alt="Cover preview" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : fileName ? (
        <div className="flex items-center p-4 border rounded-md bg-muted/50">
          <Music className="h-8 w-8 mr-2 text-muted-foreground" />
          <div className="overflow-hidden">
            <p className="font-medium truncate">{fileName}</p>
            <p className="text-sm text-muted-foreground">Audio file selected</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center border-2 border-dashed rounded-md aspect-video bg-muted">
          <div className="text-center">
            <Icon className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-2">
              <Button
                type="button"
                variant="secondary"
                asChild
              >
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {label}
                  <input
                    type="file"
                    accept={isImage ? "image/*" : "audio/*"}
                    className="hidden"
                    onChange={onFileChange}
                  />
                </label>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
