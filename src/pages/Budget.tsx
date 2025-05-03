
// Only updating the onSubmit function and related form fields
const onSubmit = async (values: FormValues) => {
  await addUpdateBudget({
    id: selectedBudget?.id,
    category: values.category,
    amount: values.amount,
    currency: values.currency,
    period: 'monthly' // Add the missing period property with default value
  });
  setDialogOpen(false);
};
