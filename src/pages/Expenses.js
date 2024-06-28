import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { db, auth } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, arrayUnion, Timestamp, arrayRemove } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../css/Expenses.css";
import ExpensesChart from "./ExpensesChart";
import BudgetChart from "./BudgetChart";



function Expenses() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [tableOpen, setTableOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [newName, setNewName] = useState("");
    const [newValue, setNewValue] = useState(0);
    const [newBudget, setNewBudget] = useState(0);

    const [data, setData] = useState({});
    const [chartData, setChartData] = useState([0, 0, 0, 0, 0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toggleExpense, setToggleExpense] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [output, setOutput] = useState([]);
    const [docid, setDocId] = useState(null);
    const [total, setTotal] = useState(0.0);
    const [totalMonth, setTotalMonthly] = useState(0.0);
    const navigate = useNavigate();
    const categories = ["Food", "Transport", "Utilities", "Entertainment", "Other"];

    // Dynamic collection reference based on email
    const usersRef = email ? collection(db, email) : null;
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const getChart = async () => {
        const out = [0, 0, 0, 0, 0];
        const currDate = new Date();
        for (let i = 0; i < categories.length; i++) {
            if (Array.isArray(data[categories[i]])) {
                out[i] = data[categories[i]].reduce((accumulator, item) => {
                    const [name, value, date] = item.split(": ");
                    const itemDate = new Date(Number(date) * 1000);
                    if (itemDate.getMonth() === currDate.getMonth() && itemDate.getFullYear() === currDate.getFullYear()){
                        return accumulator + Number(value);
                    } else {
                        return accumulator;
                    }
                }, 0.0);
            }
        }
        
        setChartData(out);

    }

    const createExpense = async (name, value, time) => {
        try {
            if (email && selectedCategory) {
                const userDoc = doc(db, email, docid);
                const newFields = { [selectedCategory]: arrayUnion(`${name}: ${value > 0 ? value : 0}: ${time}`)};
                await updateDoc(userDoc, newFields);
                
                // Fetch updated data from Firestore
                await fetchData();
                
                // Refresh category data in the UI
                fetchCategory(selectedCategory);
            }
        } catch (error) {
            console.error("Error creating expense:", error);
            // Handle error as needed
        } finally {

        }
    };

    const deleteExpense = async (index) => {
        try {
            if (email && selectedCategory) {
                const userDoc = doc(db, email, docid);
                const newFields = { [selectedCategory]: arrayRemove(data[selectedCategory][index])};
                await updateDoc(userDoc, newFields);
                await fetchData()
                fetchCategory(selectedCategory);
            }
        } catch (error) {
            console.error("Error creating expense:", error);
        }
        
    };

    const updateExpense = async (index, name, value, time) => {
        if (email) {
            const userDoc = doc(db, email, docid);
            data[selectedCategory][index] = `${name}: ${value}: ${time}`
            const newFields = { [selectedCategory]: data[selectedCategory]};
            await updateDoc(userDoc, newFields);
            fetchCategory(selectedCategory);
        }
    };

    const setBudget = async (sum) => {
        try {
            if (email) {
                const userDoc = doc(db, email, docid);
                const newFields = { Budget: sum};
                await updateDoc(userDoc, newFields);
                await fetchData();
            }
        } catch (error) {
            console.error("Error creating expense:", error);
        }
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const dataRef = await getDocs(usersRef);
            const items = dataRef.docs.map((doc) => ({ ...doc.data(), id: doc.id }))[0];
            setData(items);
            setDocId(items.id);
        } catch (error) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategory = async (key) => {
        try {
            if (!email || !key) {
                setOutput([]);
                setTableOpen(false);
                return;
            }

            if (data[key]) {
                setOutput(data[key]);
            } else {
                setOutput([]);
            }
            setTableOpen(true);
        } catch (error) {
            console.error("Error fetching category data:", error);
            // Handle error as needed
        }
    };
    

    const getTotalExpense = () => {
        let sum = 0.0;
        for (let key in data) {
            if (Array.isArray(data[key])) {
                sum += data[key].reduce((accumulator, item) => {
                    const [name, value, date] = item.split(": ");
                    return accumulator + Number(value);
                }, 0.0);
            }
        }
        return sum;
    };

    const getTotalMonthly = () => {
        const currDate = new Date();
        let sum = 0.0;
        for (let key in data) {
            if (Array.isArray(data[key])) {
                sum += data[key].reduce((accumulator, item) => {
                    const [name, value, date] = item.split(": ");
                    const itemDate = new Date(Number(date) * 1000);
                    if (itemDate.getMonth() === currDate.getMonth() && itemDate.getFullYear() === currDate.getFullYear()){
                        return accumulator + Number(value);
                    } else {
                        return accumulator;
                    }
                }, 0.0);
            }
        }
        return sum;
    };

    
    useEffect(() => {
        const fetchDataAfterAuth = async (currentUser) => {
            if (currentUser) {
                setEmail(currentUser.email);
            } else {
                navigate("/");
            }
        };

        const unsubscribe = onAuthStateChanged(auth, fetchDataAfterAuth);

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    useEffect(() => {
        if (email && Object.keys(data).length > 0){
            const month = getTotalMonthly();
            const year = getTotalExpense();
            setTotalMonthly(month);
            setTotal(year);
            fetchCategory(selectedCategory);
            getChart();
        }
    }, [email, data]);


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

    const logout = async () => {
        await signOut(auth);
        setEmail("");
        navigate('/');
    };

    const refresh = async () => {
        setToggleExpense(true);
        await fetchData();
        await getChart();

    }

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
                        <Link onClick={logout}>Logout</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                )}
                {/* <Link onClick={logout}>Log out</Link>
                <Link to='/SignUp'>Sign Up</Link> */}
                <Link to='/Home'>Home</Link>
            </nav>
            {!toggleExpense && (<button onClick={refresh} className="show-expenses-btn">Show Expenses</button>)}
            {toggleExpense && (<div className="main-content">
                <div className="Budget-container">
                    <h2>Budget</h2>
                    <BudgetChart data={[totalMonth, data["Budget"] - totalMonth > 0 ? data["Budget"] - totalMonth : 0]} />
                    <input
                        type="number"
                        placeholder="Budget..."
                        onChange={(event) => setNewBudget(event.target.value)}
                    />
                    <button onClick={() => {
                        if (newBudget < 0) {
                            alert("Budget cannot be negative.");
                        } else {
                            setBudget(newBudget);
                        }}}>Set Budget</button>
                    <p>Budget: {data["Budget"]}</p>
                </div>

                <div className="Monthly-chart-container">
                    <h2>Monthly Expenses</h2>
                    <ExpensesChart data={chartData} />
                    <p>{email}</p>
                    <p>Total Monthly Expense: {totalMonth}</p>
                    <p>Total Expense: {total}</p>
                </div>


                <div className="Table-container">
                <h3>Select a Category</h3>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
                <button onClick={() => fetchCategory(selectedCategory)}>Search Category</button>
                
                

                {/* Conditional rendering of Add Expense section */}
                {tableOpen && (
                    <>
                        <h3>Add expense</h3>
                        <input
                            placeholder="Name..."
                            onChange={(event) => setNewName(event.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Value..."
                            onChange={(event) => setNewValue(event.target.value)}
                        />
                        <button onClick={() => {
                            if (newValue < 0) {
                                alert("Value cannot be negative.");
                            } else {
                                createExpense(newName, newValue, Timestamp.now().seconds);
                            }}}
                        >Add Expense
                        </button>
                    </>
                )}

                {/* Table to display expenses */}
                {tableOpen && (
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Value</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {output.map((item, index) => {
                                const [name, value, date] = item.split(': ');
                                return (
                                    <tr key={index}>
                                        <td>{name}</td>
                                        <td>{value}</td>
                                        <td>{new Date(Number(date) * 1000).toLocaleDateString('en-US')}</td>
                                        <td>
                                            <button onClick={() => deleteExpense(index)} className="delete-btn">Delete</button>
                                            {/* Add update functionality here if needed */}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                </div>

            </div>)}
        </div>
    );

}

export default Expenses;
