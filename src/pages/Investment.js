// import { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from "react-router-dom";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { db, auth } from "../firebase-config";
// import '../css/Investment.css'; // Assuming the CSS is in Home.css
// import { Chart, registerables } from 'chart.js';
// import { Doughnut } from 'react-chartjs-2';
// import Autosuggest from 'react-autosuggest';
// Chart.register(...registerables);

// const apiKey = '4NP7C12K3PHCCBVN';

// function Investment() {
//   const [email, setEmail] = useState("");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef(null);
//   const navigate = useNavigate();

//   const [ticker, setTicker] = useState('');
//   const [shares, setShares] = useState('');
//   const [investments, setInvestments] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [suggestionsLoading, setSuggestionsLoading] = useState(false);

//   useEffect(() => {
//     if (ticker) {
//       fetch(`https://api.example.com/suggestions?query=${ticker}`)
//         .then(response => response.json())
//         .then(data => {
//           setSuggestions(data);
//           setSuggestionsLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching ticker suggestions:', error);
//           setSuggestionsLoading(false);
//         });
//     }
//   }, [ticker]);

//   const handleAddInvestment = async (event) => {
//     event.preventDefault();

//     if (parseInt(shares) <= 0) {
//       alert('Number of shares must be greater than zero.');
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker.toUpperCase()}&apikey=${apiKey}`
//       );
//       const data = await response.json();
//       const price = parseFloat(data['Global Quote']['05. price']);
//       const value = price * parseInt(shares);

//       const investment = {
//         ticker: ticker.toUpperCase(),
//         shares: parseInt(shares),
//         price,
//         value,
//         timestamp: new Date().toLocaleString(),
//       };

//       setInvestments([...investments, investment]);
//       setTicker('');
//       setShares('');
//     } catch (error) {
//       console.error('Error fetching stock data:', error);
//     }
//   };

//   const updateShares = (index, newShares) => {
//     if (parseInt(newShares) <= 0) {
//       alert('Number of shares must be greater than zero.');
//       return;
//     }

//     const updatedInvestments = investments.map((inv, i) =>
//       i === index
//         ? {
//             ...inv,
//             shares: parseInt(newShares),
//             value: inv.price * parseInt(newShares),
//           }
//         : inv
//     );

//     setInvestments(updatedInvestments);
//   };

//   const sellStock = (index) => {
//     const updatedInvestments = investments.filter((_, i) => i !== index);
//     setInvestments(updatedInvestments);
//   };

//   const chartData = {
//     labels: investments.map((inv) => inv.ticker),
//     datasets: [
//       {
//         data: investments.map((inv) => inv.value),
//         backgroundColor: [
//           '#ffca28', // Honey gold
//           '#ff9800', // Amber
//           '#f57c00', // Dark orange
//           '#e65100', // Darker orange
//           '#ffb74d', // Light honey
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       tooltip: {
//         callbacks: {
//           label: (tooltipItem) => {
//             const investment = investments[tooltipItem.dataIndex];
//             return `${investment.ticker}: ${investment.shares} shares, $${investment.value.toFixed(
//               2
//             )}`;
//           },
//         },
//       },
//     },
//   };

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   useEffect(() => {
//     const checkAuthState = async (currentUser) => {
//       if (currentUser) {
//         setEmail(currentUser.email);
//       } else {
//         navigate("/");
//       }
//     };

//     const unsubscribe = onAuthStateChanged(auth, checkAuthState);

//     return () => {
//       unsubscribe();
//     };
//   }, [navigate]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [menuRef]);

//   const handleLogout = async () => {
//     await signOut(auth);
//     setEmail("");
//     navigate('/');
//   };

//   const handleFeatureClick = (feature) => {
//     navigate(`/${feature}`);
//   };

//   const getSuggestions = (value) => {
//     const inputValue = value.trim().toLowerCase();
//     const inputLength = inputValue.length;

//     return inputLength === 0 ? [] : suggestions.filter(suggestion =>
//       suggestion.symbol.toLowerCase().slice(0, inputLength) === inputValue
//     );
//   };

//   const getSuggestionValue = suggestion => suggestion.symbol;

//   const renderSuggestion = suggestion => (
//     <div>
//       {suggestion.symbol} - {suggestion.name}
//     </div>
//   );

//   const onChange = (event, { newValue }) => {
//     setTicker(newValue);
//   };

//   const onSuggestionsFetchRequested = ({ value }) => {
//     setTicker(value);
//     setSuggestionsLoading(true);
//     fetch(`https://api.example.com/suggestions?query=${value}`)
//       .then(response => response.json())
//       .then(data => {
//         setSuggestions(data);
//         setSuggestionsLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching ticker suggestions:', error);
//         setSuggestionsLoading(false);
//       });
//   };

//   const onSuggestionsClearRequested = () => {
//     setSuggestions([]);
//   };

//   const inputProps = {
//     placeholder: 'Type a ticker symbol',
//     value: ticker,
//     onChange: onChange
//   };

//   return (
//     <div>
//       <nav>
//         {/* Menu Icon */}
//         <div className="menu-icon" onClick={toggleMenu}>
//           &#9776; {/* Unicode for hamburger icon */}
//         </div>

//         {/* Dropdown Menu */}
//         {menuOpen && (
//           <div className="dropdown-menu" ref={menuRef}>
//             <Link to="/">Home</Link>
//             <Link onClick={handleLogout}>Logout</Link>
//             <Link to="/SignUp">Sign Up</Link>
//           </div>
//         )}
//         <Link to='/Home'>Home</Link>
//       </nav>

//       <div className="App">
//         <div className="main-content">
//             <div className="form-container">
//               <h3>Add New Investment</h3>
//               <form onSubmit={handleAddInvestment}>
//                 <label htmlFor="ticker-symbol">Ticker Symbol:</label>
//                 <Autosuggest
//                   suggestions={getSuggestions(ticker)}
//                   onSuggestionsFetchRequested={onSuggestionsFetchRequested}
//                   onSuggestionsClearRequested={onSuggestionsClearRequested}
//                   getSuggestionValue={getSuggestionValue}
//                   renderSuggestion={renderSuggestion}
//                   inputProps={inputProps}
//                 />

//                 <label htmlFor="number-of-shares">Number of Shares:</label>
//                 <input
//                   type="number"
//                   id="number-of-shares"
//                   value={shares}
//                   onChange={(e) => setShares(e.target.value)}
//                   min="1"
//                   required
//                 />

//                 <button type="submit">Add Investment</button>
//               </form>
//             </div>
//             <div className="table-container">
//               <h3>Transactions</h3>
//               <table id="transactions-table">
//                 <thead>
//                   <tr>
//                     <th>Ticker Symbol</th>
//                     <th>Shares</th>
//                     <th>Price</th>
//                     <th>Value</th>
//                     <th>Timestamp</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {investments.map((investment, index) => (
//                     <tr key={index}>
//                       <td>{investment.ticker}</td>
//                       <td>
//                         <input
//                           type="number"
//                           min="1"
//                           value={investment.shares}
//                           onChange={(e) => updateShares(index, e.target.value)}
//                         />
//                       </td>
//                       <td>${investment.price.toFixed(2)}</td>
//                       <td>${investment.value.toFixed(2)}</td>
//                       <td>{investment.timestamp}</td>
//                       <td>
//                         <button onClick={() => sellStock(index)}>Sell</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="chart-container">
//               <h3>Investment Distribution</h3>
//               <Doughnut data={chartData} options={chartOptions} />
//             </div>
//           </div>
//         </div>

//     </div>
//   );
// }

// export default Investment;

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase-config";
import '../css/Investment.css'; // Assuming the CSS is in Home.css
import { Chart, registerables } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash.debounce';
Chart.register(...registerables);

const apiKey = '4NP7C12K3PHCCBVN';

function Investment() {
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [investments, setInvestments] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // useEffect(() => {
  //   if (ticker) {
  //     setSuggestionsLoading(true);
  //     fetch(`https://api.example.com/suggestions?query=${ticker}`)
  //       .then(response => response.json())
  //       .then(data => {
  //         setSuggestions(data);
  //         setSuggestionsLoading(false);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching ticker suggestions:', error);
  //         setSuggestionsLoading(false);
  //       });
  //   }
  // }, [ticker]);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const checkAuthState = async (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
      } else {
        navigate("/");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, checkAuthState);

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = async () => {
    await signOut(auth);
    setEmail("");
    navigate('/');
  };

  const handleFeatureClick = (feature) => {
    navigate(`/${feature}`);
  };

  const fetchStockData = debounce((value) => {
    if (value.trim()) {
      fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          const suggestions = data.bestMatches || []; // Adjust based on API response
          setSuggestions(suggestions);
          setSuggestionsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching stock data:', error);
          setSuggestionsLoading(false);
        });
    } else {
      setSuggestions([]);
      setSuggestionsLoading(false);
    }
  }, 300); // Debounce delay
  
  const onSuggestionsFetchRequested = ({ value }) => {
    setTicker(value);
    setSuggestionsLoading(true);
    fetchStockData(value);
  };
  
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : suggestions.filter(suggestion =>
      suggestion['1. symbol'].toLowerCase().slice(0, inputLength) === inputValue
    );
  };
  
  const getSuggestionValue = suggestion => suggestion['1. symbol'];
  
  const renderSuggestion = suggestion => (
    <div>
      {suggestion['1. symbol']} - {suggestion['2. name']}
    </div>
  );
  
  const inputProps = {
    placeholder: 'Type a ticker symbol',
    value: ticker,
    onChange: (event, { newValue }) => setTicker(newValue),
  };

  return (
    <div>
      <nav>
        {/* Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          &#9776; {/* Unicode for hamburger icon */}
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="dropdown-menu" ref={menuRef}>
            <Link to="/">Home</Link>
            <Link onClick={handleLogout}>Logout</Link>
          </div>
        )}
        <Link to='/Home'>Home</Link>
      </nav>

      <div className="App">
        <div className="main-content">
            <div className="form-container">
              <h3>Add New Investment</h3>
              <form onSubmit={handleAddInvestment}>
                <label htmlFor="ticker-symbol">Ticker Symbol:</label>
                <Autosuggest
                  suggestions={getSuggestions(ticker)}
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
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

    </div>
  );
}

export default Investment;
