
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  Image as ImageIcon,
  Video,
  Upload,
  Play
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange: (content: string, richContent: any) => void;
}

interface MediaItem {
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
}

const RichTextEditor = ({ initialContent = '', onContentChange }: RichTextEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [richContent, setRichContent] = useState<any>({
    blocks: [],
    mediaItems: []
  });
  const [selectedTab, setSelectedTab] = useState('write');
  const [mediaUploads, setMediaUploads] = useState<MediaItem[]>([]);
  const [previewHtml, setPreviewHtml] = useState('');
  const [activeFormat, setActiveFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left'
  });

  // Handle text formatting
  const applyFormat = (format: string) => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = content;
    let newCursorPos = end;
    
    switch (format) {
      case 'bold':
        newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'underline':
        newText = content.substring(0, start) + `<u>${selectedText}</u>` + content.substring(end);
        newCursorPos = end + 7;
        break;
      case 'h1':
        newText = content.substring(0, start) + `# ${selectedText}` + content.substring(end);
        newCursorPos = end + 2;
        break;
      case 'h2':
        newText = content.substring(0, start) + `## ${selectedText}` + content.substring(end);
        newCursorPos = end + 3;
        break;
      case 'h3':
        newText = content.substring(0, start) + `### ${selectedText}` + content.substring(end);
        newCursorPos = end + 4;
        break;
      case 'align-left':
        newText = content.substring(0, start) + `<div style="text-align: left">${selectedText}</div>` + content.substring(end);
        newCursorPos = end + 33;
        setActiveFormat({ ...activeFormat, align: 'left' });
        break;
      case 'align-center':
        newText = content.substring(0, start) + `<div style="text-align: center">${selectedText}</div>` + content.substring(end);
        newCursorPos = end + 35;
        setActiveFormat({ ...activeFormat, align: 'center' });
        break;
      case 'align-right':
        newText = content.substring(0, start) + `<div style="text-align: right">${selectedText}</div>` + content.substring(end);
        newCursorPos = end + 34;
        setActiveFormat({ ...activeFormat, align: 'right' });
        break;
      case 'align-justify':
        newText = content.substring(0, start) + `<div style="text-align: justify">${selectedText}</div>` + content.substring(end);
        newCursorPos = end + 37;
        setActiveFormat({ ...activeFormat, align: 'justify' });
        break;
    }
    
    setContent(newText);
    handleContentChange(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Convert markdown to HTML for preview
  const convertToHtml = (text: string) => {
    // Basic markdown to HTML conversion
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/\n/g, '<br>');
    
    // Add media items
    mediaUploads.forEach((media, index) => {
      const mediaPlaceholder = `{{media-${index}}}`;
      let mediaHtml = '';
      
      if (media.type === 'image') {
        mediaHtml = `<figure class="my-4">
          <img src="${media.url}" alt="${media.caption || ''}" class="max-w-full rounded-lg" />
          ${media.caption ? `<figcaption class="text-sm text-center mt-2">${media.caption}</figcaption>` : ''}
        </figure>`;
      } else if (media.type === 'video') {
        mediaHtml = `<figure class="my-4">
          <video controls class="max-w-full rounded-lg">
            <source src="${media.url}" type="video/mp4">
            Your browser does not support video playback.
          </video>
          ${media.caption ? `<figcaption class="text-sm text-center mt-2">${media.caption}</figcaption>` : ''}
        </figure>`;
      } else if (media.type === 'audio') {
        mediaHtml = `<figure class="my-4">
          <audio controls class="w-full">
            <source src="${media.url}" type="audio/mpeg">
            Your browser does not support audio playback.
          </audio>
          ${media.caption ? `<figcaption class="text-sm text-center mt-2">${media.caption}</figcaption>` : ''}
        </figure>`;
      }
      
      html = html.replace(mediaPlaceholder, mediaHtml);
    });
    
    return html;
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setPreviewHtml(convertToHtml(newContent));
    
    // Update rich content object
    const updatedRichContent = {
      blocks: parseContentBlocks(newContent),
      mediaItems: mediaUploads
    };
    
    setRichContent(updatedRichContent);
    onContentChange(newContent, updatedRichContent);
  };

  const parseContentBlocks = (text: string) => {
    // Here we would have more sophisticated parsing
    // This is a simple implementation
    const lines = text.split('\n');
    return lines.map(line => {
      if (line.startsWith('# ')) {
        return { type: 'h1', content: line.substring(2) };
      } else if (line.startsWith('## ')) {
        return { type: 'h2', content: line.substring(3) };
      } else if (line.startsWith('### ')) {
        return { type: 'h3', content: line.substring(4) };
      } else if (line.includes('{{media-')) {
        const mediaIndex = parseInt(line.match(/{{media-(\d+)}}/)?.[1] || '0');
        return { type: 'media', mediaIndex };
      } else {
        return { type: 'paragraph', content: line };
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, we would upload the file to storage
    // Here we'll create an object URL for demo purposes
    const file = files[0];
    const url = URL.createObjectURL(file);
    
    const newMedia: MediaItem = {
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'audio',
      url,
      caption: ''
    };
    
    setMediaUploads([...mediaUploads, newMedia]);
    
    // Insert a placeholder in the content
    const mediaIndex = mediaUploads.length;
    const placeholder = `{{media-${mediaIndex}}}`;
    
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const newContent = content.substring(0, cursorPos) + 
                          `\n${placeholder}\n` + 
                          content.substring(cursorPos);
      
      handleContentChange(newContent);
    }
  };

  const handleMediaCaptionChange = (index: number, caption: string) => {
    const updatedMedia = [...mediaUploads];
    updatedMedia[index] = { ...updatedMedia[index], caption };
    setMediaUploads(updatedMedia);
    
    // Update rich content
    const updatedRichContent = {
      ...richContent,
      mediaItems: updatedMedia
    };
    
    setRichContent(updatedRichContent);
    onContentChange(content, updatedRichContent);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    if (value === 'preview') {
      setPreviewHtml(convertToHtml(content));
    }
  };

  return (
    <div className="space-y-4">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b pb-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('bold')}
          className={activeFormat.bold ? "bg-accent" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('italic')}
          className={activeFormat.italic ? "bg-accent" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('underline')}
          className={activeFormat.underline ? "bg-accent" : ""}
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('h1')}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('h2')}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('h3')}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('align-left')}
          className={activeFormat.align === 'left' ? "bg-accent" : ""}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('align-center')}
          className={activeFormat.align === 'center' ? "bg-accent" : ""}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('align-right')}
          className={activeFormat.align === 'right' ? "bg-accent" : ""}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={() => applyFormat('align-justify')}
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
              onChange={handleImageUpload}
            />
          </label>
        </Button>
      </div>
      
      {/* Media Previews */}
      {mediaUploads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
          {mediaUploads.map((media, index) => (
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
                onChange={(e) => handleMediaCaptionChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Editor Tabs */}
      <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="mt-0">
          <Textarea
            id="content-textarea"
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing your blog post..."
            className="min-h-[400px] font-mono"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div 
            className="min-h-[400px] border rounded-md p-4 prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RichTextEditor;
