
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

export const convertToHtml = (text: string, mediaItems: MediaItem[]) => {
  // Basic markdown to HTML conversion
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/\n/g, '<br>');
  
  // Add media items
  mediaItems.forEach((media, index) => {
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

export const parseContentBlocks = (text: string): EditorBlock[] => {
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
