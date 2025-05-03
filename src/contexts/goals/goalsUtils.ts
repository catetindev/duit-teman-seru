
import { Goal } from '@/hooks/goals/types';
import { FilterOption, SortDirection, SortOption } from './types';

export const filterGoals = (goals: Goal[], filterBy: FilterOption, calculateProgress: (saved: number, target: number) => number): Goal[] => {
  switch(filterBy) {
    case 'completed':
      return goals.filter(goal => calculateProgress(goal.saved_amount, goal.target_amount) >= 100);
    case 'incomplete':
      return goals.filter(goal => calculateProgress(goal.saved_amount, goal.target_amount) < 100);
    case 'noDate':
      return goals.filter(goal => !goal.target_date);
    default: // 'all'
      return goals;
  }
};

export const sortGoals = (
  goals: Goal[], 
  sortBy: SortOption, 
  sortDirection: SortDirection, 
  calculateProgress: (saved: number, target: number) => number
): Goal[] => {
  return [...goals].sort((a, b) => {
    let comparison = 0;
    
    switch(sortBy) {
      case 'progress':
        const progressA = calculateProgress(a.saved_amount, a.target_amount);
        const progressB = calculateProgress(b.saved_amount, b.target_amount);
        comparison = progressA - progressB;
        break;
      case 'amount':
        comparison = a.target_amount - b.target_amount;
        break;
      case 'date':
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
  filterBy: FilterOption, 
  sortBy: SortOption, 
  sortDirection: SortDirection, 
  calculateProgress: (saved: number, target: number) => number
): Goal[] => {
  const filteredGoals = filterGoals(goals, filterBy, calculateProgress);
  return sortGoals(filteredGoals, sortBy, sortDirection, calculateProgress);
};
