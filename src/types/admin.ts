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
