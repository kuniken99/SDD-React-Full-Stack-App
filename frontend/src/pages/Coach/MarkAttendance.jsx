import React, { useEffect, useState } from "react";
import "../../styles/TableStyles.css";
import api from "../../api";

const MarkAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await api.get('/api/attendance/');
                setAttendanceData(response.data);
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, []);

    const handleStatusChange = (index, newStatus) => {
        const updatedData = [...attendanceData];
        updatedData[index].status = newStatus;
        setAttendanceData(updatedData);
    };

    if (loading) {
        return <p>Loading attendance data...</p>;
    }

    return (
        <div className="mark-attendance">
            <h1>Mark Artist Attendance</h1>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Date</th>
                        <th>Artist Name</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th>Coach Name</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((record, index) => (
                        <tr key={record.id}>
                            <td>{index + 1}</td>
                            <td>{record.date}</td>
                            <td>{record.artistName}</td>
                            <td>
                                <select
                                    value={record.status}
                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Late">Late</option>
                                </select>
                            </td>
                            <td>{record.remarks}</td>
                            <td>{record.coachName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MarkAttendance;