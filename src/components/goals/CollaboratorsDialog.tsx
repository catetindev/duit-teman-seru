
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency: 'IDR' | 'USD';
  target_date?: string;
  emoji?: string;
}

interface Collaborator {
  user_id: string;
  email: string;
  full_name: string;
}

interface CollaboratorsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGoal: Goal | null;
  collaborators: Collaborator[];
  onInviteCollaborator: (email: string) => Promise<void>;
  onRemoveCollaborator: (userId: string) => Promise<void>;
  isSubmitting: boolean;
}

const CollaboratorsDialog: React.FC<CollaboratorsDialogProps> = ({
  isOpen,
  onClose,
  selectedGoal,
  collaborators,
  onInviteCollaborator,
  onRemoveCollaborator,
  isSubmitting
}) => {
  const [inviteEmail, setInviteEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onInviteCollaborator(inviteEmail);
    setInviteEmail('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Goal Collaborators</DialogTitle>
          <DialogDescription>
            Invite others to collaborate on this goal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input 
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              type="email"
              required
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || !inviteEmail.trim()}
            >
              Invite
            </Button>
          </form>
          
          <div className="space-y-2">
            <Label>Current Collaborators</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {collaborators.length === 0 ? (
                <p className="text-sm text-muted-foreground">No collaborators yet</p>
              ) : (
                collaborators.map((collaborator) => (
                  <div key={collaborator.user_id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div>
                      <p className="font-medium">{collaborator.full_name}</p>
                      <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                    </div>
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => onRemoveCollaborator(collaborator.user_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaboratorsDialog;
