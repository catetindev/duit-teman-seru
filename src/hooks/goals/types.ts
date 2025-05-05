
export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency: 'IDR' | 'USD';
  target_date?: string;
  emoji?: string;
  has_collaborators?: boolean;
}

export interface Collaborator {
  user_id: string;
  email: string;
  full_name: string;
}

export interface GoalInvitation {
  id: string;
  goal_id: string;
  inviter_id: string;
  invitee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  expires_at: string;
}

export interface InvitationWithDetails extends GoalInvitation {
  goal: {
    title: string;
    emoji: string;
  };
  inviter: {
    full_name: string;
  };
}

export type ValidCurrency = 'IDR' | 'USD';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent?: number;
  currency: ValidCurrency;
  period: string;
  user_id: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  goalProgress: number;
  balance: number;
  income: number;
  expenses: number;
  currency: ValidCurrency;
  recentTransactionDate?: string;
}
