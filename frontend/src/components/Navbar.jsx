import { Link, useLocation, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";
import DanceLahLogo from "../assets/DanceLahLogo.png";
import ProfilePic from "../assets/ProfilePic.png";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [role, setRole] = useState(null);

    // Get role from localStorage on mount
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        console.log("Stored role:", storedRole); // Debugging
        setRole(storedRole);
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("role");
        navigate("/"); // Redirect to home
        window.location.reload(); // Reload to update navbar
    };

    // Navigation & scrolling handler
    const handleNavigation = (section) => {
        if (location.pathname !== "/") {
            navigate(`/#${section}`);
        } else {
            document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar-logo">
                <Link to="/">
                    <img src={DanceLahLogo} alt="DanceLah Logo" className="logo-image" />
                </Link>
            </div>

            {/* Navbar Links Based on Role */}
            <div className="navbar-links">
                <Link to="/" onClick={scrollToTop}>Home</Link>

                {/* Unregistered User Links */}
                {!role && (
                    <>
                        <ScrollLink to="/" onClick={(e) => { e.preventDefault(); handleNavigation("how-it-works"); }}>How it works</ScrollLink>
                        <ScrollLink to="/" onClick={(e) => { e.preventDefault(); handleNavigation("why-choose-us"); }}>Why Choose Us</ScrollLink>
                        <ScrollLink to="/" onClick={(e) => { e.preventDefault(); handleNavigation("testimonials"); }}>Testimonials</ScrollLink>
                    </>
                )}

                {/* Artist Links */}
                {role === "artist" && (
                    <>
                        <Link to="/view-attendance">View Attendance</Link>
                        <Link to="/view-club-activities">View Club Activities</Link>
                        <Link to="/record-injuries">Record Injury</Link>
                    </>
                )}

                {/* Coach Links */}
                {role === "coach" && (
                    <>
                        <Link to="/update-training">Update Training Statistics</Link>
                        <Link to="/mark-attendance">Mark Attendance</Link>
                        <Link to="/manage-injuries">Manage Injuries</Link>
                    </>
                )}

                {/* Director Links */}
                {role === "director" && (
                    <>
                        <Link to="/manage-artists">Manage Artists</Link>
                        <Link to="/club-activities">Create Club Activities</Link>
                        <Link to="/track-injuries">Track Injuries Record</Link>
                    </>
                )}

                <span className="separator">|</span>
            </div>

            {/* Navbar Buttons */}
            <div className="navbar-buttons">
                {/* Unregistered User: Show Login & Sign Up */}
                {!role ? (
                    <>
                        <Link to="/login" className="login">Log In</Link>
                        <Link to="/register" className="signup">Sign Up</Link>
                    </>
                ) : (
                    <>
                        {/* Profile Icon (Placeholder) */}
                        <Link to="/profile">
                            <img src={ProfilePic} alt="Profile" className="profile-icon" />
                        </Link>
                        {/* Logout Button */}
                        <button onClick={handleLogout} className="logout">Log Out</button>
                    </>
                )}
            </div>
        </nav>
    );
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export default Navbar;
