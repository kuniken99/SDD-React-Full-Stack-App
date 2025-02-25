import React, { useState, useEffect } from "react";
import "../../styles/TableStyles.css";
import api from "../../api";

const ManageInjuries = () => {
    const [injuries, setInjuries] = useState([]);
    const [artists, setArtists] = useState([]);
    const [newInjury, setNewInjury] = useState({ date: "", artist: "", injury_type: "", severity: "", coach_remarks: "" });
    const [editInjuryId, setEditInjuryId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "ascending" });

    useEffect(() => {
        fetchInjuries();
        fetchArtists();
    }, []);

    const fetchInjuries = async () => {
        try {
            const response = await api.get('/api/manage-injuries/');
            setInjuries(response.data);
        } catch (error) {
            console.error("Error fetching injuries:", error);
        }
    };

    const fetchArtists = async () => {
        try {
            const response = await api.get('/api/artists/');
            setArtists(response.data);
        } catch (error) {
            console.error("Error fetching artists:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInjury({ ...newInjury, [name]: value });
    };

    const addInjury = async () => {
        try {
            await api.post('/api/manage-injuries/', newInjury);
            fetchInjuries();
            setNewInjury({ date: "", artist: "", injury_type: "", severity: "", coach_remarks: "" });
        } catch (error) {
            console.error("Error adding injury:", error);
        }
    };

    const editInjury = async (id) => {
        try {
            const response = await api.get('/api/manage-injuries/');
            const injury = response.data.find(injury => injury.id === id);
            setNewInjury(injury);
            setEditInjuryId(id);
        } catch (error) {
            console.error("Error fetching injury:", error);
        }
    };

    const updateInjury = async () => {
        try {
            await api.put('/api/manage-injuries/', { ...newInjury, id: editInjuryId });
            fetchInjuries();
            setNewInjury({ date: "", artist: "", injury_type: "", severity: "", coach_remarks: "" });
            setEditInjuryId(null);
        } catch (error) {
            console.error("Error updating injury:", error);
        }
    };

    const deleteInjury = async (id) => {
        try {
            await api.delete('/api/manage-injuries/', { data: { id } });
            fetchInjuries();
        } catch (error) {
            console.error("Error deleting injury:", error);
        }
    };

    const sortData = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedInjuries = [...injuries].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    return (
        <div className="manage-injuries">
            <h1>Manage Artist Injuries</h1>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => sortData("id")}>No</th>
                        <th onClick={() => sortData("date")}>Date</th>
                        <th onClick={() => sortData("artist_name")}>Artist Name</th>
                        <th onClick={() => sortData("injury_type")}>Injury Type</th>
                        <th onClick={() => sortData("severity")}>Severity</th>
                        <th onClick={() => sortData("coach_remarks")}>Coach Remarks</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedInjuries.map((injury, index) => (
                        <tr key={injury.id}>
                            <td>{index + 1}</td>
                            <td>{injury.date}</td>
                            <td>{injury.artist_name}</td>
                            <td>{injury.injury_type}</td>
                            <td>{injury.severity}</td>
                            <td>{injury.coach_remarks}</td>
                            <td>
                                <button onClick={() => editInjury(injury.id)}>Edit</button>
                                <button onClick={() => deleteInjury(injury.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>{editInjuryId ? "Edit Injury" : "Add New Injury"}</h2>
            <input type="date" name="date" value={newInjury.date} onChange={handleInputChange} />
            <select name="artist" value={newInjury.artist} onChange={handleInputChange}>
                <option value="">Select Artist</option>
                {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>{artist.user.full_name}</option>
                ))}
            </select>
            <input type="text" name="injury_type" placeholder="Injury Type" value={newInjury.injury_type} onChange={handleInputChange} />
            <select name="severity" value={newInjury.severity} onChange={handleInputChange}>
                <option value="">Select Severity</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
            </select>
            <textarea name="coach_remarks" placeholder="Coach Remarks" value={newInjury.coach_remarks} onChange={handleInputChange}></textarea>
            <button onClick={editInjuryId ? updateInjury : addInjury}>{editInjuryId ? "Update Injury" : "Add Injury"}</button>
        </div>
    );
};

export default ManageInjuries;