const apiKey = '4NP7C12K3PHCCBVN';
let investments = JSON.parse(localStorage.getItem('investments')) || [];

document.getElementById('investment-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const ticker = document.getElementById('ticker-symbol').value.toUpperCase();
  const shares = parseInt(document.getElementById('number-of-shares').value);

  if (shares <= 0) {
    alert("Number of shares must be greater than zero.");
    return;
  }

  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`);
    const data = await response.json();
    const price = parseFloat(data['Global Quote']['05. price']);
    const value = price * shares;

    const investment = { ticker, shares, price, value, timestamp: new Date().toLocaleString() };
    investments.push(investment);
    localStorage.setItem('investments', JSON.stringify(investments));
    updateTable();
    updateChart();
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
});

function updateTable() {
  const tbody = document.getElementById('transactions-table').querySelector('tbody');
  tbody.innerHTML = '';
  investments.forEach((investment, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${investment.ticker}</td>
      <td><input type="number" min="1" value="${investment.shares}" onchange="updateShares(${index}, this.value)" /></td>
      <td>$${investment.price.toFixed(2)}</td>
      <td>$${investment.value.toFixed(2)}</td>
      <td>${investment.timestamp}</td>
      <td><button onclick="sellStock(${index})">Sell</button></td>
    `;
    tbody.appendChild(row);
  });
}

function updateShares(index, newShares) {
  newShares = parseInt(newShares);
  if (newShares <= 0) {
    alert("Number of shares must be greater than zero.");
    updateTable();
    return;
  }

  const investment = investments[index];
  investment.shares = newShares;
  investment.value = investment.price * investment.shares;
  localStorage.setItem('investments', JSON.stringify(investments));
  updateTable();
  updateChart();
}

function sellStock(index) {
  investments.splice(index, 1);
  localStorage.setItem('investments', JSON.stringify(investments));
  updateTable();
  updateChart();
}

function updateChart() {
  const ctx = document.getElementById('investment-chart').getContext('2d');
  const labels = investments.map(inv => inv.ticker);
  const data = investments.map(inv => inv.value);

  if (window.investmentChart) {
    window.investmentChart.destroy();
  }

  window.investmentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#ffca28', // Honey gold
          '#ff9800', // Amber
          '#f57c00', // Dark orange
          '#e65100', // Darker orange
          '#ffb74d'  // Light honey
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const investment = investments[tooltipItem.dataIndex];
              return `${investment.ticker}: ${investment.shares} shares, $${investment.value.toFixed(2)}`;
            }
          }
        }
      }
    }
  });
}

function sortTable(column) {
  investments.sort((a, b) => {
    if (column === 'ticker') {
      return a.ticker.localeCompare(b.ticker);
    } else if (column === 'value') {
      return b.value - a.value;
    }
  });
  localStorage.setItem('investments', JSON.stringify(investments));
  updateTable();
}

function filterTable() {
  const filter = document.getElementById('filter-ticker').value.toUpperCase();
  const filteredInvestments = investments.filter(inv => inv.ticker.includes(filter));
  updateFilteredTable(filteredInvestments);
}

function updateFilteredTable(filteredInvestments) {
  const tbody = document.getElementById('transactions-table').querySelector('tbody');
  tbody.innerHTML = '';
  filteredInvestments.forEach((investment, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${investment.ticker}</td>
      <td><input type="number" min="1" value="${investment.shares}" onchange="updateShares(${index}, this.value)" /></td>
      <td>$${investment.price.toFixed(2)}</td>
      <td>$${investment.value.toFixed(2)}</td>
      <td>${investment.timestamp}</td>
      <td><button onclick="sellStock(${index})">Sell</button></td>
    `;
    tbody.appendChild(row);
  });
}
