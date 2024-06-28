
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Expenses from "./pages/Expenses";
import News from "./pages/News";
import Investment from "./pages/Investment"


function App() {

  return (
      <Router>
          
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Expenses" element={<Expenses />} />
              <Route path="/Budget" element={<News />} />
              <Route path="/Investment" element={<Investment />} />
          </Routes>
      </Router>
  );
}



export default App;