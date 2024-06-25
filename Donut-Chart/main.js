// main.js

const ctx = document.querySelector('.my-chart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'doughnut', // Change to a donut chart
  data: {
    labels: ['Spent', 'Left'],
    datasets: [{
      label: 'Budget',
      data: [65, 35], // Example data
      backgroundColor: ['#fbc02d', '#ffeb3b'], // Honey colors
      borderColor: '#e65100', // Darker honey color for border
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 50 // Makes the donut hole larger
  }
});
