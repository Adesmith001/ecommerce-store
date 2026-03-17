export type AdminDashboardSummary = {
  lowStockProducts: number;
  pendingOrders: number;
  totalCustomers: number;
  totalOrders: number;
  totalProducts: number;
  totalSales: number;
};

export type AdminChartPoint = {
  label: string;
  orders: number;
  revenue: number;
};

export type AdminRecentOrder = {
  createdAt: string;
  customerName: string;
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  total: number;
};

export type AdminTopProduct = {
  featured: boolean;
  id: string;
  name: string;
  reviewCount: number;
  slug: string;
  stock: number;
};

export type AdminLowStockProduct = {
  id: string;
  name: string;
  sku: string;
  status: string;
  stock: number;
};

export type AdminDashboardData = {
  chartPoints: AdminChartPoint[];
  isUsingFallback: boolean;
  lowStock: AdminLowStockProduct[];
  recentOrders: AdminRecentOrder[];
  summary: AdminDashboardSummary;
  topProducts: AdminTopProduct[];
  warnings: string[];
};

export type AdminAnalyticsRange = "7d" | "30d" | "month";

export type AdminAnalyticsSummary = {
  averageOrderValue: number;
  paidOrders: number;
  repeatCustomers: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
};

export type AdminAnalyticsTimePoint = {
  label: string;
  orders: number;
  revenue: number;
};

export type AdminAnalyticsRankingPoint = {
  label: string;
  orders: number;
  quantity: number;
  revenue: number;
};

export type AdminAnalyticsData = {
  categoryPerformance: AdminAnalyticsRankingPoint[];
  isUsingFallback: boolean;
  range: AdminAnalyticsRange;
  summary: AdminAnalyticsSummary;
  timeline: AdminAnalyticsTimePoint[];
  topProducts: AdminAnalyticsRankingPoint[];
  warnings: string[];
};
