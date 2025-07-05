import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');
  if (!month) {
    return NextResponse.json({ error: 'Month required' }, { status: 400 });
  }
  const budgets = await Budget.find({ month });
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { category, month, amount } = await req.json();
  if (!category || !month || !amount) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }
  // Upsert: update if exists, else create
  const updated = await Budget.findOneAndUpdate(
    { category, month },
    { amount },
    { new: true, upsert: true }
  );
  return NextResponse.json(updated, { status: 201 });
}
