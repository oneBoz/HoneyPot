import React, { useState } from 'react';
import './App.css';
import { Chart, registerables } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
Chart.register(...registerables);

const apiKey = '4NP7C12K3PHCCBVN';

function App() {
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [investments, setInvestments] = useState([]);

  const handleAddInvestment = async (event) => {
    event.preventDefault();

    if (parseInt(shares) <= 0) {
      alert('Number of shares must be greater than zero.');
      return;
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker.toUpperCase()}&apikey=${apiKey}`
      );
      const data = await response.json();
      const price = parseFloat(data['Global Quote']['05. price']);
      const value = price * parseInt(shares);

      const investment = {
        ticker: ticker.toUpperCase(),
        shares: parseInt(shares),
        price,
        value,
        timestamp: new Date().toLocaleString(),
      };

      setInvestments([...investments, investment]);
      setTicker('');
      setShares('');
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const updateShares = (index, newShares) => {
    if (parseInt(newShares) <= 0) {
      alert('Number of shares must be greater than zero.');
      return;
    }

    const updatedInvestments = investments.map((inv, i) =>
      i === index
        ? {
            ...inv,
            shares: parseInt(newShares),
            value: inv.price * parseInt(newShares),
          }
        : inv
    );

    setInvestments(updatedInvestments);
  };

  const sellStock = (index) => {
    const updatedInvestments = investments.filter((_, i) => i !== index);
    setInvestments(updatedInvestments);
  };

  const chartData = {
    labels: investments.map((inv) => inv.ticker),
    datasets: [
      {
        data: investments.map((inv) => inv.value),
        backgroundColor: [
          '#ffca28', // Honey gold
          '#ff9800', // Amber
          '#f57c00', // Dark orange
          '#e65100', // Darker orange
          '#ffb74d', // Light honey
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const investment = investments[tooltipItem.dataIndex];
            return `${investment.ticker}: ${investment.shares} shares, $${investment.value.toFixed(
              2
            )}`;
          },
        },
      },
    },
  };

  return (
    <div className="App">
      <header className="banner">
        <div className="header-content">
          <button className="back-button" onClick={() => window.history.back()}>
            Back
          </button>
          <h2 className="page-heading">Investment Tracker</h2>
        </div>
      </header>
      <div className="main-content">
        <div className="form-container">
          <h3>Add New Investment</h3>
          <form onSubmit={handleAddInvestment}>
            <label htmlFor="ticker-symbol">Ticker Symbol:</label>
            <input
              type="text"
              id="ticker-symbol"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              required
            />

            <label htmlFor="number-of-shares">Number of Shares:</label>
            <input
              type="number"
              id="number-of-shares"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              min="1"
              required
            />

            <button type="submit">Add Investment</button>
          </form>
        </div>
        <div className="table-container">
          <h3>Transactions</h3>
          <table id="transactions-table">
            <thead>
              <tr>
                <th>Ticker Symbol</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Value</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment, index) => (
                <tr key={index}>
                  <td>{investment.ticker}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={investment.shares}
                      onChange={(e) => updateShares(index, e.target.value)}
                    />
                  </td>
                  <td>${investment.price.toFixed(2)}</td>
                  <td>${investment.value.toFixed(2)}</td>
                  <td>{investment.timestamp}</td>
                  <td>
                    <button onClick={() => sellStock(index)}>Sell</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="chart-container">
          <h3>Investment Distribution</h3>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default App;
