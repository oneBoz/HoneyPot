// export default BudgetChart;

import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

/**
 * BudgetChart component displays a doughnut chart representing budget data.
 *
 * @param {Object} props - Component properties.
 * @param {Array<number>} props.data - Array containing spent and remaining budget values.
 * @returns {JSX.Element} A rendered chart component.
 */
const BudgetChart = ({ data }) => {
  const chartRef = useRef(null);

  // Labels for the chart
  const labels = ["Spent", "Left"];

  // Background color based on remaining budget
  const backgroundColor = data[1] === 0 ? ["#ff4444"] : ["#fbc02d", "#ffeb3b"];

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance to avoid memory leaks
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    // Create a new chart instance
    const chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Budget Data',
            data: data,
            backgroundColor: backgroundColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%', // Larger donut hole
        animation: false, // Disable animation for immediate updates
      },
    });

    // Save the chart instance to the ref for potential future reference
    chartRef.current.chartInstance = chartInstance;

    // Cleanup function to destroy chart instance on unmount
    return () => {
      chartInstance.destroy();
    };
  }, [data]); // Effect depends on 'data' changes

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BudgetChart;
