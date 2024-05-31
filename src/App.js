import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom"
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState("");
  


  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/";
    })
  }
  return (
      <Router>
          
          <Routes>
              <Route path="/" element={<Login setIsAuth={setIsAuth} setEmail={setEmail} />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Home" element={<Home setIsAuth={setIsAuth} email={email}/>} />
          </Routes>
      </Router>
  );
}



export default App;