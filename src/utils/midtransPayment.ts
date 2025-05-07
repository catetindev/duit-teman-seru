
// Utility function to initiate Midtrans payment

export interface PaymentDetails {
  id: string;
  amount: number;
  itemName: string;
  customerName?: string;
  customerEmail?: string;
  billingCycle: 'monthly' | 'yearly';
}

export async function initiatePayment(paymentDetails: PaymentDetails): Promise<string> {
  try {
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Payment initiation failed');
    }

    const data = await response.json();
    return data.redirectUrl;
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
}
