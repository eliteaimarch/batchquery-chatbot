export type ImageItem = {
  id: string;
  file: File;
  url: string;
  name: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  images?: { id: string; url: string; name: string }[];
  timestamp: number;
  imageId?: string;
  status?: 'loading' | 'done' | 'error';
  error?: string;
};
