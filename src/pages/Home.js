import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import '../css/Home.css'; // Assuming the CSS is in Home.css

function Home() {
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
      <header>
        <h1>HoneyPot Financial Planning</h1>
      </header>

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
            <Link to="/signup">Sign Up</Link>
          </div>
        )}
        {/* <Link onClick={handleLogout}>Log out</Link>
        <Link to='/SignUp'>Sign Up</Link> */}
        <Link to='/Home'>Home</Link>
      </nav>

      <div className="container">
        <section className="content">
          <h1>Welcome to HoneyPot</h1>
          <p>Empowering you to take control of your finances and achieve your financial goals.</p>

          <button className="feature" id="budgeting" aria-label="Budgeting feature" onClick={() => handleFeatureClick('Budget')}>
            <h2>Financial News</h2>
            <p>Enrich your financial understanding</p>
          </button>

          <button className="feature" id="expenses" aria-label="Expenses feature" onClick={() => handleFeatureClick('Expenses')}>
            <h2>Expenses</h2>
            <p>Log and categorize your expenses to understand your spending habits.</p>
          </button>

          <button className="feature" id="investments" aria-label="Investments feature" onClick={() => handleFeatureClick('Investment')}>
            <h2>Investments</h2>
            <p>Monitor the performance of your investment portfolios.</p>
            <p>(Coming soon)</p>
          </button>
        </section>
      </div>
    </div>
  );
}

export default Home;

