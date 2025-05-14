import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
// Import autotable explicitly - this extends the jsPDF prototype
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { FinanceSummary, ExpenseCategory, TopProduct } from '@/types/finance';

// This adds the autoTable method to the jsPDF instance
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => any;
    lastAutoTable: {
      finalY: number;
    };
    previousAutoTable: {
      finalY: number;
    };
  }
}

// Helper to format currency for reports
const formatCurrencyForReport = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Export data to Excel (.xlsx) format
export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  // Generate Excel file and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

// Export financial data to PDF format
export const exportFinanceReportAsPdf = exportFinancialReportToPdf;

// Export financial data to Excel format
export const exportFinanceReportAsExcel = exportFinancialReportToExcel;

// Export expense data to PDF - for Profit & Loss reports
export const exportProfitLossAsPdf = exportExpensesToPdf;

// Export expenses to Excel format - for Profit & Loss reports
export const exportProfitLossAsExcel = exportExpensesToExcel;
