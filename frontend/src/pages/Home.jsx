import React from "react";
import { useEffect } from "react";
import "../styles/Home.css";
import HomeDance from "../assets/HomeDance.png";
import WhyChooseUs from "../assets/WhyChooseUs.png";
import { FaChevronDown } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HowItWorksIcon1 from "../assets/HowItWorksIcon1.png";
import HowItWorksIcon2 from "../assets/HowItWorksIcon2.png";
import HowItWorksIcon3 from "../assets/HowItWorksIcon3.png";
import HowItWorksLine from "../assets/HowItWorksLine.png";
import IconPerformance from "../assets/IconPerformance.png";
import IconSecure from "../assets/IconSecure.png";
import IconAttendance from "../assets/IconAttendance.png";

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                const sectionId = location.hash.replace("#", "");
                document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            }, 100); // Small delay ensures section is rendered before scrolling
        }
    }, [location]);

    return (
        <div className="home">
            {/* Home Section */}
            <section className="hero">
                <div className="section-content">
                    <div className="hero-content">
                        <h1>DANCELAH!</h1>
                        <p>Are you Directors and Coaches? Unleash the capability of keeping records of training and performance data of artists.</p>
                        <Link to="/register" className="cta-button">Try Now</Link>
                        
                    </div>
                    <img src={HomeDance} alt="Dancing Performance" className="hero-image" />
                </div>

                {/* Downward Arrow to Scroll to How It Works */}
                <ScrollLink to="how-it-works" className="scroll-down">
                    <FaChevronDown className="down-arrow" />
                </ScrollLink>
            </section>
            
            {/* How It Works Section */}
            <section id="how-it-works" className="how-it-works">
                <div className="section-content">
                    <h2>How It Works?</h2>
                    <p className="section-subtext">See the advantages of an efficient, secure, and insightful web application.</p>

                    <div className="steps-container">
                        <div className="step">
                            <img src={HowItWorksIcon1} alt="Choose Number of Artists" className="step-icon" />
                            <h3>Choose Number of Artists</h3>
                            <p>Create an account as a Director, Coach, or Artist.</p>
                        </div>

                        <img src={HowItWorksLine} alt="Connector Line" className="step-line" />

                        <div className="step">
                            <img src={HowItWorksIcon2} alt="Input Performance Data" className="step-icon" />
                            <h3>Input Performance Data</h3>
                            <p>Manage your records. Add performance stats, update attendance, and track injuries.</p>
                        </div>

                        <img src={HowItWorksLine} alt="Connector Line" className="step-line" />

                        <div className="step">
                            <img src={HowItWorksIcon3} alt="View Artist Insights" className="step-icon" />
                            <h3>View Artist Insights</h3>
                            <p>Analyze your reports. Based on the insights, schedule training and organize events.</p>
                        </div>
                    </div>

                    <Link to="/register" className="cta-button">Try Now</Link>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section id="why-choose-us" className="why-choose-us">
            <div className="section-content">

            <div className="container">
                <h2>Why Choose Us?</h2>
                <p className="section-subtext">Keep track of your journey with seamless data management and real-time updates. Say goodbye to paperwork and hello to efficiency.</p>
                <div className="content">
                    {/* Left Side - Image */}
                    <div className="image-container">
                        <img src={WhyChooseUs} alt="Why Choose Us" />
                    </div>

                    {/* Right Side - Features */}
                    <div className="features">
                        <div className="feature">
                            <img src={IconPerformance} alt="Performance Tracking" className="feature-icon" />
                            <div>
                                <h3>Performance Tracking</h3>
                                <p>Store and analyze training and performance data of multiple Artists.</p>
                            </div>
                        </div>

                        <div className="feature">
                            <img src={IconSecure} alt="Secure Website" className="feature-icon" />
                            <div>
                                <h3>Secure Website</h3>
                                <p>A structured approach was applied during the development process to ensure a secure design.</p>
                            </div>
                        </div>

                        <div className="feature">
                            <img src={IconAttendance} alt="Attendance & Injury Records" className="feature-icon" />
                            <div>
                                <h3>Attendance & Injury Records</h3>
                                <p>Real-time tracking of artist participation and health. Get insightful information as a Director to make impactful decisions.</p>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
                <Link to="/register" className="cta-button">Try Now</Link>
        </section>

            
            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials">
                <div className="section-content">
                    <h2>Trusted by Thousands of Happy Customers</h2>
                    <p className="section-subtext">"Don't just take our word for it—hear what our users have to say! Join thousands of satisfied performers and coaches who trust our platform."</p>
                    
                    <div className="testimonial-card">
                        <div class="review-container">
                            <span class="review-name">Ethan Wei Jie</span>
                            <span class="review-location">Singapore</span>
                            <span class="review-rating">⭐ 4.5</span>
                        </div>
                        <p>
                            "Wow... I am very happy to use this performance dance app, it turned out to be more than my 
                            expectations and so far there have been no problems. DanceLah is always the best."
                        </p>
                    </div>
                </div>
                <Link to="/register" className="cta-button">Try Now</Link>
            </section>
        </div>
    );
}

export default Home;