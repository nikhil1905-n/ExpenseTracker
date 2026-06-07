import { useState, useEffect } from 'react';
import { CATEGORIES, PAYMENT_METHODS, formatDateInput } from '../utils/helpers';
import { DollarSign, Tag, Calendar, CreditCard, FileText, Loader2 } from 'lucide-react';

const defaultForm = {
  title: '',
  amount: '',
  category: 'Food',
  paymentMethod: 'UPI',
  notes: '',
  expenseDate: new Date().toISOString().split('T')[0],
};

export default function ExpenseForm({ onSubmit, initialData, loading, submitLabel = 'Add Expense' }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || 'Food',
        paymentMethod: initialData.paymentMethod || 'UPI',
        notes: initialData.notes || '',
        expenseDate: initialData.expenseDate ? formatDateInput(initialData.expenseDate) : new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Valid amount required';
    if (!form.expenseDate) errs.expenseDate = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="label">Title</label>
        <div className="relative">
          <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Lunch at Swiggy"
            className={`input-field pl-10 ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
        </div>
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="label">Amount (₹)</label>
        <div className="relative">
          <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`input-field pl-10 font-mono ${errors.amount ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
        </div>
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      {/* Category & Payment Method */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Payment Method</label>
          <div className="relative">
            <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="input-field pl-10">
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="label">Date</label>
        <div className="relative">
          <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            name="expenseDate"
            value={form.expenseDate}
            onChange={handleChange}
            className={`input-field pl-10 ${errors.expenseDate ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
        </div>
        {errors.expenseDate && <p className="text-red-500 text-xs mt-1">{errors.expenseDate}</p>}
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes <span className="text-slate-400 font-normal">(optional)</span></label>
        <div className="relative">
          <FileText size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Add any notes..."
            rows={3}
            className="input-field pl-10 resize-none"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading && <Loader2 size={16} className="animate-spin" />}
        {submitLabel}
      </button>
    </form>
  );
}
