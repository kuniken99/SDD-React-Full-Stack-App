import React from "react";
import { useEffect, useState } from "react";
import "../../styles/Artist/HomeArtist.css";
import api from "../../api";
import HomeDance from "../../assets/HomeDance.png";
import { FaChevronDown } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";
import { Link, useLocation, useNavigate } from "react-router-dom";

const HomeDirector = () => {
    const location = useLocation();

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await api.get('/api/director-dashboard/');
            setData(response.data);
        } catch (error) {
            console.error("Error fetching director data:", error);
        }
        };

        fetchData();


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
                        <h1>WELCOME DIRECTOR!</h1>

                        <h2>Total Registered Active Artists: {data.total_artists}</h2>
                        <h2>Total Training Sessions: {data.total_sessions}</h2>
                        <h2>Total Hours Logged: {data.total_hours_logged}</h2>
                        <h3>Recent Injury Reports</h3>
                        <p>Ongoing Injuries: {data.ongoing_injuries}</p>
                        <p>Severe Injuries: {data.severe_injuries}</p>
                        <p>Recovering Injuries: {data.recovering_injuries}</p>

                        <h2>Total Registered Active Artists: {data.total_artists}</h2>
                        <h2>Total Training Sessions: {data.total_sessions}</h2>
                        <h2>Total Hours Logged: {data.total_hours_logged}</h2>
                        <h3>Recent Injury Reports</h3>
                        <p>Ongoing Injuries: {data.ongoing_injuries}</p>
                        <p>Severe Injuries: {data.severe_injuries}</p>
                        <p>Recovering Injuries: {data.recovering_injuries}</p>


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
            
        </div>
    );
}

export default HomeDirector;