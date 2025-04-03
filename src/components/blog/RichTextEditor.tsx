
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormatToolbar from './editor/FormatToolbar';
import MediaPreviewGrid from './editor/MediaPreviewGrid';
import { convertToHtml, parseContentBlocks, MediaItem } from './editor/editorUtils';

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange: (content: string, richContent: any) => void;
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

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setPreviewHtml(convertToHtml(newContent, mediaUploads));
    
    // Update rich content object
    const updatedRichContent = {
      blocks: parseContentBlocks(newContent),
      mediaItems: mediaUploads
    };
    
    setRichContent(updatedRichContent);
    onContentChange(newContent, updatedRichContent);
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
      setPreviewHtml(convertToHtml(content, mediaUploads));
    }
  };

  return (
    <div className="space-y-4">
      <FormatToolbar
        activeFormat={activeFormat}
        onFormatClick={applyFormat}
        onMediaUpload={handleImageUpload}
      />
      
      <MediaPreviewGrid
        mediaItems={mediaUploads}
        onCaptionChange={handleMediaCaptionChange}
      />

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
