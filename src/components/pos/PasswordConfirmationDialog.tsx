import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'; // Added for consistency if needed, though AlertDialogAction is primary

interface PasswordConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<boolean>; // Returns true if password is correct and action should proceed
  title: string;
  description: string;
  actionButtonText?: string;
}

export function PasswordConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionButtonText = "Confirm"
}: PasswordConfirmationDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setError('');
    setIsConfirming(true);
    const success = await onConfirm(password);
    setIsConfirming(false);
    if (success) {
      setPassword(''); // Clear password on success
      onClose();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleDialogClose = () => {
    if (!isConfirming) {
      setPassword('');
      setError('');
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleDialogClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="password-confirm">Enter your password to continue:</Label>
          <Input
            id="password-confirm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDialogClose} disabled={isConfirming}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isConfirming || !password}>
            {isConfirming ? "Confirming..." : actionButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}