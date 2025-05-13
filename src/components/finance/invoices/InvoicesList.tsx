import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/types/finance';
import { formatCurrency } from '@/utils/formatUtils';
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
  XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card'; // Import Card components
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook
import { cn } from '@/lib/utils'; // Import cn utility

interface InvoicesListProps {
  invoices: Invoice[];
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onDownloadPdf: (invoice: Invoice) => void;
}

export function InvoicesList({
  invoices,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onDownloadPdf,
}: InvoicesListProps) {
  const isMobile = useIsMobile(); // Use the hook

  // Function to render status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'Overdue':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Unpaid
          </Badge>
        );
    }
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="mb-4">No invoices found.</p>
      </div>
    );
  }

  // Render mobile card view
  if (isMobile) {
    return (
      <div className="md:hidden space-y-4">
        {invoices.map((invoice) => (
          <Card
            key={invoice.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onViewInvoice(invoice)} // Click card to view
          >
            <CardContent className="p-4 space-y-3"> {/* Added space-y for vertical spacing */}
              
              {/* Top row: Invoice # and Actions */}
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-base leading-tight flex items-center gap-2 truncate"> {/* Added truncate */}
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" /> {/* Added flex-shrink-0 */}
                  Invoice #{invoice.invoice_number}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0"> {/* Added flex-shrink-0 */}
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEditInvoice(invoice); }} className="h-7 w-7">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                   <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDeleteInvoice(invoice.id); }} className="h-7 w-7 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {/* Customer Name */}
              <p className="text-sm text-muted-foreground">
                Customer: {(invoice as any).customers?.name || 'Unknown Customer'}
              </p>

              {/* Date and Total */}
              <div className="flex items-center justify-between text-sm">
                 <span className="text-muted-foreground">Date: {format(new Date(invoice.created_at), 'dd MMM yyyy')}</span>
                 <span className="font-semibold text-lg">{formatCurrency(Number(invoice.total), 'IDR')}</span>
              </div>

              {/* Due Date and Status */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                   <CalendarClock className="h-3 w-3" />
                   Due: {format(new Date(invoice.payment_due_date), 'dd MMM yyyy')}
                </div>
                {getStatusBadge(invoice.status)}
              </div>

              {/* Payment Proof link */}
              {invoice.payment_proof_url && (
                <div className="text-right">
                  <a
                    href={invoice.payment_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                  >
                    View payment proof
                  </a>
                </div>
              )}
              
              {/* Download button */}
              <div className="pt-3 border-t border-border/50 flex justify-end">
                 <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onDownloadPdf(invoice); }} className="h-7 text-xs">
                    <Download className="h-3.5 w-3.5 mr-1" /> Download PDF
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Render desktop table view
  return (
    <div className="hidden md:block rounded-md border overflow-x-auto">
      <div className="min-w-[700px]"> {/* Ensure minimum width for the table */}
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewInvoice(invoice)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {invoice.invoice_number}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {format(new Date(invoice.created_at), 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  {(invoice as any).customers?.name || 'Unknown Customer'}
                </TableCell>
                <TableCell className="hidden md:table-cell flex items-center gap-1">
                  <CalendarClock className="h-3 w-3 text-muted-foreground" />
                  {format(new Date(invoice.payment_due_date), 'dd MMM yyyy')}
                </TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(Number(invoice.total), 'IDR')}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" position="popper"> {/* Added position="popper" */}
                      <DropdownMenuItem onClick={() => onViewInvoice(invoice)}>
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownloadPdf(invoice)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditInvoice(invoice)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                        onClick={() => onDeleteInvoice(invoice.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}