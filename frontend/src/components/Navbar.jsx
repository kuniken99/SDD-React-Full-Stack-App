import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import "../styles/Navbar.css";
import DanceLahLogo from "../assets/DanceLahLogo.png";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={DanceLahLogo} alt="DanceLah Logo" className="logo-image" />
                </Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <ScrollLink to="how-it-works" smooth={true} duration={50}>How it Works?</ScrollLink>
                <ScrollLink to="pricing" smooth={true} duration={50}>Pricing</ScrollLink>
                <ScrollLink to="why-choose-us" smooth={true} duration={50}>Why Choose Us?</ScrollLink>
                <ScrollLink to="testimonial" smooth={true} duration={50}>Testimonials</ScrollLink>
            </div>
            <div className="navbar-buttons">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </nav>
    );
}

export default Navbar;