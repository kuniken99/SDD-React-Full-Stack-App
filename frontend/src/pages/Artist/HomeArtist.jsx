import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api";
import "../../styles/Artist/HomeArtist.css";

import HomeDance from "../../assets/HomeDance.png";
import TeamBuilding from "../../assets/TeamBuilding.png";
import DanceWorkshops from "../../assets/DanceWorkshops.png";
import InjuryPrevention from "../../assets/InjuryPrevention.png";
import { FaChevronDown } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

const HomeArtist = () => {
    const [artistInfo, setArtistInfo] = useState(null);
    const location = useLocation();
    const [user, setUser] = useState({ fullName: "" });
    const [injuries, setInjuries] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtistData = async () => {
          try {
            const response = await api.get("/api/artist-info/");  // Make GET request to the endpoint
            console.log(response.data);  // Log response data
            setArtistInfo(response.data);  // Set the received artist data
          } catch (err) {
            setError(err.response?.data || "Failed to fetch artist info");
            console.error("Error fetching artist info:", err);  // Log any error that occurs
          }
        };
    
        fetchArtistData();

        if (location.hash) {
            setTimeout(() => {
                const sectionId = location.hash.replace("#", "");
                document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [location]);

    if (!artistInfo) return <p>Loading artist info...</p>;

    return (
        <div className="homeArtist">
            <section className="hero">
                <div className="section-content">
                    <div className="hero-content">
                        <h1>WELCOME, {artistInfo.full_name.toUpperCase()}!</h1>
                        
                        
                        
                        <p className="attendance">Attendance Rate: {artistInfo.attendance_rate}% <Link to="/ViewAttendance" className="view-more">View More</Link></p>
                        <div className="hero-buttons">
                            <Link to="/view-club-activities" className="btn-primary">View Club Activities</Link>
                            <Link to="/record-injuries" className="btn-secondary">+ Report New Injury</Link>
                        </div>

                        <div className="recent-training">
                            <h3>Recent Training Sessions</h3>
                            <div className="training-item">
                                <p><strong>Session Name:</strong> Hip-Hop Freestyle</p>
                                <p><strong>Coach:</strong> John Doe</p>
                                <p><strong>Status:</strong> Present</p>
                            </div>
                            <Link to="/view-training-sessions" className="btn-primary">View All Trainings</Link>
                        </div>
                    </div>
                    <img src={HomeDance} alt="Dancing Performance" className="hero-image" />
                </div>
                <ScrollLink to="how-it-works" className="scroll-down">
                    <FaChevronDown className="down-arrow" />
                </ScrollLink>
            </section>

            <section id="how-it-works" className="how-it-works">
                <div className="section-content">
                    <h2>Club Activities</h2>
                    <p className="section-subtext">The club includes various activities to keep artists engaged and improve their skills.</p>
                    <div className="steps-container">
                        <div className="step">
                            <img src={TeamBuilding} alt="Team-Building" className="step-icon large" />
                            <h3>Team-Building</h3>
                        </div>
                        <div className="step">
                            <img src={DanceWorkshops} alt="Dance & Performance Workshops" className="step-icon large" />
                            <h3>Dance & Performance Workshops</h3>
                        </div>
                        <div className="step">
                            <img src={InjuryPrevention} alt="Injury Prevention Sessions" className="step-icon large" />
                            <h3>Injury Prevention Sessions</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeArtist;
