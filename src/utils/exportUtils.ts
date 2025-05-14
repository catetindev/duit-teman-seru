
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

// CORRECTED: Renamed to match the function references in other files
export const exportFinanceReportAsPdf = (
  summary: FinanceSummary,
  expenseCategories: ExpenseCategory[],
  topProducts: TopProduct[],
  dateRange: { from: Date; to: Date }
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Financial Report', pageWidth / 2, 15, { align: 'center' });
  
  // Add date range
  doc.setFontSize(10);
  doc.text(
    `Period: ${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`,
    pageWidth / 2,
    22,
    { align: 'center' }
  );
  
  // Add financial summary
  doc.setFontSize(12);
  doc.text('Financial Summary', 14, 35);
  
  const summaryData = [
    ['Total Income', formatCurrencyForReport(summary.totalIncome)],
    ['Total Expenses', formatCurrencyForReport(summary.totalExpenses)],
    ['Net Profit', formatCurrencyForReport(summary.netProfit)],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`]
  ];
  
  doc.autoTable({
    startY: 38,
    head: [['Category', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [71, 85, 105] }
  });
  
  // Add expense categories
  doc.setFontSize(12);
  doc.text('Expense Categories', 14, doc.lastAutoTable.finalY + 15);
  
  const categoryData = expenseCategories.map(cat => [
    cat.category,
    formatCurrencyForReport(cat.amount),
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 18,
    head: [['Category', 'Amount', 'Percentage']],
    body: categoryData,
    theme: 'striped',
    headStyles: { fillColor: [71, 85, 105] }
  });
  
  // Add top products if there are any
  if (topProducts.length > 0) {
    doc.setFontSize(12);
    doc.text('Top Products', 14, doc.lastAutoTable.finalY + 15);
    
    const productData = topProducts.map(product => [
      product.name,
      product.count.toString(),
      formatCurrencyForReport(product.revenue)
    ]);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 18,
      head: [['Product', 'Quantity Sold', 'Revenue']],
      body: productData,
      theme: 'striped',
      headStyles: { fillColor: [71, 85, 105] }
    });
  }
  
  // Add footer
  const now = new Date();
  doc.setFontSize(8);
  doc.text(
    `Generated on ${format(now, 'dd MMM yyyy HH:mm')}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
  
  // Save PDF
  doc.save(`Financial_Report_${format(now, 'yyyy-MM-dd')}.pdf`);
};

// CORRECTED: Renamed to match the function references in other files
export const exportFinanceReportAsExcel = (
  summary: FinanceSummary,
  expenseCategories: ExpenseCategory[],
  topProducts: TopProduct[],
  dateRange: { from: Date; to: Date }
) => {
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Add summary sheet
  const summaryData = [
    ['Financial Summary'],
    ['Period', `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`],
    [],
    ['Category', 'Value'],
    ['Total Income', summary.totalIncome],
    ['Total Expenses', summary.totalExpenses],
    ['Net Profit', summary.netProfit],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`]
  ];
  
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary');
  
  // Add expenses sheet
  const expensesHeaders = ['Category', 'Amount', 'Percentage'];
  const expensesData = expenseCategories.map(cat => [
    cat.category,
    cat.amount,
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  expensesData.unshift(expensesHeaders);
  const expensesWs = XLSX.utils.aoa_to_sheet(expensesData);
  XLSX.utils.book_append_sheet(workbook, expensesWs, 'Expense Categories');
  
  // Add top products sheet if there are any
  if (topProducts.length > 0) {
    const productsHeaders = ['Product', 'Quantity Sold', 'Revenue'];
    const productsData = topProducts.map(product => [
      product.name,
      product.count,
      product.revenue
    ]);
    
    productsData.unshift(productsHeaders);
    const productsWs = XLSX.utils.aoa_to_sheet(productsData);
    XLSX.utils.book_append_sheet(workbook, productsWs, 'Top Products');
  }
  
  // Generate Excel file
  const now = new Date();
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Financial_Report_${format(now, 'yyyy-MM-dd')}.xlsx`);
};

// ADDED: Implementation for exportProfitLossAsPdf
export const exportProfitLossAsPdf = (
  summary: FinanceSummary,
  expenseCategories: ExpenseCategory[],
  expenses: any[],
  dateRange: { from: Date; to: Date }
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(16);
  doc.text('Profit & Loss Report', pageWidth / 2, 15, { align: 'center' });
  
  // Add date range
  doc.setFontSize(10);
  doc.text(
    `Period: ${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`,
    pageWidth / 2,
    22,
    { align: 'center' }
  );
  
  // Add financial summary
  doc.setFontSize(12);
  doc.text('Profit & Loss Summary', 14, 35);
  
  const summaryData = [
    ['Total Income', formatCurrencyForReport(summary.totalIncome)],
    ['Total Expenses', formatCurrencyForReport(summary.totalExpenses)],
    ['Net Profit', formatCurrencyForReport(summary.netProfit)],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`]
  ];
  
  doc.autoTable({
    startY: 38,
    head: [['Category', 'Value']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [71, 85, 105] }
  });
  
  // Add expense categories
  doc.setFontSize(12);
  doc.text('Expense Categories', 14, doc.lastAutoTable.finalY + 15);
  
  const categoryData = expenseCategories.map(cat => [
    cat.category,
    formatCurrencyForReport(cat.amount),
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 18,
    head: [['Category', 'Amount', 'Percentage']],
    body: categoryData,
    theme: 'striped',
    headStyles: { fillColor: [71, 85, 105] }
  });
  
  // Add detailed expenses
  doc.setFontSize(12);
  doc.text('Detailed Expenses', 14, doc.lastAutoTable.finalY + 15);
  
  // Format the expense data for the table
  const expenseData = expenses.map(expense => [
    expense.title,
    expense.category,
    format(new Date(expense.date), 'dd MMM yyyy'),
    formatCurrencyForReport(Number(expense.amount))
  ]);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 18,
    head: [['Expense', 'Category', 'Date', 'Amount']],
    body: expenseData,
    theme: 'striped',
    headStyles: { fillColor: [71, 85, 105] }
  });
  
  // Add footer
  const now = new Date();
  doc.setFontSize(8);
  doc.text(
    `Generated on ${format(now, 'dd MMM yyyy HH:mm')}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
  
  // Save PDF
  doc.save(`Profit_Loss_Report_${format(now, 'yyyy-MM-dd')}.pdf`);
};

// ADDED: Implementation for exportProfitLossAsExcel
export const exportProfitLossAsExcel = (
  summary: FinanceSummary,
  expenseCategories: ExpenseCategory[],
  expenses: any[],
  dateRange: { from: Date; to: Date }
) => {
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Add summary sheet
  const summaryData = [
    ['Profit & Loss Summary'],
    ['Period', `${format(dateRange.from, 'dd MMM yyyy')} - ${format(dateRange.to, 'dd MMM yyyy')}`],
    [],
    ['Category', 'Value'],
    ['Total Income', summary.totalIncome],
    ['Total Expenses', summary.totalExpenses],
    ['Net Profit', summary.netProfit],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`]
  ];
  
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary');
  
  // Add expense categories sheet
  const expensesHeaders = ['Category', 'Amount', 'Percentage'];
  const categoryData = expenseCategories.map(cat => [
    cat.category,
    cat.amount,
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  categoryData.unshift(expensesHeaders);
  const categoriesWs = XLSX.utils.aoa_to_sheet(categoryData);
  XLSX.utils.book_append_sheet(workbook, categoriesWs, 'Expense Categories');
  
  // Add detailed expenses sheet
  const detailHeaders = ['Expense', 'Category', 'Date', 'Amount', 'Notes'];
  const detailData = expenses.map(expense => [
    expense.title,
    expense.category,
    format(new Date(expense.date), 'yyyy-MM-dd'),
    Number(expense.amount),
    expense.notes || ''
  ]);
  
  detailData.unshift(detailHeaders);
  const detailWs = XLSX.utils.aoa_to_sheet(detailData);
  XLSX.utils.book_append_sheet(workbook, detailWs, 'Detailed Expenses');
  
  // Generate Excel file
  const now = new Date();
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Profit_Loss_Report_${format(now, 'yyyy-MM-dd')}.xlsx`);
};
