const Expense = require('../models/Expense');

// @desc    Get dashboard data
// @route   GET /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Total expenses (all time)
    const totalResult = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Monthly expenses
    const monthlyResult = await Expense.aggregate([
      { $match: { userId, expenseDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Recent transactions (last 5)
    const recentTransactions = await Expense.find({ userId })
      .sort({ expenseDate: -1 })
      .limit(5);

    // Category-wise breakdown
    const categoryBreakdown = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyTrend = await Expense.aggregate([
      { $match: { userId, expenseDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$expenseDate' },
            month: { $month: '$expenseDate' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format monthly trend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedTrend = monthlyTrend.map(item => ({
      month: `${months[item._id.month - 1]} ${item._id.year}`,
      total: item.total,
      count: item.count
    }));

    res.json({
      totalExpenses: totalResult[0]?.total || 0,
      totalCount: totalResult[0]?.count || 0,
      monthlyExpenses: monthlyResult[0]?.total || 0,
      monthlyCount: monthlyResult[0]?.count || 0,
      recentTransactions,
      categoryBreakdown,
      monthlyTrend: formattedTrend
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };
