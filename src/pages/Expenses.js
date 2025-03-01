// import { onAuthStateChanged } from "firebase/auth";
// import { Link } from "react-router-dom";
// import { useState, useEffect, useRef } from 'react';
// import { db, auth } from "../firebase-config";
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, arrayUnion, Timestamp, arrayRemove } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import "../css/Expenses.css";
// import ExpensesChart from "./ExpensesChart";
// import BudgetChart from "./BudgetChart";
//
// /**
//  * Expenses component manages and displays user expenses and budget.
//  */
// function Expenses() {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [tableOpen, setTableOpen] = useState(false);
//     const [email, setEmail] = useState("");
//     const [newName, setNewName] = useState("");
//     const [newValue, setNewValue] = useState(0);
//     const [newDate, setNewDate] = useState('');
//     const [newBudget, setNewBudget] = useState(0);
//
//     const [month, setMonth] = useState(new Date().getMonth().toString().padStart(2, '0'));
//     const [year, setYear] = useState(new Date().getFullYear().toString());
//     const [data, setData] = useState({});
//     const [chartData, setChartData] = useState([0, 0, 0, 0, 0]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [toggleExpense, setToggleExpense] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [currCategory, setCurrCategory] = useState("");
//
//     const [output, setOutput] = useState([]);
//     const [docid, setDocId] = useState(null);
//     const [total, setTotal] = useState(0.0);
//     const [totalMonth, setTotalMonthly] = useState(0.0);
//     const navigate = useNavigate();
//     const categories = ["Food", "Transport", "Utilities", "Entertainment", "Other"];
//
//     // Dynamic collection reference based on email
//     const usersRef = email ? collection(db, email) : null;
//     const menuRef = useRef(null);
//
//     /**
//      * Toggles the visibility of the menu.
//      */
//     const toggleMenu = () => {
//         setMenuOpen(!menuOpen);
//     };
//
//     /**
//      * Fetches and sets the chart data for the current month.
//      */
//     const getChart = async (yr, mth) => {
//         const out = [0, 0, 0, 0, 0];
//         const currDate = new Date(yr, mth);
//         for (let i = 0; i < categories.length; i++) {
//             if (Array.isArray(data[categories[i]])) {
//                 out[i] = data[categories[i]].reduce((accumulator, item) => {
//                     const [name, value, date] = item.split(": ");
//                     const itemDate = new Date(Number(date) * 1000);
//                     if (itemDate.getMonth() === currDate.getMonth() && itemDate.getFullYear() === currDate.getFullYear()) {
//                         return accumulator + Number(value);
//                     } else {
//                         return accumulator;
//                     }
//                 }, 0.0);
//             }
//         }
//         setChartData(out);
//     };
//
//     /**
//      * Creates a new expense entry for the selected category.
//      * @param {string} name - Name of the expense.
//      * @param {number} value - Value of the expense.
//      * @param {number} time - Timestamp of the expense.
//      */
//     const createExpense = async (name, value, time) => {
//         try {
//             if (email && selectedCategory) {
//                 const userDoc = doc(db, email, docid);
//                 const newFields = { [selectedCategory]: arrayUnion(`${name}: ${value > 0 ? value : 0}: ${time}`) };
//                 await updateDoc(userDoc, newFields);
//
//                 await fetchData();
//                 fetchCategory(selectedCategory);
//             }
//         } catch (error) {
//             console.error("Error creating expense:", error);
//         }
//     };
//
//     /**
//      * Deletes an expense entry for the selected category.
//      * @param {number} index - Index of the expense to delete.
//      */
//     const deleteExpense = async (index) => {
//         try {
//             if (email && selectedCategory) {
//                 const userDoc = doc(db, email, docid);
//                 const newFields = { [selectedCategory]: arrayRemove(data[selectedCategory][index]) };
//                 await updateDoc(userDoc, newFields);
//                 await fetchData();
//                 fetchCategory(selectedCategory);
//             }
//         } catch (error) {
//             console.error("Error deleting expense:", error);
//         }
//     };
//
//     /**
//      * Updates an existing expense entry for the selected category.
//      * @param {number} index - Index of the expense to update.
//      * @param {string} name - Updated name of the expense.
//      * @param {number} value - Updated value of the expense.
//      * @param {number} time - Updated timestamp of the expense.
//      */
//     const updateExpense = async (index, name, value, time) => {
//         if (email) {
//             const userDoc = doc(db, email, docid);
//             data[selectedCategory][index] = `${name}: ${value}: ${time}`;
//             const newFields = { [selectedCategory]: data[selectedCategory] };
//             await updateDoc(userDoc, newFields);
//             fetchCategory(selectedCategory);
//         }
//     };
//
//     /**
//      * Sets the budget value for the user.
//      * @param {number} sum - The budget value to set.
//      */
//     const setBudget = async (sum) => {
//         try {
//             if (email) {
//                 const userDoc = doc(db, email, docid);
//                 const newFields = { Budget: sum };
//                 await updateDoc(userDoc, newFields);
//                 await fetchData();
//             }
//         } catch (error) {
//             console.error("Error setting budget:", error);
//         }
//     };
//
//     /**
//      * Fetches user data from the Firestore and sets the state.
//      */
//     const fetchData = async () => {
//         setLoading(true);
//         setError(null);
//
//         try {
//             const dataRef = await getDocs(usersRef);
//             const items = dataRef.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0];
//             setData(items);
//             setDocId(items.id);
//         } catch (error) {
//             setError("Failed to fetch data");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     /**
//      * Fetches data for the selected category and sets the state.
//      * @param {string} key - The category key to fetch data for.
//      */
//     const fetchCategory = async (key) => {
//         try {
//             setCurrCategory(key);
//             if (!email || !key) {
//                 setOutput([]);
//                 setTableOpen(false);
//                 return;
//             }
//
//             if (data[key]) {
//                 setOutput(data[key].reverse());
//
//             } else {
//                 setOutput([]);
//             }
//             setTableOpen(true);
//         } catch (error) {
//             console.error("Error fetching category data:", error);
//         }
//     };
//
//     /**
//      * Calculates the total expense from the data.
//      * @returns {number} - The total expense value.
//      */
//     const getTotalExpense = () => {
//         let sum = 0.0;
//         for (let key in data) {
//             if (Array.isArray(data[key])) {
//                 sum += data[key].reduce((accumulator, item) => {
//                     const [name, value, date] = item.split(": ");
//                     return accumulator + Number(value);
//                 }, 0.0);
//             }
//         }
//         return sum;
//     };
//
//     /**
//      * Calculates the total monthly expense from the data.
//      * @returns {number} - The total monthly expense value.
//      */
//     const getTotalMonthly = (yr, mth) => {
//         const currDate = new Date(yr, mth);
//         let sum = 0.0;
//         for (let key in data) {
//             if (Array.isArray(data[key])) {
//                 sum += data[key].reduce((accumulator, item) => {
//                     const [name, value, date] = item.split(": ");
//                     const itemDate = new Date(Number(date) * 1000);
//                     if (itemDate.getMonth() === currDate.getMonth() && itemDate.getFullYear() === currDate.getFullYear()) {
//                         return accumulator + Number(value);
//                     } else {
//                         return accumulator;
//                     }
//                 }, 0.0);
//             }
//         }
//         return sum;
//     };
//
//     useEffect(() => {
//         const fetchDataAfterAuth = async (currentUser) => {
//             if (currentUser) {
//                 setEmail(currentUser.email);
//             } else {
//                 navigate("/");
//             }
//         };
//
//         const unsubscribe = onAuthStateChanged(auth, fetchDataAfterAuth);
//
//         return () => {
//             unsubscribe();
//         };
//     }, [navigate]);
//
//     useEffect(() => {
//         if (email && Object.keys(data).length > 0) {
//             const mthlyExpense = getTotalMonthly(year, month);
//             const totalExpense = getTotalExpense();
//             setTotalMonthly(mthlyExpense);
//             setTotal(totalExpense);
//             fetchCategory(selectedCategory);
//             getChart(year, month);
//         }
//     }, [email, data, year, month]);
//
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (menuRef.current && !menuRef.current.contains(event.target)) {
//                 setMenuOpen(false);
//             }
//         };
//
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [menuRef]);
//
//     /**
//      * Logs the user out and redirects to the home page.
//      */
//     const logout = async () => {
//         await signOut(auth);
//         setEmail("");
//         navigate('/');
//     };
//
//     /**
//      * Refreshes the data and chart.
//      */
//     const refresh = async () => {
//         setToggleExpense(true);
//         await fetchData();
//         await getChart(year, month);
//     };
//
//
//
//     const handleMonthChange = (event) => {
//         setMonth(event.target.value);
//     };
//
//     const handleYearChange = (event) => {
//         setYear(event.target.value);
//     };
//
//     const handleSubmit = (yr, mth) => {
//         getChart(yr, mth);
//         setTotalMonthly(mth);
//     }
//     return (
//         <div>
//             <nav>
//                 {/* Menu Icon */}
//                 <div className="menu-icon" onClick={toggleMenu}>
//                     &#9776; {/* Unicode for hamburger icon */}
//                 </div>
//
//                 {/* Dropdown Menu */}
//                 {menuOpen && (
//                     <div className="dropdown-menu" ref={menuRef}>
//                         <Link to="/">Home</Link>
//                         <Link onClick={logout}>Logout</Link>
//                     </div>
//                 )}
//                 <Link to='/Home'>Home</Link>
//             </nav>
//             {!toggleExpense && (<button onClick={refresh} className="show-expenses-btn">Show Expenses</button>)}
//             {toggleExpense && (
//                 <div className="main-content">
//
//                     <div className="date-container">
//                         <h2>Set Month and Year</h2>
//                         <p>   </p>
//                         <select value={month} onChange={handleMonthChange}>
//                             <option value="00">January</option>
//                             <option value="01">February</option>
//                             <option value="02">March</option>
//                             <option value="03">April</option>
//                             <option value="04">May</option>
//                             <option value="05">June</option>
//                             <option value="06">July</option>
//                             <option value="07">August</option>
//                             <option value="08">September</option>
//                             <option value="09">October</option>
//                             <option value="10">November</option>
//                             <option value="11">December</option>
//                         </select>
//                         <input
//                             type="number"
//                             value={year}
//                             onChange={handleYearChange}
//                             placeholder="Year"
//                             min="1900"
//                             max="2100"
//                         />
//
//                     </div>
//                     <div className="Budget-container">
//                         <h2>Budget</h2>
//                         <BudgetChart data={[totalMonth, data["Budget"] - totalMonth > 0 ? data["Budget"] - totalMonth : 0]} />
//                         <p> </p>
//                         <input
//                             type="number"
//                             placeholder="Budget..."
//                             onChange={(event) => setNewBudget(event.target.value)}
//                         />
//                         <button onClick={() => {
//                             if (newBudget < 0) {
//                                 alert("Budget cannot be negative.");
//                             } else if (newBudget === 0 || !newBudget) {
//                                 alert("Please insert a budget");
//                             } else {
//                                 setBudget(newBudget);
//                             }
//                         }}>Set Budget</button>
//                         <p>Budget: {data["Budget"]}</p>
//                     </div>
//
//                     <div className="Monthly-chart-container">
//                         <h2>Monthly Expenses 0{parseInt(month)+1}/{year}</h2>
//                         <ExpensesChart data={chartData} />
//                         <p>{email}</p>
//                         <p>Total Monthly Expense: {totalMonth}</p>
//                         <p>Total Expense: {total}</p>
//                     </div>
//
//                     <div className="Table-container">
//                         <h3>Select a Category</h3>
//                         <select
//                             value={selectedCategory}
//                             onChange={(e) => setSelectedCategory(e.target.value)}
//                         >
//                             <option value="" disabled>Select Category</option>
//                             {categories.map((category, index) => (
//                                 <option key={index} value={category}>{category}</option>
//                             ))}
//                         </select>
//                         <button onClick={() => fetchCategory(selectedCategory)}>Search Category</button>
//
//                         {/* Conditional rendering of Add Expense section */}
//                         {tableOpen && (
//                             <>
//                                 <p> </p>
//                                 <h3>Add expense</h3>
//                                 <input
//                                     placeholder="Name..."
//                                     required
//                                     onChange={(event) => setNewName(event.target.value)}
//                                 />
//                                 <input
//                                     type="number"
//                                     placeholder="Value..."
//                                     required
//                                     onChange={(event) => setNewValue(event.target.value)}
//                                 />
//                                 <input
//                                     type="date"
//                                     required
//                                     onChange={(event) => setNewDate(event.target.value)}
//                                 />
//                                 <button onClick={() => {
//                                     if (!newName) {
//                                         alert("Please input a name");
//                                     } else if (!newValue || newValue === 0) {
//                                         alert("Please insert a value");
//                                     } else if (newValue < 0) {
//                                         alert("Value cannot be negative.");
//                                     } else if (!newDate) {
//                                         createExpense(newName, newValue, Timestamp.now().seconds);
//                                     } else {
//                                         const timestamp = Timestamp.fromDate(new Date(newDate));
//                                         createExpense(newName, newValue, timestamp.seconds + Timestamp.now().seconds%10000);
//                                     }
//                                 }}>Add Expense
//                                 </button>
//                                 <p> </p>
//                                 <h3>{currCategory}</h3>
//                             </>
//                         )}
//
//                         {/* Table to display expenses */}
//                         {tableOpen && (
//                             <div className="table-wrapper">
//                                 <table className="expense-table">
//                                     <thead>
//                                         <tr>
//                                             <th>Name</th>
//                                             <th>Value</th>
//                                             <th>Date</th>
//                                             <th>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {output.map((item, index) => {
//                                             const [name, value, date] = item.split(': ');
//                                             return (
//                                                 <tr key={index}>
//                                                     <td>{name}</td>
//                                                     <td>{value}</td>
//                                                     <td>{new Date(Number(date) * 1000).toLocaleDateString('en-US')}</td>
//                                                     <td>
//                                                         <button onClick={() => deleteExpense(index)} className="delete-btn">Delete</button>
//                                                         {/* Add update functionality here if needed */}
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default Expenses;

import {Box, Typography} from "@mui/material";

export default function Expenses() {
    return (
        <Box>
            <Typography
                level = "h1"
            >
                Coming soon..
            </Typography>
        </Box>
    )
}