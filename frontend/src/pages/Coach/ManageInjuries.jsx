import React, { useState } from "react";
import "../../styles/TableStyles.css";

const ManageInjuries = () => {
    const [injuries, setInjuries] = useState([]);
    const [newInjury, setNewInjury] = useState({ date: "", artistName: "", injuryType: "", severity: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInjury({ ...newInjury, [name]: value });
    };

    const addInjury = () => {
        setInjuries([...injuries, { ...newInjury, id: injuries.length + 1 }]);
        setNewInjury({ date: "", artistName: "", injuryType: "", severity: "" });
    };

    return (
        <div className="manage-injuries">
            <h1>Manage Artist Injuries</h1>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Date</th>
                        <th>Artist Name</th>
                        <th>Injury Type</th>
                        <th>Severity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {injuries.map((injury) => (
                        <tr key={injury.id}>
                            <td>{injury.id}</td>
                            <td>{injury.date}</td>
                            <td>{injury.artistName}</td>
                            <td>{injury.injuryType}</td>
                            <td>{injury.severity}</td>
                            <td>
                                <button onClick={() => {/* Handle edit */}}>Edit</button>
                                <button onClick={() => {/* Handle delete */}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Add New Injury</h2>
            <input type="date" name="date" value={newInjury.date} onChange={handleInputChange} />
            <input type="text" name="artistName" placeholder="Artist Name" value={newInjury.artistName} onChange={handleInputChange} />
            <input type="text" name="injuryType" placeholder="Injury Type" value={newInjury.injuryType} onChange={handleInputChange} />
            <input type="text" name="severity" placeholder="Severity" value={newInjury.severity} onChange={handleInputChange} />
            <button onClick={addInjury}>Add Injury</button>
        </div>
    );
};

export default ManageInjuries;