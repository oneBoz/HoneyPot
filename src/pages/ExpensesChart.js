import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const ExpensesChart = ({ data }) => {
  const chartRef = useRef(null);

  // Fixed labels and corresponding colors for each category
  const labels = ["Food", "Transport", "Utilities", "Entertainment", "Other"];
  const colors = ["#fbc02d", "#ffeb3b", "#ffca28", "#ffd54f", "#ffe082"];

  // Filter out data with value 0
  const filteredData = data.filter(value => value > 0);
  const filteredLabels = labels.filter((_, index) => data[index] > 0);
  const filteredColors = colors.filter((_, index) => data[index] > 0);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance if it exists to avoid memory leaks
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    const chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: filteredLabels,
        datasets: [
          {
            label: 'Budget Data',
            data: filteredData,
            backgroundColor: filteredColors,
            borderColor: filteredColors.map(color => {
              // Slightly darken the border color
              return color.replace('ff', 'aa').replace('ee', 'bb');
            }),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%', // Makes the donut hole larger
        animation: false,
      },
    });

    // Save the chart instance to the ref
    chartRef.current.chartInstance = chartInstance;

    // Cleanup function to destroy chart instance on unmount
    return () => {
      chartInstance.destroy();
    };
  }, [filteredData, filteredLabels, filteredColors]);

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ExpensesChart;
