
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Upload
} from 'lucide-react';

interface FormatToolbarProps {
  activeFormat: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    align: string;
  };
  onFormatClick: (format: string) => void;
  onMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormatToolbar: React.FC<FormatToolbarProps> = ({
  activeFormat,
  onFormatClick,
  onMediaUpload
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b pb-2">
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('bold')}
        className={activeFormat.bold ? "bg-accent" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('italic')}
        className={activeFormat.italic ? "bg-accent" : ""}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('underline')}
        className={activeFormat.underline ? "bg-accent" : ""}
      >
        <Underline className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('h1')}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('h2')}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('h3')}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('align-left')}
        className={activeFormat.align === 'left' ? "bg-accent" : ""}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('align-center')}
        className={activeFormat.align === 'center' ? "bg-accent" : ""}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('align-right')}
        className={activeFormat.align === 'right' ? "bg-accent" : ""}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        onClick={() => onFormatClick('align-justify')}
        className={activeFormat.align === 'justify' ? "bg-accent" : ""}
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-1" />
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        asChild
      >
        <label className="cursor-pointer">
          <ImageIcon className="h-4 w-4 mr-2" />
          Add Media
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            className="hidden"
            onChange={onMediaUpload}
          />
        </label>
      </Button>
    </div>
  );
};

export default FormatToolbar;
