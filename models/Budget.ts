import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  category: string;
  month: string; // YYYY-MM
  amount: number;
}

const BudgetSchema = new Schema<IBudget>({
  category: { type: String, required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
});

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
