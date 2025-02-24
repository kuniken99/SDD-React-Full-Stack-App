import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const RecordInjuries = () => {
    const [injuries, setInjuries] = useState([]);
    const [artistInfo, setArtistInfo] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newInjury, setNewInjury] = useState({
        injury_date: new Date().toISOString().split('T')[0],
        injury_type: "",
        severity: "Moderate",
    });

    useEffect(() => {
        const fetchInjuryData = async () => {
            try {
                const response = await api.get("/api/artist-injuries/");
                setInjuries(response.data.injuries);
                setArtistInfo(response.data.artist);
            } catch (error) {
                console.error("Error fetching injury data:", error);
            }
        };

        fetchInjuryData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInjury({ ...newInjury, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/artist-injuries/", newInjury);
            setShowForm(false);
            setNewInjury({
                injury_date: new Date().toISOString().split('T')[0],
                injury_type: "",
                severity: "Moderate",
            });
            fetchInjuryData();
        } catch (error) {
            console.error("Error adding new injury:", error);
        }
    };

    if (!artistInfo) return <p>Loading artist info...</p>;

    return (
        <div className="injuries-page">
            <h1>Injury Records for {artistInfo.full_name}</h1>
            <p>Total Injuries: {injuries.length}</p>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Date</th>
                            <th>Injury Type</th>
                            <th>Severity</th>
                            <th>Coach Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {injuries.map((injury, index) => (
                            <tr key={injury.id}>
                                <td>{index + 1}</td>
                                <td>{injury.injury_date}</td>
                                <td>{injury.injury_type}</td>
                                <td>{injury.severity}</td>
                                <td>{injury.coach_remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={() => setShowForm(true)} className="cta-button">Add New Injury</button>
            {showForm && (
                <div className="form-popup">
                    <form onSubmit={handleSubmit}>
                        <label>
                            Injury Date:
                            <input type="date" name="injury_date" value={newInjury.injury_date} onChange={handleInputChange} />
                        </label>
                        <label>
                            Injury Type:
                            <input type="text" name="injury_type" value={newInjury.injury_type} onChange={handleInputChange} />
                        </label>
                        <label>
                            Severity:
                            <select name="severity" value={newInjury.severity} onChange={handleInputChange}>
                                <option value="Moderate">Moderate</option>
                                <option value="Severe">Severe</option>
                                <option value="Mild">Mild</option>
                            </select>
                        </label>
                        <button type="submit" className="cta-button">Submit</button>
                        <button type="button" onClick={() => setShowForm(false)} className="cta-button">Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RecordInjuries;