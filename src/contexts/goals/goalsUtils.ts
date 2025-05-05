
import { Goal } from '@/hooks/goals/types';
import { FilterBy, SortDirection, SortBy } from './types';

export const filterGoals = (goals: Goal[], filterBy: FilterBy, calculateProgress: (goal: Goal) => number): Goal[] => {
  switch(filterBy) {
    case 'collaborative':
      return goals.filter(goal => goal.has_collaborators);
    case 'personal':
      return goals.filter(goal => !goal.has_collaborators);
    default: // 'all'
      return goals;
  }
};

export const sortGoals = (
  goals: Goal[], 
  sortBy: SortBy, 
  sortDirection: SortDirection, 
  calculateProgress: (goal: Goal) => number
): Goal[] => {
  return [...goals].sort((a, b) => {
    let comparison = 0;
    
    switch(sortBy) {
      case 'progress':
        const progressA = calculateProgress(a);
        const progressB = calculateProgress(b);
        comparison = progressA - progressB;
        break;
      case 'target_amount':
        comparison = a.target_amount - b.target_amount;
        break;
      case 'target_date':
        // Handle cases where one or both goals don't have a target date
        if (!a.target_date && !b.target_date) comparison = 0;
        else if (!a.target_date) comparison = 1;  // Goals without dates go last
        else if (!b.target_date) comparison = -1; // Goals without dates go last
        else comparison = new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    // Apply sort direction
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

export const filterAndSortGoals = (
  goals: Goal[], 
  filterBy: FilterBy, 
  sortBy: SortBy, 
  sortDirection: SortDirection, 
  calculateProgress: (goal: Goal) => number
): Goal[] => {
  const filteredGoals = filterGoals(goals, filterBy, calculateProgress);
  return sortGoals(filteredGoals, sortBy, sortDirection, calculateProgress);
};
