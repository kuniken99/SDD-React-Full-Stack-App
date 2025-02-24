import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const ViewInjuries = () => {
    const [injuries, setInjuries] = useState([]);

    useEffect(() => {
        const fetchInjuries = async () => {
            try {
                const response = await api.get('/api/injuries/');
                setInjuries(response.data);
            } catch (error) {
                console.error("Error fetching injuries:", error);
            }
        };

        fetchInjuries();
    }, []);

    return (
        <div className="view-injuries">
            <h1>View Injuries</h1>
            <table>
                <thead>
                    <tr>
                        <th>Artist</th>
                        <th>Injury Type</th>
                        <th>Status</th>
                        <th>Severity</th>
                    </tr>
                </thead>
                <tbody>
                    {injuries.map(injury => (
                        <tr key={injury.id}>
                            <td>{injury.artist.full_name}</td>
                            <td>{injury.type}</td>
                            <td>{injury.status}</td>
                            <td>{injury.severity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewInjuries;