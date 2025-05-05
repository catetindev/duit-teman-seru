
import { useCallback } from 'react';
import { Goal } from '@/hooks/goals/types';
import { FilterBy, SortBy, SortDirection } from '../types';

export function useGoalsFiltering() {
  // Function to filter goals
  const applyFilters = useCallback((goalsToFilter: Goal[], filterBy: FilterBy) => {
    let filtered;
    if (filterBy === 'all') {
      filtered = goalsToFilter;
    } else if (filterBy === 'collaborative') {
      filtered = goalsToFilter.filter((goal) => goal.has_collaborators);
    } else {
      filtered = goalsToFilter.filter((goal) => !goal.has_collaborators);
    }
    return filtered;
  }, []);

  // Function to sort goals
  const sortGoals = useCallback((goalsToSort: Goal[], sortBy: SortBy, sortDirection: SortDirection) => {
    return [...goalsToSort].sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'progress':
          const progressA = (a.saved_amount / a.target_amount) * 100;
          const progressB = (b.saved_amount / b.target_amount) * 100;
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
  }, []);

  return {
    applyFilters,
    sortGoals
  };
}
