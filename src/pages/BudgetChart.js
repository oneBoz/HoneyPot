import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const BudgetChart = ({ data }) => {
  const chartRef = useRef(null);

  // Fixed labels for the chart
  const labels = ["Spent", "Left"];

  // Determine background color based on 'Left' value
  const backgroundColor = data[1] === 0 ? ["#ff4444"] : ["#fbc02d", "#ffeb3b"];

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance if it exists to avoid memory leaks
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

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
        cutout: '50%', // Makes the donut hole larger
        animation: false, // Disable animation
      },
    });

    // Save the chart instance to the ref
    chartRef.current.chartInstance = chartInstance;

    // Cleanup function to destroy chart instance on unmount
    return () => {
      chartInstance.destroy();
    };
  }, [data]); // Update chart when data changes

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BudgetChart;
