import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const ViewInjuries = () => {
    const [injuries, setInjuries] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "ascending" });

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

    const fetchInjuries = async () => {
        try {
            const response = await api.get('/api/manage-injuries/');
            setInjuries(response.data);
        } catch (error) {
            console.error("Error fetching injuries:", error);
        }
    };

    useEffect(() => {
        fetchInjuries();
    }, []);

    return (
        <div className="view-injuries">
            <h1>View Injuries</h1>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => sortData("id")}>No</th>
                        <th onClick={() => sortData("date")}>Date</th>
                        <th onClick={() => sortData("artist_name")}>Artist Name</th>
                        <th onClick={() => sortData("injury_type")}>Injury Type</th>
                        <th onClick={() => sortData("severity")}>Severity</th>
                        <th onClick={() => sortData("coach_remarks")}>Coach Remarks</th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewInjuries;