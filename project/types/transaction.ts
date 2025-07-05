export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'expense' | 'income';
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  amount: string;
  date: string;
  description: string;
  category: string;
  type: 'expense' | 'income';
}