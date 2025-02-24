import React, { useState } from "react";
import "../../styles/TableStyles.css";

const UpdateTrainingStats = () => {
    const [trainingData, setTrainingData] = useState([]);
    const [newTraining, setNewTraining] = useState({
        date: "",
        artistName: "",
        skillsImproved: "",
        performanceRating: "",
        duration: "",
        coachNotes: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTraining({ ...newTraining, [name]: value });
    };

    const addTraining = () => {
        setTrainingData([...trainingData, { ...newTraining, id: trainingData.length + 1 }]);
        setNewTraining({
            date: "",
            artistName: "",
            skillsImproved: "",
            performanceRating: "",
            duration: "",
            coachNotes: ""
        });
    };

    return (
        <div className="update-training-stats">
            <h1>Update Artist Training Statistics</h1>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Date</th>
                        <th>Artist Name</th>
                        <th>Skills Improved</th>
                        <th>Performance Rating</th>
                        <th>Duration</th>
                        <th>Coach Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trainingData.map((training) => (
                        <tr key={training.id}>
                            <td>{training.id}</td>
                            <td>{training.date}</td>
                            <td>{training.artistName}</td>
                            <td>{training.skillsImproved}</td>
                            <td>{training.performanceRating}</td>
                            <td>{training.duration}</td>
                            <td>{training.coachNotes}</td>
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
            <input type="text" name="artistName" placeholder="Artist Name" value={newTraining.artistName} onChange={handleInputChange} />
            <input type="text" name="skillsImproved" placeholder="Skills Improved" value={newTraining.skillsImproved} onChange={handleInputChange} />
            <input type="text" name="performanceRating" placeholder="Performance Rating" value={newTraining.performanceRating} onChange={handleInputChange} />
            <input type="text" name="duration" placeholder="Duration" value={newTraining.duration} onChange={handleInputChange} />
            <textarea name="coachNotes" placeholder="Coach Notes" value={newTraining.coachNotes} onChange={handleInputChange}></textarea>
            <button onClick={addTraining}>Add Training</button>
        </div>
    );
};

export default UpdateTrainingStats;