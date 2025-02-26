import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const ManageArtists = () => {
    const [artists, setArtists] = useState([]);
    const [filter, setFilter] = useState({ name: "", role: "", age: ""});
    const [newArtist, setNewArtist] = useState({ full_name: "", email: "", dob: "", guardian_name: "", role: "", password: "" });

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await api.get('/api/manage-artists/');
                setArtists(response.data);
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        };

        fetchArtists();
    }, []);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const handleNewArtistChange = (e) => {
        setNewArtist({ ...newArtist, [e.target.name]: e.target.value });
    };

    const handleAddArtist = async () => {
        try {
            const response = await api.post('/api/manage-artists/', newArtist);
            setArtists([...artists, response.data]);
            setNewArtist({ full_name: "", email: "", dob: "", guardian_name: "", role: "", password: "" });
        } catch (error) {
            console.error("Error adding artist:", error);
        }
    };

    const filteredArtists = artists.filter(artist => {
        return (
            (filter.name === "" || artist.full_name.toLowerCase().includes(filter.name.toLowerCase())) &&
            (filter.role === "" || artist.role === filter.role) &&
            (filter.age === "" || new Date().getFullYear() - new Date(artist.dob).getFullYear() === parseInt(filter.age)))
    });

    return (
        <div className="manage-artists">
            <h1>Manage Artists</h1>
            <div>
                <input type="text" name="name" placeholder="Filter by name" value={filter.name} onChange={handleFilterChange} />
                <select name="role" value={filter.role} onChange={handleFilterChange}>
                    <option value="">All Roles</option>
                    <option value="artist">Artist</option>
                    <option value="coach">Coach</option>
                    <option value="director">Director</option>
                </select>
                <input type="number" name="age" placeholder="Filter by age" value={filter.age} onChange={handleFilterChange} />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Artist Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Guardian</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredArtists.map((artist, index) => (
                        <tr key={artist.id}>
                            <td>{index + 1}</td>
                            <td>{artist.full_name}</td>
                            <td>{artist.email}</td>
                            <td>{new Date().getFullYear() - new Date(artist.dob).getFullYear()}</td>
                            <td>{artist.guardian_name}</td>
                            <td>{artist.role}</td>
                            <td>{artist.is_active ? "Active" : "Inactive"}</td>
                            <td>
                                {/* Add edit and delete actions here */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <h2>Add New Artist</h2>
                <input type="text" name="full_name" placeholder="Full Name" value={newArtist.full_name} onChange={handleNewArtistChange} />
                <input type="email" name="email" placeholder="Email" value={newArtist.email} onChange={handleNewArtistChange} />
                <input type="date" name="dob" placeholder="Date of Birth" value={newArtist.dob} onChange={handleNewArtistChange} />
                <input type="text" name="guardian_name" placeholder="Guardian Name" value={newArtist.guardian_name} onChange={handleNewArtistChange} autoComplete="off" />
                <select name="role" value={newArtist.role} onChange={handleNewArtistChange}>
                    <option value="">Select Role</option>
                    <option value="artist">Artist</option>
                    <option value="coach">Coach</option>
                    <option value="director">Director</option>
                </select>
                <input type="password" name="password" placeholder="Password" value={newArtist.password} onChange={handleNewArtistChange} autoComplete="new-password"/>
                <button onClick={handleAddArtist}>Add Artist</button>
            </div>
        </div>
    );
}

export default ManageArtists;