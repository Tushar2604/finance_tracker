"use client";

import React, { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction";

interface Budget {
  category: string;
  month: string;
  amount: number;
}

interface SpendingInsightsProps {
  transactions: Transaction[];
  month: string; // YYYY-MM
}

export function SpendingInsights({ transactions, month }: SpendingInsightsProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/budgets?month=${month}`)
      .then(async res => {
        if (!res.ok) return [];
        const text = await res.text();
        try {
          return text ? JSON.parse(text) : [];
        } catch {
          return [];
        }
      })
      .then(setBudgets)
      .finally(() => setLoading(false));
  }, [month]);

  // Calculate category expenses for the month
  const categoryExpenses: Record<string, number> = {};
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const tMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (t.type === "expense" && tMonth === month) {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    }
  });

  // Top spending categories
  const topCategories = Object.entries(categoryExpenses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  // Over/under budget
  const overBudget: string[] = [];
  const underBudget: string[] = [];
  budgets.forEach(b => {
    const spent = categoryExpenses[b.category] || 0;
    if (spent > b.amount) overBudget.push(b.category);
    else if (spent < b.amount) underBudget.push(b.category);
  });

  // Insight tips
  let tip = '';
  if (overBudget.length > 0) {
    tip = `You are over budget in: ${overBudget.join(', ')}.`;
  } else if (underBudget.length > 0) {
    tip = `You are under budget in: ${underBudget.join(', ')}. Great job!`;
  } else if (!loading && budgets.length > 0) {
    tip = "You're on track with your budgets!";
  } else {
    tip = "Set budgets for more insights.";
  }

  return (
    <div className="mt-8 p-4 rounded-lg border bg-muted">
      <h3 className="font-semibold text-lg mb-2">Spending Insights</h3>
      {loading ? (
        <div>Loading insights...</div>
      ) : (
        <>
          {topCategories.length > 0 && (
            <div className="mb-2 text-sm">
              <strong>Top categories:</strong> {topCategories.map(([cat, amt]) => `${cat} ($${amt.toLocaleString()})`).join(', ')}
            </div>
          )}
          <div className="mb-1 text-sm">
            <strong>Tip:</strong> {tip}
          </div>
        </>
      )}
    </div>
  );
}
