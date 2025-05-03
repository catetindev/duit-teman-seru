
export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency: 'IDR' | 'USD';
  target_date?: string;
  emoji?: string;
}

export interface Collaborator {
  user_id: string;
  email: string;
  full_name: string;
}
