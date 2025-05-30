
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Search & Add</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            onClick={onAddTransaction}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="text-sm">{addButtonText}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
