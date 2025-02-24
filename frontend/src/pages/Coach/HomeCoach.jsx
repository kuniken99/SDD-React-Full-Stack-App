import React, { useEffect, useState } from "react";
import "../../styles/Coach/HomeCoach.css";
import HomeDance from "../../assets/HomeDance.png";
import { Link, useLocation } from "react-router-dom";
import api from "../../api";

const HomeCoach = () => {
    const location = useLocation();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/coach-dashboard/');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching coach data:", error);
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

    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <div className="home">
            {/* Home Section */}
            <section className="hero">
                <div className="section-content">
                    <div className="hero-content">
                        <h1>WELCOME COACH {data.full_name ? data.full_name.toUpperCase() : "COACH"}!</h1>
                        
                        <h2>Total Sessions Conducted: {data.total_sessions}</h2>
                        <h2>Total Hours Logged: {data.total_hours_logged}</h2>
                        <h3>Recent Injury Reports</h3>
                        <p>Total Active Injuries: {data.ongoing_injuries}</p>
                        <p>Severe Injuries: {data.severe_injuries}</p>
                        <p>Recovering Injuries: {data.recovering_injuries}</p>
                        
                        <div className="button-container">
                            <Link to="/add-training" className="cta-button">Add New Training</Link>
                            <Link to="/mark-attendance" className="cta-button">Mark Attendance</Link>
                            <Link to="/add-club-activities" className="cta-button">Add New Club Activities</Link>
                            <Link to="/view-injuries" className="cta-button">View All Injuries</Link>
                        </div>
                    </div>
                    <img src={HomeDance} alt="Dancing Performance" className="hero-image" />
                </div>
            </section>
        </div>
    );
}

export default HomeCoach;