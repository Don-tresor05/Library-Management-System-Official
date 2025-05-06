import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export const PieChart = ({ data }) => {
  const pieData = {
    labels: ['Borrows', 'Returns'],
    datasets: [{
      data: [
        data.datasets?.[0]?.data?.reduce((a, b) => a + b, 0) || 0,
        data.datasets?.[1]?.data?.reduce((a, b) => a + b, 0) || 0
      ],
      backgroundColor: ['#4f46e5', '#10b981']
    }]
  };

  return <Pie data={pieData} />;
};