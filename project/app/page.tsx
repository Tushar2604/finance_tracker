'use client';

import { useState, useEffect } from 'react';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { MonthlyExpensesChart } from '@/components/monthly-expenses-chart';
import { SummaryCards } from '@/components/summary-cards';
import { Transaction, TransactionFormData } from '@/types/transaction';
import { getTransactions, saveTransaction, updateTransaction, deleteTransaction } from '@/lib/storage';
import { Wallet, Github, Globe } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTransactions(getTransactions());
  }, []);

  const handleAddTransaction = (data: TransactionFormData) => {
    const newTransaction = saveTransaction({
      amount: parseFloat(data.amount),
      date: data.date,
      description: data.description,
      type: data.type,
    });
    setTransactions(getTransactions());
  };

  const handleEditTransaction = (data: TransactionFormData) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        amount: parseFloat(data.amount),
        date: data.date,
        description: data.description,
        type: data.type,
      });
      setTransactions(getTransactions());
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    setTransactions(getTransactions());
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Personal Finance Tracker</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take control of your finances with our easy-to-use expense tracking tool. 
            Monitor your spending, visualize your expenses, and make informed financial decisions.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <SummaryCards transactions={transactions} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Transaction Form */}
          <div>
            <TransactionForm
              transaction={editingTransaction || undefined}
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              onCancel={editingTransaction ? handleCancelEdit : undefined}
              isEditing={!!editingTransaction}
            />
          </div>

          {/* Monthly Expenses Chart */}
          <div>
            <MonthlyExpensesChart transactions={transactions} />
          </div>
        </div>

        {/* Transaction List */}
        <div className="mb-8">
          <TransactionList
            transactions={transactions.slice().reverse()}
            onEdit={handleEditClick}
            onDelete={handleDeleteTransaction}
          />
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t bg-background/50 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-6 mb-4">
            <a 
              href="#" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>Live Demo</span>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, React, shadcn/ui, and Recharts
          </p>
        </footer>
      </div>
    </div>
  );
}