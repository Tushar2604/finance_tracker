"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF5", "#FF6699", "#FFB347", "#B6FFB3"];

interface CategoryBudgetPieChartProps {
  transactions: Transaction[];
  month: string; // YYYY-MM
}

interface Budget {
  category: string;
  month: string;
  amount: number;
}

export function CategoryBudgetPieChart({ transactions, month }: CategoryBudgetPieChartProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudgets() {
      setLoading(true);
      try {
        const res = await fetch(`/api/budgets?month=${month}`);
        const data = await res.json();
        setBudgets(data);
      } catch (e) {
        setBudgets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBudgets();
  }, [month]);

  // Group transactions by category for the month
  const categoryExpenses: Record<string, number> = {};
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const tMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (t.type === "expense" && tMonth === month) {
      categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
    }
  });

  // Prepare data for pie charts
  const expenseData = Object.entries(categoryExpenses).map(([category, value]) => ({
    name: category,
    value,
  }));

  const budgetData = budgets.map((b) => ({
    name: b.category,
    value: b.amount,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Budget vs Actual by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-12 text-center">Loading...</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="w-full md:w-1/2 h-72">
              <h3 className="text-center font-semibold mb-2">Actual Spending</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 h-72">
              <h3 className="text-center font-semibold mb-2">Budget Allocation</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-budget-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
