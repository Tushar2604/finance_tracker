import { Transaction } from '@/types/transaction';

const STORAGE_KEY = 'finance-tracker-transactions';

export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const saveTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  transactions.push(newTransaction);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  return newTransaction;
};

export const updateTransaction = (id: string, updates: Partial<Transaction>): Transaction | null => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  transactions[index] = {
    ...transactions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  return transactions[index];
};

export const deleteTransaction = (id: string): boolean => {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  
  if (filtered.length === transactions.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};