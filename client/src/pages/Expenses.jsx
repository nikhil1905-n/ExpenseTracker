import { useEffect, useState, useCallback } from 'react';
import { expenseAPI } from '../services/api';
import ExpenseCard from '../components/ExpenseCard';
import DeleteModal from '../components/DeleteModal';
import { CATEGORIES } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const LIMIT = 8;

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await expenseAPI.getAll({
        search: search || undefined,
        category: category !== 'All' ? category : undefined,
        page,
        limit: LIMIT,
      });
      setExpenses(data.expenses);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    const timer = setTimeout(fetchExpenses, 300);
    return () => clearTimeout(timer);
  }, [fetchExpenses]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await expenseAPI.delete(deleteId);
      toast.success('Expense deleted');
      setDeleteId(null);
      fetchExpenses();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Expenses</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{total} total transactions</p>
        </div>
        <Link to="/add-expense" className="btn-primary flex items-center gap-2">
          <PlusCircle size={18} />
          Add Expense
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="card p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by title, category, or notes..."
            className="input-field pl-10"
          />
        </div>

        {/* Category Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200
                  ${category === cat
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expense List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 h-20 animate-pulse bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">No expenses found</h3>
          <p className="text-slate-400 mt-2 text-sm">
            {search || category !== 'All' ? 'Try adjusting your search or filters' : 'Add your first expense to get started'}
          </p>
          {!search && category === 'All' && (
            <Link to="/add-expense" className="btn-primary mt-4 inline-flex items-center gap-2">
              <PlusCircle size={16} /> Add Expense
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map(expense => (
            <ExpenseCard key={expense._id} expense={expense} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                  page === i + 1 ? 'bg-primary-600 text-white' : 'btn-secondary'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
