import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/PublicFooter.css";
import DanceLahLogo from "../assets/DanceLahLogo.png";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function PublicFooter() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (sectionId) => {
        if (location.pathname !== "/") {
            navigate(`/#${sectionId}`); // Navigate to Home with hash
        } else {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }
    };


    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Left Section - Logo and Vision */}
                <div className="footer-left">
                    <img src={DanceLahLogo} alt="DanceLah Logo" className="footer-logo" />
                    <p className="footer-vision">
                        Our vision is to provide convenience and help increase the artists’ productivity.
                    </p>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaFacebookF />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaTwitter />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaInstagram />
                        </a>
                    </div>
                </div>

                {/* Middle Section - Contact Info */}
                <div className="footer-contact">
                    <h4>Contact</h4>
                    <p>
                        <a href="https://maps.app.goo.gl/rwoRpfYAGfp487ed9" style={{ textDecoration: 'none' }}>📍</a> 6 Raffles Blvd, #03-200, Singapore 039594
                    </p>
                    <p>
                        <a href="mailto:support@dancelah.com" style={{ textDecoration: 'none' }}>📧</a> support@dancelah.com
                    </p>
                </div>

                {/* Right Section - About and Social Links */}
                <div className="footer-links">
                    <h4>About</h4>
                    <Link to="/" onClick={(e) => { e.preventDefault(); handleNavigation("how-it-works"); }}>How it works</Link>
                    <Link to="/" onClick={(e) => { e.preventDefault(); handleNavigation("why-choose-us"); }}>Why Choose Us</Link>
                    <Link to="/FAQ">FAQs</Link>
                    <Link to="/CompanyInfo">Company Information</Link>
                </div>

                <div className="footer-links">
                    <h4>Socials</h4>
                    <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                </div>
            </div>

            {/* Bottom Section - Copyright & Policies */}
            <div className="footer-bottom">
                <p>©2025 DanceLah, Inc. All rights reserved.</p>
                <div className="footer-policy">
                    <Link to="/PrivacyPolicy">Privacy & Policy</Link>
                    <span>|</span>
                    <Link to="/TermsCondition">Terms & Condition</Link>
                </div>
            </div>
        </footer>
    );
}

export default PublicFooter;
