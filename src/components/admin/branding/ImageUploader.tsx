
import React from 'react';
import { Upload } from 'lucide-react';
import { ImagePreview } from './ImagePreview';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ImageUploaderProps {
  title: string;
  description: string;
  imageUrl: string | null;
  isLoading: boolean;
  selectedFile: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileTypes: string;
  inputId: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  description,
  imageUrl,
  isLoading,
  selectedFile,
  onChange,
  fileTypes,
  inputId,
  className = ""
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ImagePreview 
          imageUrl={imageUrl} 
          isLoading={isLoading}
          className={className}
        />
        
        <div className="space-y-2">
          <Label htmlFor={inputId}>Upload New {title}</Label>
          <div className="flex items-center space-x-2">
            <input
              id={inputId}
              type="file"
              accept={fileTypes}
              onChange={onChange}
              className="hidden"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById(inputId)?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" /> Choose File
            </Button>
            {selectedFile && (
              <span className="text-sm text-gray-600 truncate max-w-[150px]">
                {selectedFile.name}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Import Card components here for the component to work
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
