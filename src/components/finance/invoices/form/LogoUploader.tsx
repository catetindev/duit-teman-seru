
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Trash2, Image } from 'lucide-react';
import { useInvoiceCustomization } from '@/contexts/InvoiceCustomizationContext';

export function LogoUploader() {
  const { 
    logoUrl, 
    showLogo, 
    businessName,
    uploading, 
    uploadLogo, 
    removeLogo, 
    toggleShowLogo,
    setBusinessName 
  } = useInvoiceCustomization();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diizinkan');
      return;
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert('Ukuran file terlalu besar (maks. 1MB)');
      return;
    }

    // Create local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    await uploadLogo(file);
  };

  const handleRemoveLogo = async () => {
    await removeLogo();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-white">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Logo Bisnis</Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor="show-logo" className="text-sm">Tampilkan Logo</Label>
          <Switch 
            id="show-logo" 
            checked={showLogo} 
            onCheckedChange={toggleShowLogo}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24 rounded-md border">
            {logoUrl || previewUrl ? (
              <AvatarImage
                src={previewUrl || logoUrl || ''}
                alt="Logo Bisnis"
                className="object-contain"
              />
            ) : (
              <AvatarFallback className="rounded-md bg-slate-100">
                <Image className="h-8 w-8 text-slate-400" />
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        <div className="flex-grow space-y-2">
          <div className="space-y-2">
            <Label htmlFor="business-name">Nama Bisnis</Label>
            <Input 
              id="business-name" 
              placeholder="Nama bisnis Anda"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1"
              disabled={uploading}
            >
              <Upload size={16} />
              {uploading ? 'Mengunggah...' : 'Unggah Logo'}
            </Button>
            
            {(logoUrl || previewUrl) && (
              <Button 
                type="button" 
                variant="outline"
                size="sm" 
                onClick={handleRemoveLogo}
                className="flex items-center gap-1 text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
                Hapus Logo
              </Button>
            )}
            
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            Unggah gambar dengan format PNG atau JPG (maks. 1MB)
          </p>
        </div>
      </div>
    </div>
  );
}
