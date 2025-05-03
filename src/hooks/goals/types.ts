
export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency: 'IDR' | 'USD';
  target_date?: string;
  emoji?: string;
  user_id: string; // Adding user_id as a required property
}

export interface Collaborator {
  user_id: string;
  email: string;
  full_name: string;
}
