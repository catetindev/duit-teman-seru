
import { useState } from 'react';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { SortOption, SortDirection, FilterOption } from './types';

export function useGoalsState() {
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCollaborateDialogOpen, setIsCollaborateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Goal states
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalCollaborators, setGoalCollaborators] = useState<Collaborator[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  
  // Sort and filter states
  const [sortBy, setSortBy] = useState<SortOption>('progress');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  return {
    // Dialog states
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isCollaborateDialogOpen,
    setIsCollaborateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    
    // Goal states
    selectedGoal,
    setSelectedGoal,
    goalCollaborators,
    setGoalCollaborators,
    isSubmitting,
    setIsSubmitting,
    goalToDelete,
    setGoalToDelete,
    
    // Sort and filter states
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    filterBy,
    setFilterBy
  };
}
