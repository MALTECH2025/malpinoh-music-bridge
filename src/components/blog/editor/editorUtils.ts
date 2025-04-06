
export interface MediaItem {
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
}

export interface EditorBlock {
  type: string;
  content?: string;
  mediaIndex?: number;
}

/**
 * Converts text with media placeholders to HTML
 * @param text - The text content with media placeholders
 * @param mediaItems - Array of media items to embed
 * @returns HTML string with embedded media
 */
export const convertToHtml = (text: string, mediaItems: MediaItem[]) => {
  if (!text) return '';
  
  // Basic markdown to HTML conversion
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/\n/g, '<br>');
  
  // Add media items
  if (mediaItems && mediaItems.length > 0) {
    mediaItems.forEach((media, index) => {
      const mediaPlaceholder = `{{media-${index}}}`;
      let mediaHtml = '';
      
      try {
        if (media.type === 'image') {
          mediaHtml = `<figure class="my-4">
            <img src="${media.url}" alt="${media.caption || ''}" class="max-w-full rounded-lg" onerror="this.src='/placeholder.svg'; this.alt='Failed to load image';" />
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
      } catch (error) {
        console.error('Error creating media HTML:', error);
        mediaHtml = '<div class="p-4 bg-red-100 text-red-800 rounded">Media could not be displayed</div>';
      }
      
      html = html.replace(mediaPlaceholder, mediaHtml);
    });
  }
  
  return html;
};

/**
 * Parses content text into structured editor blocks
 * @param text - The text content to parse
 * @returns Array of editor blocks
 */
export const parseContentBlocks = (text: string): EditorBlock[] => {
  if (!text) return [];
  
  try {
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
        // Extract media index from pattern {{media-X}}
        const match = line.match(/{{media-(\d+)}}/);
        const mediaIndex = match ? parseInt(match[1]) : 0;
        return { type: 'media', mediaIndex };
      } else {
        return { type: 'paragraph', content: line };
      }
    });
  } catch (error) {
    console.error('Error parsing content blocks:', error);
    return [{ type: 'paragraph', content: text || '' }];
  }
};

/**
 * Safely checks if a URL is valid
 * @param url - URL to validate
 * @returns Boolean indicating if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
