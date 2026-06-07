import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { expenseAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function AddExpense() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await expenseAPI.create(formData);
      toast.success('Expense added successfully!');
      navigate('/expenses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card p-6 sm:p-8 shadow-md">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Add Expense</h1>
        <ExpenseForm onSubmit={handleSubmit} loading={loading} submitLabel="Add Expense" />
      </div>
    </div>
  );
}
