import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { formatCurrency, formatDate, getCategoryIcon, CATEGORY_COLORS } from '../utils/helpers';
import StatCard from '../components/StatCard';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PlusCircle, TrendingUp, Wallet, Calendar, ShoppingBag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await dashboardAPI.get();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartColors = isDark ? { text: '#94a3b8', grid: '#1e293b' } : { text: '#64748b', grid: '#e2e8f0' };
  const pieData = data?.categoryBreakdown?.map(item => ({
    name: item._id,
    value: item.total,
    color: CATEGORY_COLORS[item._id] || '#64748b',
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your financial overview</p>
        </div>
        <Link to="/add-expense" className="btn-primary flex items-center gap-2">
          <PlusCircle size={18} />
          Add Expense
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(data?.totalExpenses || 0)}
          subtitle={`${data?.totalCount || 0} transactions`}
          icon={<Wallet size={20} />}
          color="primary"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(data?.monthlyExpenses || 0)}
          subtitle={`${data?.monthlyCount || 0} this month`}
          icon={<Calendar size={20} />}
          color="accent"
        />
        <StatCard
          title="Top Category"
          value={data?.categoryBreakdown?.[0]?._id || 'None'}
          subtitle={data?.categoryBreakdown?.[0] ? formatCurrency(data.categoryBreakdown[0].total) : ''}
          icon={<ShoppingBag size={20} />}
          color="green"
        />
        <StatCard
          title="Avg / Transaction"
          value={data?.totalCount ? formatCurrency(data.totalExpenses / data.totalCount) : '₹0'}
          subtitle="All time average"
          icon={<TrendingUp size={20} />}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      {(pieData.length > 0 || data?.monthlyTrend?.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Category Breakdown</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ background: isDark ? '#1e293b' : '#fff', border: 'none', borderRadius: 12, fontSize: 13 }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: chartColors.text, fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Line Chart */}
          {data?.monthlyTrend?.length > 0 && (
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Monthly Trend</h2>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.monthlyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="month" tick={{ fill: chartColors.text, fontSize: 11 }} />
                  <YAxis tick={{ fill: chartColors.text, fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Total']}
                    contentStyle={{ background: isDark ? '#1e293b' : '#fff', border: 'none', borderRadius: 12, fontSize: 13 }}
                  />
                  <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: '#0ea5e9', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Recent Transactions</h2>
          <Link to="/expenses" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            View all →
          </Link>
        </div>

        {data?.recentTransactions?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💸</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No expenses yet</p>
            <Link to="/add-expense" className="btn-primary mt-4 inline-flex items-center gap-2">
              <PlusCircle size={16} /> Add your first expense
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data?.recentTransactions?.map(expense => (
              <div key={expense._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${CATEGORY_COLORS[expense.category]}18` }}
                >
                  {getCategoryIcon(expense.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{expense.title}</p>
                  <p className="text-xs text-slate-400">{formatDate(expense.expenseDate)} · {expense.category}</p>
                </div>
                <span className="amount font-semibold text-slate-900 dark:text-white text-sm flex-shrink-0">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
