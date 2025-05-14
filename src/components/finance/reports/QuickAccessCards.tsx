
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, FileText, LineChart, Wallet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const QuickAccessCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Link to="/profit-loss">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <LineChart className="h-5 w-5 text-primary mb-1" />
            <CardTitle>Laporan Untung Rugi</CardTitle>
            <CardDescription>
              Detailed income and expense analysis
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="ghost" className="w-full justify-start">
              <ArrowUpRight className="mr-2 h-4 w-4" /> View Report
            </Button>
          </CardFooter>
        </Card>
      </Link>
      
      <Link to="/invoices">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <FileText className="h-5 w-5 text-primary mb-1" />
            <CardTitle>Invoice Manager</CardTitle>
            <CardDescription>
              Create and manage customer invoices
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="ghost" className="w-full justify-start">
              <ArrowUpRight className="mr-2 h-4 w-4" /> Manage Invoices
            </Button>
          </CardFooter>
        </Card>
      </Link>
      
      <Link to="/calculator">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <Wallet className="h-5 w-5 text-primary mb-1" />
            <CardTitle>HPP Calculator</CardTitle>
            <CardDescription>
              Calculate product costs and pricing
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="ghost" className="w-full justify-start">
              <ArrowUpRight className="mr-2 h-4 w-4" /> Open Calculator
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
};
