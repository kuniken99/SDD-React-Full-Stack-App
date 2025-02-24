import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const ManageArtists = () => {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await api.get('/api/artists/');
                setArtists(response.data);
            } catch (error) {
                console.error("Error fetching artists:", error);
            }
        };

        fetchArtists();
    }, []);

    return (
        <div className="manage-artists">
            <h1>Manage Artists</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {artists.map(artist => (
                        <tr key={artist.id}>
                            <td>{artist.full_name}</td>
                            <td>{artist.email}</td>
                            <td>{artist.is_active ? "Active" : "Inactive"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageArtists;