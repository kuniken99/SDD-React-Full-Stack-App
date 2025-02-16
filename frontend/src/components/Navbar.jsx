import { Link, useLocation, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useEffect } from "react";
import "../styles/Navbar.css";
import DanceLahLogo from "../assets/DanceLahLogo.png";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    // Function to handle navigation & scrolling
    const handleNavigation = (section) => {
        if (location.pathname !== "/") {
            navigate(`/#${section}`);  // Redirects to Home with the hash
        } else {
            document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
        }
    };
    
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={DanceLahLogo} alt="DanceLah Logo" className="logo-image" />
                </Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <ScrollLink to="/" onClick={(e) => { e.preventDefault(); handleNavigation("how-it-works"); }}>How it works</ScrollLink>
                <ScrollLink to="/" onClick={(e) => { e.preventDefault(); handleNavigation("why-choose-us"); }}>Why Choose Us</ScrollLink>
                <ScrollLink to="/" onClick={(e) => { e.preventDefault(); handleNavigation("testimonials"); }}>Testimonials</ScrollLink>
                <span className="separator">|</span>
            </div>
            <div className="navbar-buttons">
                <Link to="/login" className="login">Log In</Link>
                <Link to="/register" className="signup">Sign Up</Link>
            </div>
        </nav>
    );
}

export default Navbar;