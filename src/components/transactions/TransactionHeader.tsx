
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface TransactionHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddTransaction: () => void;
  addButtonText?: string;
}

export default function TransactionHeader({
  searchQuery,
  setSearchQuery,
  onAddTransaction,
  addButtonText = "Add Transaction"
}: TransactionHeaderProps) {
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Search & Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </div>
          
          {/* Add Button */}
          <Button 
            onClick={onAddTransaction}
            className="h-10 px-6 font-medium shadow-sm hover:shadow-md transition-all duration-200"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>{addButtonText}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
