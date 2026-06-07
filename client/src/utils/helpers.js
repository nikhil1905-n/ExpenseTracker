export const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other'];
export const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Other'];

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Travel: '#3b82f6',
  Bills: '#ef4444',
  Shopping: '#ec4899',
  Entertainment: '#8b5cf6',
  Health: '#22c55e',
  Education: '#eab308',
  Other: '#64748b',
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateInput = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const getCategoryIcon = (category) => {
  const icons = {
    Food: '🍽️',
    Travel: '✈️',
    Bills: '🧾',
    Shopping: '🛒',
    Entertainment: '🎬',
    Health: '💊',
    Education: '📚',
    Other: '📦',
  };
  return icons[category] || '📦';
};
