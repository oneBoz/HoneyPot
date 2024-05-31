// // Filename - pages/signup.js
// import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import {db} from "../firebase-config";
// import { 
//   collection, 
//   getDocs,
//   addDoc, 
//   updateDoc, 
//   deleteDoc,
//   doc } from "firebase/firestore";
// import { auth } from "../firebase-config";
// import { useNavigate } from "react-router-dom";
  
// function Home({setIsAuth, email}) {
//     const [newName, setNewName] = useState("");
//     const [newValue, setNewValue] = useState(0);
//     const [expenses, setExpenses] = useState([]);
//     const usersRef = collection(db, email);
//     const [upValue, setUpValue] = useState(0);

//     const createExpense = async () => {
//         await addDoc(usersRef, {name: newName, value: Number(newValue)}) 
//     }

//     const deleteUser = async (id) => {
//         const userDoc = doc(db, email, id);
//         await deleteDoc(userDoc);
//     }

//     const updateExpenses = async (id, value) => {
//         const userDoc = doc(db, email, id);
//         const newFields = {value: value};
//         await updateDoc(userDoc, newFields);
//     }

//     let navigate = useNavigate();

//     useEffect(() => {
//         if (!isAuth) {
//             navigate('/');
//         } else {
//             const getExpenses = async () => {

//                 const data = await getDocs(usersRef);
//                 setExpenses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                
    
//             };
    
//             getExpenses();
//         }
        
        
//     }, []);

//     const logout = async () => {
//         await signOut(auth);
//         setIsAuth(false);
//         setUser(null);
//         setMessage("Logged out successfully.");

//     };
    
//     return (
//         <div>
//             <nav>
//                 <button onClick={logout}>Log out</button>
//                 <Link to='/SignUp'>Sign Up</Link>
//                 <Link to='/Home'>Home</Link>
//             </nav>
//             <div>
//                 <h3>Add expense</h3>
//                 <input 
//                     placeholder="Name..." 
//                     onChange={(event) => {
//                     setNewName(event.target.value);
//                     }}
//                 />
//                 <input 
//                     type="number" 
//                     placeholder="Value..." 
//                     onChange={(event) => {
//                     setNewValue(event.target.value);
//                     }}
//                 />
//                 <button onClick={() => createExpense()}>Add Expense</button>
//                 {expenses.map((expense) => (
//                     <div key={expense.id}>
//                         <h1>Name: {expense.name}</h1>
//                         <h1>Value: {expense.value}</h1>
//                         <input type="number" placeholder="new value" onChange={(event) => setUpValue(event.target.value)} />
//                         <button onClick={() => updateExpenses(expense.id, upValue)}>Change value</button>
//                         <button onClick={() => deleteUser(expense.id)}>Delete Expense</button>
//                     </div>
//                 ))}


//             </div>
//         </div>
//     );
// }
 
// export default Home;

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Home({ setIsAuth, email }) {
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [upValue, setUpValue] = useState(0);
  const navigate = useNavigate();

  // Dynamic collection reference based on email
  const usersRef = collection(db, email);

  const createExpense = async () => {
    if (email) {
      await addDoc(usersRef, { name: newName, value: Number(newValue) });
      fetchExpenses(); // Fetch the updated list of expenses after adding
    }
  };

  const deleteUser = async (id) => {
    if (email) {
      const userDoc = doc(db, email, id);
      await deleteDoc(userDoc);
      fetchExpenses(); // Fetch the updated list of expenses after deleting
    }
  };

  const updateExpenses = async (id, value) => {
    if (email) {
      const userDoc = doc(db, email, id);
      const newFields = { value: Number(value) }; // Ensure value is a number
      await updateDoc(userDoc, newFields);
      fetchExpenses(); // Fetch the updated list of expenses after updating
    }
  };

  const fetchExpenses = async () => {
    if (email) {
      const data = await getDocs(usersRef);
      setExpenses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  useEffect(() => {
    
    fetchExpenses();
    
  }, [email, navigate]);

  const logout = async () => {
    await signOut(auth);
    setIsAuth(false);
    navigate('/');
  };

  return (
    <div>
      <nav>
        <button onClick={logout}>Log out</button>
        <Link to='/SignUp'>Sign Up</Link>
        <Link to='/Home'>Home</Link>
      </nav>
      <div>
        <h3>{email}</h3>
        <h3>Add expense</h3>
        <input
          placeholder="Name..."
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        <input
          type="number"
          placeholder="Value..."
          value={newValue}
          onChange={(event) => setNewValue(event.target.value)}
        />
        <button onClick={createExpense}>Add Expense</button>
        {expenses.map((expense) => (
          <div key={expense.id}>
            <h1>Name: {expense.name}</h1>
            <h1>Value: {expense.value}</h1>
            <input
              type="number"
              placeholder="New value"
              value={upValue}
              onChange={(event) => setUpValue(event.target.value)}
            />
            <button onClick={() => updateExpenses(expense.id, upValue)}>Change Value</button>
            <button onClick={() => deleteUser(expense.id)}>Delete Expense</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
