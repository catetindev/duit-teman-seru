
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Filter } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export type SortOption = 'progress' | 'amount' | 'date' | 'title';
export type SortDirection = 'asc' | 'desc';
export type FilterOption = 'all' | 'completed' | 'incomplete' | 'noDate';

interface GoalsFiltersProps {
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  filterBy: FilterOption;
  setFilterBy: (filter: FilterOption) => void;
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

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full mb-4">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Goals</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="noDate">No End Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
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
