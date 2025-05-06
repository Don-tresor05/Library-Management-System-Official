import React from 'react';
import { BarChart } from './BarChart'; // Assuming you have a BarChart component


export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500">Chart rendering failed</div>;
    }
    return this.props.children;
  }
}

// Wrap your charts
// Define chartData before using it
const chartData = [
  { name: 'Category A', value: 30 },
  { name: 'Category B', value: 70 },
];

<ErrorBoundary>
  <BarChart data={chartData} />
</ErrorBoundary>