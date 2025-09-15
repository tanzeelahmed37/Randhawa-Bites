import React, { useState, useCallback, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useOrder } from '../contexts/OrderContext';
import { Order, Category } from '../types';

// Define the shape of our dashboard data
interface DashboardData {
  stats: {
    revenue: { value: string; change: string; isPositive: boolean; changeText: string };
    orders: { value: string; change: string; isPositive: boolean; changeText: string };
    avgOrderValue: { value: string; change: string; isPositive: boolean; changeText: string };
    newCustomers: { value: string; change: string; isPositive: boolean; changeText: string };
  };
  salesData: { name: string; sales: number }[];
  categoryData: { name: string; value: number }[];
  salesChartLabel: string;
}

const zeroData: DashboardData = {
    stats: {
        revenue: { value: 'Rs 0', change: '', isPositive: true, changeText: '' },
        orders: { value: '0', change: '', isPositive: true, changeText: '' },
        avgOrderValue: { value: 'Rs 0', change: '', isPositive: true, changeText: '' },
        newCustomers: { value: '0', change: '', isPositive: true, changeText: '' },
    },
    salesData: [],
    categoryData: [],
    salesChartLabel: 'Sales Report'
};

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day of week
  return new Date(d.setDate(diff));
};

const processOrderData = (
  orders: Order[],
  range: 'daily' | 'week' | 'month' | 'custom',
  dates?: { start: string; end: string }
): DashboardData => {
  if (orders.length === 0) return zeroData;

  const now = new Date();
  let filteredOrders: Order[] = [];

  switch (range) {
    case 'daily':
      filteredOrders = orders.filter(o => isSameDay(new Date(o.timestamp), now));
      break;
    case 'week': {
      const startOfWeek = getStartOfWeek(now);
      startOfWeek.setHours(0, 0, 0, 0);
      filteredOrders = orders.filter(o => new Date(o.timestamp) >= startOfWeek);
      break;
    }
    case 'month':
      filteredOrders = orders.filter(o =>
        new Date(o.timestamp).getMonth() === now.getMonth() &&
        new Date(o.timestamp).getFullYear() === now.getFullYear()
      );
      break;
    case 'custom':
      if (dates?.start && dates?.end) {
        const startDate = new Date(dates.start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dates.end);
        endDate.setHours(23, 59, 59, 999);
        filteredOrders = orders.filter(o => {
          const orderDate = new Date(o.timestamp);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }
      break;
  }

  if (filteredOrders.length === 0) return zeroData;

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const stats = {
    revenue: { value: `Rs ${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, change: '', isPositive: false, changeText: '' },
    orders: { value: `${totalOrders}`, change: '', isPositive: false, changeText: '' },
    avgOrderValue: { value: `Rs ${avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, change: '', isPositive: false, changeText: '' },
    newCustomers: { value: `${totalOrders}`, change: '', isPositive: false, changeText: '' },
  };

  let salesData: { name: string; sales: number }[] = [];
  let salesChartLabel = 'Sales Report';

  if (range === 'daily') {
    salesChartLabel = "Today's Sales by Hour";
    const salesByHour: { [hour: number]: number } = {};
    for (const order of filteredOrders) {
      const hour = new Date(order.timestamp).getHours();
      salesByHour[hour] = (salesByHour[hour] || 0) + order.total;
    }
    salesData = Array.from({ length: 24 }, (_, i) => ({
      name: `${i.toString().padStart(2, '0')}:00`,
      sales: salesByHour[i] || 0,
    }));
  } else {
    salesChartLabel = 'Sales by Day';
    const salesByDay: { [day: string]: number } = {};
    for (const order of filteredOrders) {
      const day = new Date(order.timestamp).toLocaleDateString('en-CA');
      salesByDay[day] = (salesByDay[day] || 0) + order.total;
    }
    salesData = Object.keys(salesByDay).sort().map(day => ({
      name: day,
      sales: salesByDay[day],
    }));
  }

  const categorySales: { [key in Category]?: number } = {};
  for (const order of filteredOrders) {
    for (const item of order.items) {
      categorySales[item.category] = (categorySales[item.category] || 0) + item.price * item.quantity;
    }
  }
  const categoryData = Object.entries(categorySales).map(([name, value]) => ({ name, value: value || 0 }));

  return { stats, salesData, categoryData, salesChartLabel };
};

const StatCard: React.FC<{ title: string; value: string; change: string; isPositive: boolean; changeText: string }> = ({ title, value, change, isPositive, changeText }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{value}</p>
        {change && <div className={`text-sm flex items-center mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isPositive ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />}
            </svg>
            <span>{change} {changeText}</span>
        </div>}
    </div>
);

const ChartLoader: React.FC = () => (
    <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Processing data...</span>
    </div>
);

const DashboardView: React.FC = () => {
    type DateRange = 'daily' | 'week' | 'month' | 'custom';
    const [range, setRange] = useState<DateRange>('week');
    const [customDates, setCustomDates] = useState({ start: '', end: '' });
    const [appliedCustomDates, setAppliedCustomDates] = useState({ start: '', end: '' });
    const { isDashboardReset, setIsDashboardReset, completedOrders } = useOrder();
    const [dateError, setDateError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<DashboardData>(zeroData);

    useEffect(() => {
        // If the reset flag is set, immediately set data to zero and stop.
        // This takes precedence over any data processing.
        if (isDashboardReset) {
            setData(zeroData);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // This timeout ensures the UI has a chance to render the loading state
        // before the potentially blocking data processing logic runs.
        const processTimeout = setTimeout(() => {
            const datesToUse = range === 'custom' ? appliedCustomDates : undefined;
            if (range === 'custom' && (!datesToUse?.start || !datesToUse?.end)) {
                setData(zeroData);
                setIsLoading(false);
                return;
            }

            const processedData = processOrderData(completedOrders, range, datesToUse);
            setData(processedData);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(processTimeout);
    }, [completedOrders, range, appliedCustomDates, isDashboardReset]);


    const handleRangeChange = (newRange: DateRange) => {
        setIsDashboardReset(false);
        setRange(newRange);
        if (newRange !== 'custom') {
            setDateError(null);
        }
    };

    const handleApplyCustomRange = () => {
        setDateError(null);
        if (customDates.start && customDates.end && new Date(customDates.start) > new Date(customDates.end)) {
            setDateError("Start date cannot be after end date.");
            setAppliedCustomDates({ start: '', end: '' });
            return;
        }
        setIsDashboardReset(false);
        setAppliedCustomDates(customDates);
    };

    const handleReset = useCallback(() => {
        setIsDashboardReset(true);
        setRange('week');
        setCustomDates({ start: '', end: '' });
        setAppliedCustomDates({ start: '', end: '' });
        setDateError(null);
    }, [setIsDashboardReset]);

    const downloadCSV = useCallback(() => {
        if (!data.salesData || data.salesData.length === 0) return;
        
        const headers = ['Date/Time', 'Sales'];
        const csvHeader = headers.join(',') + '\n';
        const csvRows = data.salesData.map(row => 
            `"${row.name}",${row.sales}`
        ).join('\n');
        
        const csvContent = csvHeader + csvRows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sales-report-${range}${range === 'custom' ? `-${customDates.start}-to-${customDates.end}` : ''}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [data.salesData, range, customDates]);
    
    const { stats, salesData, categoryData, salesChartLabel } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex flex-wrap items-center gap-2">
            <select
                value={range}
                onChange={(e) => handleRangeChange(e.target.value as DateRange)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                aria-label="Select date range for sales data"
                disabled={isLoading}
            >
                <option value="daily">Daily</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom</option>
            </select>
            {range === 'custom' && (
              <>
                <input type="date" name="start" value={customDates.start} onChange={(e) => setCustomDates(p => ({...p, start: e.target.value}))} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" disabled={isLoading} />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input type="date" name="end" value={customDates.end} onChange={(e) => setCustomDates(p => ({...p, end: e.target.value}))} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-1.5 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" disabled={isLoading} />
                <button onClick={handleApplyCustomRange} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={isLoading}>Apply</button>
              </>
            )}
            <button onClick={handleReset} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50" disabled={isLoading}>Reset View</button>
            <button onClick={downloadCSV} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 disabled:opacity-50" disabled={!salesData || salesData.length === 0 || isLoading}>Download CSV</button>
        </div>
      </div>
      {dateError && <p className="text-red-500 text-sm -mt-4">{dateError}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={stats.revenue.value} change={stats.revenue.change} isPositive={stats.revenue.isPositive} changeText={stats.revenue.changeText} />
        <StatCard title="Total Orders" value={stats.orders.value} change={stats.orders.change} isPositive={stats.orders.isPositive} changeText={stats.orders.changeText} />
        <StatCard title="Average Order Value" value={stats.avgOrderValue.value} change={stats.avgOrderValue.change} isPositive={stats.avgOrderValue.isPositive} changeText={stats.avgOrderValue.changeText} />
        <StatCard title="New Customers" value={stats.newCustomers.value} change={stats.newCustomers.change} isPositive={stats.newCustomers.isPositive} changeText={stats.newCustomers.changeText} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{salesChartLabel}</h2>
            {isLoading ? <ChartLoader /> : salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)"/>
                    <XAxis dataKey="name" tick={{ fill: '#9ca3af' }}/>
                    <YAxis tick={{ fill: '#9ca3af' }} tickFormatter={(value) => `Rs ${value / 1000}k`} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                            borderColor: '#4b5563',
                            borderRadius: '0.5rem' 
                        }}
                        labelStyle={{ color: '#d1d5db' }}
                        formatter={(value: number) => `Rs ${value.toLocaleString()}`}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>No sales data to display for the selected period.</p>
                </div>
            )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Sales by Category</h2>
             {isLoading ? <ChartLoader /> : categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128, 128, 128, 0.2)"/>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af' }} width={100} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(31, 41, 55, 0.8)',
                            borderColor: '#4b5563',
                            borderRadius: '0.5rem' 
                        }}
                        labelStyle={{ color: '#d1d5db' }}
                        formatter={(value: number) => `Rs ${value.toLocaleString()}`}
                    />
                    <Bar dataKey="value" name="Sales" fill="#818cf8" radius={[0, 4, 4, 0]} />
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <p>No category data to display.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;