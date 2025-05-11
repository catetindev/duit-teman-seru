
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PaymentProofUploaderProps {
  previewUrl: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function PaymentProofUploader({ previewUrl, onFileChange, onRemove }: PaymentProofUploaderProps) {
  return (
    <div>
      <Label htmlFor="payment_proof">Payment Proof (Optional)</Label>
      <div className="mt-1">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Payment Proof"
              className="h-32 object-cover rounded-md border"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>
        ) : (
          <Input
            id="payment_proof"
            name="payment_proof"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
        )}
      </div>
    </div>
  );
}
