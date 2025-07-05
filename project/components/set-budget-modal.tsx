"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Budget {
  _id?: string;
  category: string;
  month: string;
  amount: number;
}

interface SetBudgetModalProps {
  categories: string[];
  defaultMonth?: string;
  onBudgetSet?: () => void;
}

export function SetBudgetModal({ categories, defaultMonth, onBudgetSet }: SetBudgetModalProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(defaultMonth || new Date().toISOString().slice(0, 7));
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [form, setForm] = useState<{ category: string; amount: string }>({ category: categories[0] || '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && month) {
      fetch(`/api/budgets?month=${month}`)
        .then(res => res.json())
        .then(setBudgets)
        .catch(() => setBudgets([]));
    }
  }, [open, month]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: form.category,
          month,
          amount: Number(form.amount),
        }),
      });
      if (!res.ok) throw new Error('Failed to set budget');
      setBudgets(prev => {
        const idx = prev.findIndex(b => b.category === form.category);
        const updated = { category: form.category, month, amount: Number(form.amount) };
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = updated;
          return copy;
        } else {
          return [...prev, updated];
        }
      });
      setForm({ category: categories[0] || '', amount: '' });
      if (onBudgetSet) onBudgetSet();
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Set Monthly Budgets</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Category Budgets for {month}</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <label className="block text-xs mb-1" htmlFor="month">Month</label>
          <Input
            id="month"
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="mb-2"
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="block text-xs">Category</label>
          <select
            className="border rounded px-2 py-1"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          >
            {categories.map(cat => (
              <option value={cat} key={cat}>{cat}</option>
            ))}
          </select>
          <label className="block text-xs">Amount</label>
          <Input
            type="number"
            min="0"
            step="1"
            value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            required
          />
          <Button type="submit" disabled={loading} className="mt-2">{loading ? 'Saving...' : 'Save Budget'}</Button>
          {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
        </form>
        <div className="mt-6">
          <h4 className="font-semibold mb-2 text-sm">Existing Budgets</h4>
          <ul className="text-xs">
            {budgets.length === 0 && <li className="text-muted-foreground">No budgets set</li>}
            {budgets.map(b => (
              <li key={b.category} className="flex justify-between">
                <span>{b.category}</span>
                <span>${b.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
