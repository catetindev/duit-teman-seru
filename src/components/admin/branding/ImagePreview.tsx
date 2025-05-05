
import React from 'react';
import { ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imageUrl, 
  isLoading,
  className = ""
}) => {
  return (
    <div className={`border rounded-lg p-4 flex justify-center items-center bg-gray-50 ${className}`}>
      {isLoading ? (
        <div className="animate-pulse w-40 h-20 bg-gray-200 rounded"></div>
      ) : imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="h-full max-h-full object-contain"
        />
      ) : (
        <div className="flex flex-col items-center text-gray-400">
          <ImageIcon size={48} />
          <span>No image uploaded</span>
        </div>
      )}
    </div>
  );
};
