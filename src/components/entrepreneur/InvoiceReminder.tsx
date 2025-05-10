
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, AlertCircle } from 'lucide-react';

export function InvoiceReminder() {
  return (
    <Card className="border-dashed border-muted-foreground/20">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
          <CalendarClock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="font-medium mb-1">Invoice Reminders</h3>
          <p className="text-sm text-muted-foreground">Set up automatic invoice reminders for your clients</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4">
        <Button variant="outline" className="w-full" disabled>
          <AlertCircle className="mr-2 h-4 w-4" />
          Coming Soon
        </Button>
      </CardFooter>
    </Card>
  );
}
