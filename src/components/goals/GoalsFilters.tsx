
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { SortBy, SortDirection, FilterBy } from '@/contexts/goals/types';

interface GoalsFiltersProps {
  sortBy: SortBy;
  setSortBy: (option: SortBy) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  filterBy: FilterBy;
  setFilterBy: (filter: FilterBy) => void;
}

const GoalsFilters: React.FC<GoalsFiltersProps> = ({
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  filterBy,
  setFilterBy
}) => {
  const { t } = useLanguage();
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Map sort values from the component to context values
  const handleSortChange = (value: string) => {
    let sortByValue: SortBy;
    switch (value) {
      case 'progress':
        sortByValue = 'progress';
        break;
      case 'amount':
        sortByValue = 'target_amount';
        break;
      case 'date':
        sortByValue = 'target_date';
        break;
      case 'title':
        sortByValue = 'title';
        break;
      default:
        sortByValue = 'target_date';
    }
    setSortBy(sortByValue);
  };

  // Map filter values from the component to context values
  const handleFilterChange = (value: string) => {
    let filterByValue: FilterBy;
    switch (value) {
      case 'all':
        filterByValue = 'all';
        break;
      case 'collaborative':
        filterByValue = 'collaborative';
        break;
      case 'personal':
        filterByValue = 'personal';
        break;
      case 'completed':
      case 'incomplete':
      case 'noDate':
        filterByValue = 'all'; // Default fallback for old values
        break;
      default:
        filterByValue = 'all';
    }
    setFilterBy(filterByValue);
  };

  // Map context values back to component display values
  const getSortDisplayValue = () => {
    switch (sortBy) {
      case 'progress':
        return 'progress';
      case 'target_amount':
        return 'amount';
      case 'target_date':
        return 'date';
      case 'title':
        return 'title';
      default:
        return 'date';
    }
  };

  const getFilterDisplayValue = () => {
    switch (filterBy) {
      case 'collaborative':
        return 'collaborative';
      case 'personal':
        return 'personal';
      default:
        return 'all';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full mb-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select value={getFilterDisplayValue()} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Goals</SelectItem>
            <SelectItem value="collaborative">Collaborative</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
        <Select value={getSortDisplayValue()} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="progress">Progress</SelectItem>
            <SelectItem value="amount">Target Amount</SelectItem>
            <SelectItem value="date">Target Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleSortDirection}
          title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortDirection === 'asc' ? 
            <ArrowUpNarrowWide className="h-4 w-4" /> : 
            <ArrowDownNarrowWide className="h-4 w-4" />
          }
        </Button>
      </div>
    </div>
  );
};

export default GoalsFilters;
