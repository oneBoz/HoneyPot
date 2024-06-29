import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase-config";
import '../css/Home.css'; // Assuming the CSS is in Home.css

function Investment() {
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
            <Link to="/SignUp">Sign Up</Link>
          </div>
        )}
        <Link onClick={handleLogout}>Log out</Link>
        <Link to='/SignUp'>Sign Up</Link>
        <Link to='/Home'>Home</Link>
      </nav>

    </div>
  );
}

export default Investment;
