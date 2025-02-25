import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./Components/ui/Theme"; // Import the theme
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Expenses from "./pages/Expenses";
import News from "./pages/News";
import Investment from "./pages/Investment";

/**
 * Main application component for managing routes.
 *
 * @component
 * @returns {JSX.Element} The rendered application.
 */
function App() {
    return (
        <ThemeProvider theme={theme}>  {/* Apply MUI theme */}
            <CssBaseline />  {/* Normalize styles */}
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Expenses" element={<Expenses />} />
                    <Route path="/News" element={<News />} />
                    <Route path="/Investment" element={<Investment />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
