
import React from 'react';
import { Button } from '@/components/ui/button';

interface BrandingImagePreviewProps {
  url: string | null;
  type: 'logo' | 'background';
  onRemove: () => void;
}

const BrandingImagePreview = ({ url, type, onRemove }: BrandingImagePreviewProps) => {
  if (!url) return null;
  
  return (
    <div className="relative mt-2 border rounded-lg overflow-hidden">
      <img 
        src={url} 
        alt={type === 'logo' ? "Logo preview" : "Background preview"} 
        className={type === 'logo' ? "h-16 object-contain" : "w-full h-48 object-cover"}
      />
      <Button 
        variant="destructive" 
        size="sm" 
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        Remove
      </Button>
    </div>
  );
};

export default BrandingImagePreview;
