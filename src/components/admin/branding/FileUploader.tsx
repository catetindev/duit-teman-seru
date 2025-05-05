
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BrandingImagePreview from './BrandingImagePreview';

interface FileUploaderProps {
  id: string;
  label: string;
  accept: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  currentUrl: string | null;
  filePreview: string | null;
  onRemovePreview: () => void;
  type: 'logo' | 'background';
}

const FileUploader = ({
  id,
  label,
  accept,
  onChange,
  previewUrl,
  currentUrl,
  filePreview,
  onRemovePreview,
  type
}: FileUploaderProps) => {
  return (
    <div>
      <Label htmlFor={id} className="block mb-2">
        {label}
      </Label>
      <div className="flex flex-col space-y-4">
        <Input
          id={id}
          type="file"
          accept={accept}
          onChange={onChange}
          className="w-full"
        />
        {filePreview && (
          <BrandingImagePreview 
            url={filePreview} 
            type={type} 
            onRemove={onRemovePreview} 
          />
        )}
        {!filePreview && currentUrl && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-2">Current {type === 'logo' ? 'Logo' : 'Background'}:</p>
            <img 
              src={currentUrl} 
              alt={`Current ${type === 'logo' ? 'logo' : 'background'}`} 
              className={type === 'logo' 
                ? "h-16 object-contain border rounded-lg p-2" 
                : "w-full h-48 object-cover border rounded-lg"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
