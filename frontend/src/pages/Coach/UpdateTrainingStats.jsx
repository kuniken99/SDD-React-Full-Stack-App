import React, { useState, useEffect } from "react";
import "../../styles/TableStyles.css";
import api from "../../api";

const UpdateTrainingStats = () => {
    const [trainingData, setTrainingData] = useState([]);
    const [artists, setArtists] = useState([]);
    const [newTraining, setNewTraining] = useState({
        date: new Date().toISOString().split('T')[0], // Set default date to today
        session_name: "",
        skills_improved: "",
        performance_rating: "",
        artist_name: "",
        duration: "",
        coach_notes: "",
        coach_name: ""
    });
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "ascending" });

    useEffect(() => {
        fetchTrainingData();
        fetchArtists();
        fetchCoachName();
    }, []);

    const fetchTrainingData = async () => {
        try {
            const response = await api.get("/api/training-sessions/");
            console.log(response.data);
            setTrainingData(response.data);
        } catch (error) {
            console.error("Error fetching training data:", error);
        }
    };

    const fetchArtists = async () => {
        try {
            const response = await api.get("/api/artists/");
            setArtists(response.data);
        } catch (error) {
            console.error("Error fetching artists:", error);
        }
    };

    const fetchCoachName = async () => {
        try {
            const response = await api.get("/api/coach-info/");
            setNewTraining((prevState) => ({
                ...prevState,
                coach_name: response.data.full_name // Set the coach_name in the state
            }));
        } catch (error) {
            console.error("Error fetching coach name:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTraining({ ...newTraining, [name]: value });
    };

    const addTraining = async () => {
        try {
            await api.post("/api/add-training-session/", newTraining);
            fetchTrainingData();
            setNewTraining({
                date: new Date().toISOString().split('T')[0],
                session_name: "",
                skills_improved: "",
                performance_rating: "",
                artist_name: "",
                duration: "",
                coach_notes: "",
                coach_name: newTraining.coach_name
            });
        } catch (error) {
            console.error("Error adding training:", error);
        }
    };

    const sortData = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedTrainingData = [...trainingData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="update-training-stats">
            <h1>Update Artist Training Statistics</h1>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => sortData("id")}>No</th>
                        <th onClick={() => sortData("date")}>Date</th>
                        <th onClick={() => sortData("session_name")}>Session Name</th>
                        <th onClick={() => sortData("artist_name")}>Artist Name</th>
                        <th onClick={() => sortData("skills_improved")}>Skills Improved</th>
                        <th onClick={() => sortData("performance_rating")}>Performance Rating</th>
                        <th onClick={() => sortData("duration")}>Duration</th>
                        <th onClick={() => sortData("coach_notes")}>Coach Notes</th>
                        <th onClick={() => sortData("coach_name")}>Coach Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTrainingData.map((training, index) => (
                        <tr key={training.id}>
                            <td>{index + 1}</td>
                            <td>{new Date(training.date).toLocaleDateString()}</td>
                            <td>{training.session_name}</td>
                            <td>{training.artist_name}</td>
                            <td>{training.skills_improved}</td>
                            <td>{training.performance_rating}</td>
                            <td>{training.duration}</td>
                            <td>{training.coach_notes}</td>
                            <td>{training.coach_name}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Add New Training</h2>
            <input type="date" name="date" value={newTraining.date} onChange={handleInputChange} />
            <input type="text" name="session_name" placeholder="Session Name" value={newTraining.session_name} onChange={handleInputChange} />
            <select name="artist_name" value={newTraining.artist_name} onChange={handleInputChange}>
                <option value="">Select Artist</option>
                {artists.map((artist) => (
                    <option key={artist.id} value={artist.user.full_name}>{artist.user.full_name}</option>
                ))}
            </select>
            <input type="text" name="skills_improved" placeholder="Skills Improved" value={newTraining.skills_improved} onChange={handleInputChange} />
            <input type="number" name="performance_rating" placeholder="Performance Rating" value={newTraining.performance_rating} onChange={handleInputChange} min="0" max="10"  style={{width: '160px'}}/>
            <input type="number" name="duration" placeholder="Duration (minutes)" value={newTraining.duration} onChange={handleInputChange} />
            <textarea name="coach_notes" placeholder="Coach Notes" value={newTraining.coach_notes} onChange={handleInputChange}></textarea>
            <button onClick={addTraining}>Add Training</button>
        </div>
    );
};

export default UpdateTrainingStats;