
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
export const exportFinancialReportToPdf = (
  summary: FinanceSummary,
  dateRange: { from: string; to: string },
  expenseCategories: ExpenseCategory[],
  topProducts: TopProduct[]
) => {
  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(50, 50, 50);
  doc.text('Financial Report', 14, 20);
  
  // Add date range
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Period: ${format(new Date(dateRange.from), 'yyyy-MM-dd')} to ${format(new Date(dateRange.to), 'yyyy-MM-dd')}`, 14, 30);
  
  // Add generated date
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 14, 40);
  
  // Add summary data
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Summary', 14, 46);
  
  const summaryData = [
    ['Total Income', formatCurrencyForReport(summary.totalIncome)],
    ['Total Expenses', formatCurrencyForReport(summary.totalExpenses)],
    ['Net Profit', formatCurrencyForReport(summary.netProfit)],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`],
  ];
  
  // Using jspdf-autotable
  doc.autoTable({
    startY: 50,
    head: [['Item', 'Value']],
    body: summaryData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255] },
  });
  
  // Add expenses breakdown
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Expense Breakdown', 14, doc.previousAutoTable.finalY + 15);
  
  const expenseData = expenseCategories.map(cat => [
    cat.category,
    formatCurrencyForReport(cat.amount),
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  // Using jspdf-autotable
  doc.autoTable({
    startY: doc.previousAutoTable.finalY + 20,
    head: [['Category', 'Amount', 'Percentage']],
    body: expenseData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255] },
  });
  
  // Add top products if available
  if (topProducts.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Top Products', 14, doc.previousAutoTable.finalY + 15);
    
    const productData = topProducts.map(product => [
      product.name,
      formatCurrencyForReport(product.revenue),
      product.count.toString()
    ]);
    
    // Using jspdf-autotable
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 20,
      head: [['Product', 'Revenue', 'Units Sold']],
      body: productData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255] },
    });
  }
  
  // Save the PDF
  doc.save('financial-report.pdf');
};

// Export financial data to Excel format
export const exportFinancialReportToExcel = (
  summary: FinanceSummary,
  dateRange: { from: string; to: string },
  expenseCategories: ExpenseCategory[],
  topProducts: TopProduct[]
) => {
  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['Financial Report', ''],
    ['', ''],
    [`Period: ${format(new Date(dateRange.from), 'yyyy-MM-dd')} to ${format(new Date(dateRange.to), 'yyyy-MM-dd')}`, ''],
    [`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, ''],
    ['', ''],
    ['Financial Summary', ''],
    ['Total Income', summary.totalIncome],
    ['Total Expenses', summary.totalExpenses],
    ['Net Profit', summary.netProfit],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`],
    ['', ''],
    ['Expense Breakdown', ''],
    ['Category', 'Amount', 'Percentage'],
  ];
  
  // Add expense categories
  expenseCategories.forEach(cat => {
    summaryData.push([cat.category, cat.amount, `${cat.percentage.toFixed(2)}%`]);
  });
  
  // Add a gap then top products
  summaryData.push(['', ''], ['Top Products', '', ''], ['Product', 'Revenue', 'Units Sold']);
  
  // Add product data
  topProducts.forEach(product => {
    summaryData.push([product.name, product.revenue, product.count]);
  });
  
  // Create summary worksheet
  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, summaryWS, 'Financial Summary');
  
  // Generate and save Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'financial-report.xlsx');
};

// Export expense data to PDF
export const exportExpensesToPdf = (
  expenses: any[],
  summary: FinanceSummary,
  dateRange: { from: string; to: string },
  expenseCategories: ExpenseCategory[]
) => {
  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(50, 50, 50);
  doc.text('Expense Report', 14, 20);
  
  // Add date range
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Period: ${format(new Date(dateRange.from), 'yyyy-MM-dd')} to ${format(new Date(dateRange.to), 'yyyy-MM-dd')}`, 14, 30);
  
  // Add generated date
  doc.setFontSize(10);
  doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 14, 40);
  
  // Add summary data
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Summary', 14, 46);
  
  const summaryData = [
    ['Total Income', formatCurrencyForReport(summary.totalIncome)],
    ['Total Expenses', formatCurrencyForReport(summary.totalExpenses)],
    ['Net Profit', formatCurrencyForReport(summary.netProfit)],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`],
  ];
  
  doc.autoTable({
    startY: 50,
    head: [['Item', 'Value']],
    body: summaryData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255] },
  });
  
  // Add expenses breakdown
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Expense Breakdown', 14, doc.previousAutoTable.finalY + 15);
  
  const expenseData = expenseCategories.map(cat => [
    cat.category,
    formatCurrencyForReport(cat.amount),
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  doc.autoTable({
    startY: doc.previousAutoTable.finalY + 20,
    head: [['Category', 'Amount', 'Percentage']],
    body: expenseData,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255] },
  });
  
  // Add expenses list
  if (expenses.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Recent Expenses', 14, doc.previousAutoTable.finalY + 15);
    
    const expensesData = expenses.slice(0, 20).map(exp => [
      format(new Date(exp.date), 'yyyy-MM-dd'),
      exp.title,
      exp.category,
      formatCurrencyForReport(exp.amount)
    ]);
    
    doc.autoTable({
      startY: doc.previousAutoTable.finalY + 20,
      head: [['Date', 'Title', 'Category', 'Amount']],
      body: expensesData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [80, 80, 80], textColor: [255, 255, 255] },
    });
    
    if (expenses.length > 20) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Showing 20 of ${expenses.length} expenses. Full list available in Excel report.`,
        14,
        doc.previousAutoTable.finalY + 10
      );
    }
  }
  
  // Save the PDF
  doc.save('expense-report.pdf');
};

// Export expenses to Excel format
export const exportExpensesToExcel = (
  expenses: any[],
  summary: FinanceSummary,
  dateRange: { from: string; to: string },
  expenseCategories: ExpenseCategory[]
) => {
  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['Expense Report', ''],
    ['', ''],
    [`Period: ${format(new Date(dateRange.from), 'yyyy-MM-dd')} to ${format(new Date(dateRange.to), 'yyyy-MM-dd')}`, ''],
    [`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, ''],
    ['', ''],
    ['Financial Summary', ''],
    ['Total Income', summary.totalIncome],
    ['Total Expenses', summary.totalExpenses],
    ['Net Profit', summary.netProfit],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`],
    ['', ''],
    ['Expense Breakdown', ''],
    ['Category', 'Amount', 'Percentage'],
  ];
  
  // Add expense categories
  expenseCategories.forEach(cat => {
    summaryData.push([cat.category, cat.amount, `${cat.percentage.toFixed(2)}%`]);
  });
  
  // Create summary worksheet
  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, summaryWS, 'Summary');
  
  // Create expenses worksheet
  const expenseHeaders = ['Date', 'Title', 'Category', 'Amount', 'Notes'];
  const expenseRows = expenses.map(exp => [
    format(new Date(exp.date), 'yyyy-MM-dd'),
    exp.title,
    exp.category,
    exp.amount,
    exp.notes || ''
  ]);
  
  const expensesData = [expenseHeaders, ...expenseRows];
  const expensesWS = XLSX.utils.aoa_to_sheet(expensesData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, expensesWS, 'Expenses');
  
  // Generate and save Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'expense-report.xlsx');
};
