import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { expenseAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function EditExpense() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [expense, setExpense] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const { data } = await expenseAPI.getById(id);
        setExpense(data);
      } catch {
        toast.error('Expense not found');
        navigate('/expenses');
      } finally {
        setFetching(false);
      }
    };
    fetchExpense();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await expenseAPI.update(id, formData);
      toast.success('Expense updated!');
      navigate('/expenses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card p-6 sm:p-8 shadow-md">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Expense</h1>
        <ExpenseForm onSubmit={handleSubmit} loading={loading} initialData={expense} submitLabel="Update Expense" />
      </div>
    </div>
  );
}
