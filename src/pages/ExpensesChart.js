// export default ExpensesChart;
import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

/**
 * ExpensesChart component displays a doughnut chart representing expense data.
 * 
 * @param {Object} props - Component properties.
 * @param {Array<number>} props.data - Array of expense values for each category.
 * @returns {JSX.Element} A rendered chart component.
 */
const ExpensesChart = ({ data }) => {
  // Reference to the chart canvas
  const chartRef = useRef(null);

  // Labels and colors for the categories
  const labels = ["Food", "Transport", "Utilities", "Entertainment", "Other"];
  const colors = ["#fbc02d", "#ffeb3b", "#ffca28", "#ffd54f", "#ffe082"];

  // Filter out zero values and corresponding labels/colors
  const filteredData = data.filter(value => value > 0);
  const filteredLabels = labels.filter((_, index) => data[index] > 0);
  const filteredColors = colors.filter((_, index) => data[index] > 0);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy existing chart instance to avoid memory leaks
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    // Create a new chart instance
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
              // Darken the border color for better visibility
              return darkenColor(color, 0.2);
            }),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%', // Larger donut hole
        animation: false,
      },
    });

    // Save the chart instance to the reference
    chartRef.current.chartInstance = chartInstance;

    // Cleanup function to destroy chart instance on unmount
    return () => {
      chartInstance.destroy();
    };
  }, [filteredData, filteredLabels, filteredColors]);

  /**
   * Darkens a given color by a specified percentage.
   * 
   * @param {string} color - The original color in hexadecimal format.
   * @param {number} percent - The percentage to darken the color by (0 to 1).
   * @returns {string} - The darkened color in hexadecimal format.
   */
  const darkenColor = (color, percent) => {
    const f = parseInt(color.slice(1), 16),
          t = percent < 0 ? 0 : 255,
          p = percent < 0 ? percent * -1 : percent,
          R = f >> 16,
          G = (f >> 8) & 0x00FF,
          B = f & 0x0000FF;
    return "#" + (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    ).toString(16).slice(1);
  };

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ExpensesChart;
