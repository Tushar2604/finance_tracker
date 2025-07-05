# Project Bolt: Personal Budget Dashboard

A modern, full-stack budgeting dashboard built with Next.js, TypeScript, MongoDB, and Recharts. Track your income, expenses, and budgets with beautiful charts and actionable insights.

## Features

- **Set Monthly Budgets:** Easily set and update category-wise budgets for each month.
- **Budget vs Actual Comparison:** Visualize your spending and budgets with interactive pie and bar charts.
- **Spending Insights:** Get automatic insights on your top categories, over/under budget status, and more.
- **Automatic Category Detection:** Categories are extracted from your transaction data.
- **Modern UI:** Clean, responsive interface with summary cards and modals.

## Tech Stack
- Next.js 13+
- TypeScript
- MongoDB (via Mongoose)
- Recharts (for charts)
- Lucide React (icons)
- Tailwind CSS

## Getting Started

1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd project-bolt-sb1-ynwpu76a/project
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.local.example` to `.env.local` and fill in your MongoDB connection string and any other secrets.

4. **Run the development server:**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Folder Structure

- `components/` – UI components (charts, summary cards, modals, insights)
- `app/api/` – Next.js API routes (budgets, transactions)
- `models/` – Mongoose models (Budget, Transaction)
- `types/` – TypeScript types

## Customization
- Add or edit categories by including them in your transactions.
- Adjust chart styles and colors in `components/category-budget-pie-chart.tsx`.

## License
MIT

---


