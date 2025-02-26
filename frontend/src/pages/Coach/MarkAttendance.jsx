import React, { useEffect, useState } from "react";
import "../../styles/TableStyles.css";
import "../../styles/Coach/MarkAttendance.css";
import api from "../../api";
import { Link } from "react-router-dom";

const MarkAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "ascending" });

    const fetchSessions = async () => {
        try {
            const response = await api.get('/api/training-sessions/');
            setSessions(response.data);
            setLoading(false); // Set loading to false after fetching sessions
        } catch (error) {
            console.error("Error fetching sessions:", error);
            setLoading(false); // Set loading to false even if there is an error
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleSessionChange = async (e) => {
        const sessionId = e.target.value;
        setSelectedSession(sessionId);
        try {
            const response = await api.get(`/api/training-sessions/${sessionId}/`);
            const artists = response.data.artists.map(artist => ({
                artistId: artist.id,
                artistName: artist.user.full_name,
                status: "None",
                coach_remarks: "",
                coachName: response.data.coach_name,
                date: response.data.date
            }));
    
            // Check if attendance has already been marked for this session
            const attendanceResponse = await api.get(`/api/attendance/${sessionId}/`);
            if (attendanceResponse.data.attendance.length > 0) {
                setAttendanceData(attendanceResponse.data.attendance);
            } else {
                setAttendanceData(artists);
            }
            setSelectedArtists(artists);
        } catch (error) {
            console.error("Error fetching session details:", error);
        }
    };

    const handleStatusChange = (index, newStatus) => {
        const updatedData = [...attendanceData];
        updatedData[index].status = newStatus;
        setAttendanceData(updatedData);
    };

    const handleRemarksChange = (index, newRemarks) => {
        const updatedData = [...attendanceData];
        updatedData[index].coach_remarks = newRemarks;
        setAttendanceData(updatedData);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                session_id: selectedSession,
                attendance: attendanceData,
            };
            console.log("Submitting attendance data:", payload); // Log the payload
            const response = await api.post('/api/coach/mark-attendance/', payload);
            alert(response.data.message);
    
            // Re-fetch the attendance data for the selected session
            const attendanceResponse = await api.get(`/api/attendance/${selectedSession}/`);
            if (attendanceResponse.data.attendance.length > 0) {
                const updatedAttendance = attendanceResponse.data.attendance.map(attendance => {
                    const artist = selectedArtists.find(artist => artist.artistId === attendance.artist.id);
                    return {
                        ...attendance,
                        artistName: artist ? artist.artistName : '',
                        coachName: artist ? artist.coachName : '',
                    };
                });
                setAttendanceData(updatedAttendance);
            } else {
                setAttendanceData([]);
            }
        } catch (error) {
            console.error("Error marking attendance:", error);
            if (error.response && error.response.data.detail) {
                alert(error.response.data.detail);
            } else {
                alert("Failed to mark attendance.");
            }
        }
    };

    const sortData = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedAttendanceData = [...attendanceData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    if (loading) {
        return <p>Loading attendance data...</p>;
    }

    return (
        <div className="mark-attendance">
            <h1>Mark Artist Attendance</h1>
            <div>
                <label>Select Training Session:</label>
                <select onChange={handleSessionChange} value={selectedSession}>
                    <option value="" disabled>Select a session</option>
                    {sessions.map((session) => (
                        <option key={session.id} value={session.id}>{session.session_name} - {session.date}</option>
                    ))}
                </select>
                {sessions.length === 0 && (
                    <Link to="/update-training" className="cta-button">No sessions today? Add Training Session</Link>
                )}
            </div>
           
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th onClick={() => sortData("date")}>Date</th>
                        <th onClick={() => sortData("artistName")}>Artist Name</th>
                        <th>Status</th>
                        <th>Coach Remarks</th>
                        <th onClick={() => sortData("coachName")}>Coach Name</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAttendanceData.map((record, index) => (
                        <tr key={record.artistId}>
                            <td>{index + 1}</td>
                            <td>{record.date}</td>
                            <td>{record.artistName}</td>
                            <td>
                                <select
                                    value={record.status}
                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                >
                                    <option value="None">None</option>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={record.coach_remarks}
                                    onChange={(e) => handleRemarksChange(index, e.target.value)}
                                    style={{ border: '1px solid grey' }}
                                />
                            </td>
                            <td>{record.coachName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSubmit}>Submit Attendance</button>
        </div>
    );
};

export default MarkAttendance;