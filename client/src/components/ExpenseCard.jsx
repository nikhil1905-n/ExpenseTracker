import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryIcon, CATEGORY_COLORS } from '../utils/helpers';

export default function ExpenseCard({ expense, onDelete }) {
  const color = CATEGORY_COLORS[expense.category] || '#64748b';

  return (
    <div className="card p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200 animate-slide-up group">
      {/* Category icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        {getCategoryIcon(expense.category)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white truncate">{expense.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="badge text-white text-xs"
                style={{ backgroundColor: color }}
              >
                {expense.category}
              </span>
              <span className="text-xs text-slate-400">{expense.paymentMethod}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="amount font-semibold text-slate-900 dark:text-white">{formatCurrency(expense.amount)}</p>
            <p className="text-xs text-slate-400 mt-0.5">{formatDate(expense.expenseDate)}</p>
          </div>
        </div>

        {expense.notes && (
          <p className="text-xs text-slate-400 mt-1.5 truncate">{expense.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <Link
          to={`/edit-expense/${expense._id}`}
          className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-500 transition-all"
          title="Edit"
        >
          <Pencil size={15} />
        </Link>
        <button
          onClick={() => onDelete(expense._id)}
          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all"
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
