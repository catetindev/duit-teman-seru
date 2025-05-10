
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Types for client data
export interface Client {
  id: string;
  name: string;
  project: string;
  status: 'In Progress' | 'Paid' | 'Overdue';
}

export function ClientTracker() {
  // Placeholder client data - in a real app, this would be stored in the database
  const [clients, setClients] = useState<Client[]>([
    { 
      id: '1', 
      name: 'PT Maju Bersama', 
      project: 'Website Redesign', 
      status: 'In Progress' 
    },
    { 
      id: '2', 
      name: 'Toko Sejahtera', 
      project: 'Social Media Marketing', 
      status: 'Paid' 
    },
    { 
      id: '3', 
      name: 'Restoran Lezat', 
      project: 'Logo Design', 
      status: 'Overdue' 
    },
  ]);

  // Function to get badge color based on status
  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'In Progress':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200">In Progress</Badge>;
      case 'Paid':
        return <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">Paid</Badge>;
      case 'Overdue':
        return <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5" />
          Client Tracker
        </CardTitle>
        <Button size="sm" variant="outline" className="h-8">
          <PlusCircle className="mr-1 h-3 w-3" />
          Add Client
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Project/Service</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.project}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
