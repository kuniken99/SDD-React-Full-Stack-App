import React from "react";
import { useEffect } from "react";
import "../../styles/Artist/HomeArtist.css";

import HomeDance from "../../assets/HomeDance.png";
import TeamBuilding from "../../assets/TeamBuilding.png";
import DanceWorkshops from "../../assets/DanceWorkshops.png";
import InjuryPrevention from "../../assets/InjuryPrevention.png";
import { FaChevronDown } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import { Link, useLocation, useNavigate } from "react-router-dom";

const HomeArtist = () => {
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
                        <h1>WELCOME ARTIST!</h1>
                        <p>Are you Directors and Coaches? Unleash the capability of keeping records of training and performance data of artists.</p>
                        
                    </div>
                    <img src={HomeDance} alt="Dancing Performance" className="hero-image" />
                </div>

                {/* Downward Arrow to Scroll to How It Works */}
                <ScrollLink to="how-it-works" className="scroll-down">
                    <FaChevronDown className="down-arrow" />
                </ScrollLink>
            </section>
            
            {/* Club Activities Section */}
            <section id="how-it-works" className="how-it-works">
                <div className="section-content">
                    <h2>Club Activities</h2>
                    <p className="section-subtext">The club includes various activities to keep artists engaged and improve their skills.</p>

                    <div className="steps-container">
                        <div className="step">
                            <img src={TeamBuilding} alt="Team-Building" className="step-icon" />
                            <h3>Team-Building</h3>
                        </div>

                        <div className="step">
                            <img src={DanceWorkshops} alt="Dance & Performance Workshops" className="step-icon" />
                            <h3>Dance & Performance Workshops</h3>
                        </div>


                        <div className="step">
                            <img src={InjuryPrevention} alt="Injury Prevention Sessions" className="step-icon" />
                            <h3>Injury Prevention Sessions</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomeArtist;