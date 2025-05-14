
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { FinanceSummary, ExpenseCategory, TopProduct } from '@/types/finance';

// Helper to format currency for reports
const formatCurrencyForReport = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date range for report titles
export const formatDateRange = (from: Date, to: Date): string => {
  return `${format(from, 'dd MMM yyyy')} - ${format(to, 'dd MMM yyyy')}`;
};

// Export finance report as Excel
export const exportFinanceReportAsExcel = (
  summary: FinanceSummary,
  expenseCategories: ExpenseCategory[],
  topProducts: TopProduct[],
  dateRange: { from: Date; to: Date }
) => {
  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['💰 Finance Report', ''],
    ['Period', formatDateRange(dateRange.from, dateRange.to)],
    [''],
    ['Revenue', formatCurrencyForReport(summary.totalIncome)],
    ['Expenses', formatCurrencyForReport(summary.totalExpenses)],
    ['Profit', formatCurrencyForReport(summary.netProfit)],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
  
  // Expense Categories sheet
  const expenseHeaders = [['Category', 'Amount', 'Percentage']];
  const expenseData = expenseCategories.map(cat => [
    cat.category,
    formatCurrencyForReport(cat.amount),
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  const expenseSheet = XLSX.utils.aoa_to_sheet([...expenseHeaders, ...expenseData]);
  XLSX.utils.book_append_sheet(workbook, expenseSheet, "Expenses");
  
  // Top Products sheet if available
  if (topProducts.length > 0) {
    const productHeaders = [['Product', 'Revenue', 'Units Sold']];
    const productData = topProducts.map(product => [
      product.name,
      formatCurrencyForReport(product.revenue),
      product.count.toString()
    ]);
    
    const productSheet = XLSX.utils.aoa_to_sheet([...productHeaders, ...productData]);
    XLSX.utils.book_append_sheet(workbook, productSheet, "Top Products");
  }
  
  // Generate file and trigger download
  const fileName = `finance-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export finance report as PDF
export const exportFinanceReportAsPdf = (
  summary: FinanceSummary,
  expenseCategories: ExpenseCategory[],
  topProducts: TopProduct[],
  dateRange: { from: Date; to: Date }
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(83, 56, 158); // Purple shade
  doc.text('Finance Report 💰', 14, 22);
  
  // Add period
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Period: ${formatDateRange(dateRange.from, dateRange.to)}`, 14, 30);
  
  // Add summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Summary', 14, 45);
  
  const summaryData = [
    ['Revenue', formatCurrencyForReport(summary.totalIncome)],
    ['Expenses', formatCurrencyForReport(summary.totalExpenses)],
    ['Profit', formatCurrencyForReport(summary.netProfit)],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`],
  ];
  
  // @ts-ignore - jspdf-autotable types are not fully compatible
  doc.autoTable({
    startY: 50,
    head: [['Item', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] }
  });
  
  // Add expenses breakdown
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Expense Breakdown', 14, doc.autoTable.previous.finalY + 15);
  
  const expenseData = expenseCategories.map(cat => [
    cat.category,
    formatCurrencyForReport(cat.amount),
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  // @ts-ignore - jspdf-autotable types are not fully compatible
  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    head: [['Category', 'Amount', 'Percentage']],
    body: expenseData,
    theme: 'grid',
    headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] }
  });
  
  // Add top products if available
  if (topProducts.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Top Products', 14, doc.autoTable.previous.finalY + 15);
    
    const productData = topProducts.map(product => [
      product.name,
      formatCurrencyForReport(product.revenue),
      product.count.toString()
    ]);
    
    // @ts-ignore - jspdf-autotable types are not fully compatible
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['Product', 'Revenue', 'Units Sold']],
      body: productData,
      theme: 'grid',
      headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] }
    });
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${format(new Date(), 'dd MMM yyyy')} • Page ${i} of ${pageCount}`, 
      doc.internal.pageSize.getWidth() / 2, 
      doc.internal.pageSize.getHeight() - 10, 
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`finance-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Export profit loss report as Excel
export const exportProfitLossAsExcel = (
  summary: FinanceSummary,
  expenseCategories: ExpenseCategory[],
  expenses: any[],
  dateRange: { from: Date; to: Date }
) => {
  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['💸 Profit & Loss Report', ''],
    ['Period', formatDateRange(dateRange.from, dateRange.to)],
    [''],
    ['Revenue', formatCurrencyForReport(summary.totalIncome)],
    ['Expenses', formatCurrencyForReport(summary.totalExpenses)],
    ['Profit/Loss', formatCurrencyForReport(summary.netProfit)],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`],
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
  
  // Expense Categories sheet
  const expenseHeaders = [['Category', 'Amount', 'Percentage']];
  const expenseData = expenseCategories.map(cat => [
    cat.category,
    formatCurrencyForReport(cat.amount),
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  const expenseSheet = XLSX.utils.aoa_to_sheet([...expenseHeaders, ...expenseData]);
  XLSX.utils.book_append_sheet(workbook, expenseSheet, "Expense Categories");
  
  // Detailed expenses sheet
  if (expenses.length > 0) {
    const expensesHeaders = [['Date', 'Title', 'Category', 'Amount', 'Notes']];
    const expensesData = expenses.map(exp => [
      format(new Date(exp.date), 'yyyy-MM-dd'),
      exp.title,
      exp.category,
      formatCurrencyForReport(exp.amount),
      exp.notes || ''
    ]);
    
    const detailedSheet = XLSX.utils.aoa_to_sheet([...expensesHeaders, ...expensesData]);
    XLSX.utils.book_append_sheet(workbook, detailedSheet, "Detailed Expenses");
  }
  
  // Generate file and trigger download
  const fileName = `profit-loss-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export profit loss report as PDF
export const exportProfitLossAsPdf = (
  summary: FinanceSummary,
  expenseCategories: ExpenseCategory[],
  expenses: any[],
  dateRange: { from: Date; to: Date }
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(83, 56, 158); // Purple shade
  doc.text('Profit & Loss Report 💸', 14, 22);
  
  // Add period
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Period: ${formatDateRange(dateRange.from, dateRange.to)}`, 14, 30);
  
  // Add summary
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Summary', 14, 45);
  
  const summaryData = [
    ['Revenue', formatCurrencyForReport(summary.totalIncome)],
    ['Expenses', formatCurrencyForReport(summary.totalExpenses)],
    ['Profit/Loss', formatCurrencyForReport(summary.netProfit)],
    ['Profit Margin', `${summary.profitMargin.toFixed(2)}%`],
  ];
  
  // @ts-ignore - jspdf-autotable types are not fully compatible
  doc.autoTable({
    startY: 50,
    head: [['Item', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] }
  });
  
  // Add expenses breakdown
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Expense Breakdown', 14, doc.autoTable.previous.finalY + 15);
  
  const expenseData = expenseCategories.map(cat => [
    cat.category,
    formatCurrencyForReport(cat.amount),
    `${cat.percentage.toFixed(2)}%`
  ]);
  
  // @ts-ignore - jspdf-autotable types are not fully compatible
  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    head: [['Category', 'Amount', 'Percentage']],
    body: expenseData,
    theme: 'grid',
    headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] }
  });
  
  // Add detailed expenses if available - limit to top 20 for PDF readability
  if (expenses.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Recent Expenses', 14, doc.autoTable.previous.finalY + 15);
    
    const expensesData = expenses.slice(0, 20).map(exp => [
      format(new Date(exp.date), 'yyyy-MM-dd'),
      exp.title,
      exp.category,
      formatCurrencyForReport(exp.amount)
    ]);
    
    // @ts-ignore - jspdf-autotable types are not fully compatible
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['Date', 'Title', 'Category', 'Amount']],
      body: expensesData,
      theme: 'grid',
      headStyles: { fillColor: [155, 135, 245], textColor: [255, 255, 255] }
    });
    
    if (expenses.length > 20) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Showing 20 of ${expenses.length} expenses. Full list available in Excel report.`,
        14,
        doc.autoTable.previous.finalY + 10
      );
    }
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${format(new Date(), 'dd MMM yyyy')} • Page ${i} of ${pageCount}`, 
      doc.internal.pageSize.getWidth() / 2, 
      doc.internal.pageSize.getHeight() - 10, 
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`profit-loss-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
