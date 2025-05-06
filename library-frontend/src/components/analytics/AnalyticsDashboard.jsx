import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Spin } from 'antd';
import { 
  BookOutlined, 
  UserOutlined, 
  SwapOutlined 
} from '@ant-design/icons';

import { BarChart } from './BarChart';
import { PieChart } from './PieChart'; 
import { RecentActivityTable } from './RecentActivityTable';
import { 
  bookService, 
  userService, 
  loanService,
  activityLogService 
} from '../../services/api';

const { RangePicker } = DatePicker;

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeUsers: 0,
    activeLoans: 0
  });
  const [timeRange, setTimeRange] = useState([null, null]);
  const [chartData, setChartData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const exportToCSV = () => {
    // Implement CSV export logic
  };

  

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [booksRes, usersRes, loansRes, activityRes] = await Promise.all([
        bookService.getAllBooks().catch(e => ({ data: [] })), // Fallback if fails
        userService.getAllUsers().catch(e => ({ data: [] })),
        loanService.getActiveLoans().catch(e => ({ data: [] })),
        activityLogService.getActivityLogs().catch(e => ({ data: [] }))
      ]);
  
      setStats({
        totalBooks: booksRes?.data?.length || 0,
        activeUsers: usersRes?.data?.length || 0,
        activeLoans: loansRes?.data?.length || 0
      });
  
      prepareChartData(activityRes?.data || []);
      setRecentActivity(activityRes?.data?.slice(0, 10) || []);
      
    } catch (error) {
      console.error("Dashboard error:", error);
      if (error.response?.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (activityData = []) => {
    const dailyCounts = {};
    
    // Handle empty/undefined data
    if (!activityData || !Array.isArray(activityData)) {
      setChartData({
        labels: [],
        datasets: [
          { label: 'Borrows', data: [], backgroundColor: '#4f46e5' },
          { label: 'Returns', data: [], backgroundColor: '#10b981' }
        ]
      });
      return;
    }
  
    // Process data
    activityData.forEach(log => {
      if (!log?.timestamp) return;
      const date = new Date(log.timestamp).toLocaleDateString();
      if (!dailyCounts[date]) {
        dailyCounts[date] = { borrow: 0, return: 0 };
      }
      if (log.actionType === 'BORROW') dailyCounts[date].borrow++;
      if (log.actionType === 'RETURN') dailyCounts[date].return++;
    });
  
    const dates = Object.keys(dailyCounts).sort();
    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Borrows',
          data: dates.map(date => dailyCounts[date]?.borrow || 0),
          backgroundColor: '#4f46e5'
        },
        {
          label: 'Returns',
          data: dates.map(date => dailyCounts[date]?.return || 0),
          backgroundColor: '#10b981'
        }
      ]
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Library Analytics</h1>
        <RangePicker 
          onChange={dates => setTimeRange(dates)}
          style={{ width: 300 }}
        />
      </div>

      {loading ? (
        <Spin size="large" className="flex justify-center mt-10" />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              icon={<BookOutlined />}
              title="Total Books"
              value={stats.totalBooks}
              color="bg-blue-100 text-blue-800"
            />
            <StatCard 
              icon={<UserOutlined />}
              title="Active Users"
              value={stats.activeUsers}
              color="bg-purple-100 text-purple-800"
            />
            <StatCard 
              icon={<SwapOutlined />}
              title="Active Loans"
              value={stats.activeLoans}
              color="bg-green-100 text-green-800"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card title="Daily Activity" className="shadow-sm">
              <BarChart data={chartData} />
            </Card>
            <Card title="Action Distribution" className="shadow-sm">
              <PieChart data={chartData} />
            </Card>
          </div>

          {/* Recent Activity */}
          <Card title="Recent Activity" className="shadow-sm">
            <RecentActivityTable data={recentActivity} />
          </Card>
        </>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <Card className="shadow-sm">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        {React.cloneElement(icon, { className: 'text-xl' })}
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

export default AnalyticsDashboard;