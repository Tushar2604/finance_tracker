import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  await connectToDatabase();
  const transactions = await Transaction.find().sort({ date: -1 });
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { amount, date, description, category } = await req.json();
  if (!amount || !date || !description || !category) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }
  const transaction = new Transaction({ amount, date, description, category });
  await transaction.save();
  return NextResponse.json(transaction, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const { id, amount, date, description, category } = await req.json();
  if (!id || !amount || !date || !description || !category) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }
  const updated = await Transaction.findByIdAndUpdate(id, { amount, date, description, category }, { new: true });
  if (!updated) {
    return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID required.' }, { status: 400 });
  await Transaction.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
