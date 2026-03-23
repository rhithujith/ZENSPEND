export type PersonalityType = 'Spender' | 'Saver' | 'Unknown';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: 'Essentials' | 'Savings' | 'Wants';
  date: string;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
}

export interface Restaurant {
  id: string;
  name: string;
  price: string;
  distance: string;
  rating: number;
  category: 'Local' | 'Western';
  isCheap: boolean;
  isHealthy: boolean;
  reviews: number;
  tasteProfile: string[];
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface AppState {
  currentBudget: number;
  savingAllowance: number;
  personalityScore: number;
  personalityType: PersonalityType;
  isExamModeActive: boolean;
  hasCompletedOnboarding: boolean;
  transactions: Transaction[];
  bills: Bill[];
  goals: Goal[];
  streakCount: number;
  highLegibility: boolean;
}
