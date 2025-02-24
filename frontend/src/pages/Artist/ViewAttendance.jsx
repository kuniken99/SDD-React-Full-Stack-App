import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const ViewAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [artistInfo, setArtistInfo] = useState(null);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await api.get("/api/artist-attendance/");
                setAttendanceRecords(response.data.attendance);
                setArtistInfo(response.data.artist);
            } catch (error) {
                console.error("Error fetching attendance data:", error);
            }
        };

        fetchAttendanceData();
    }, []);

    if (!artistInfo) return <p>Loading artist info...</p>;

    return (
        <div className="attendance-page">
            <h1>Attendance Records for {artistInfo.full_name}</h1>
            <p>Attendance Rate: {artistInfo.attendance_rate}%</p>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Date</th>
                            <th>Session Name</th>
                            <th>Status</th>
                            <th>Coach Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceRecords.map((record, index) => (
                            <tr key={record.id}>
                                <td>{index + 1}</td>
                                <td>{record.date}</td>
                                <td>{record.session_name}</td>
                                <td>{record.status}</td>
                                <td>{record.coach_remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewAttendance;