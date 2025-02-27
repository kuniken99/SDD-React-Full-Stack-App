import React, { useState, useEffect } from "react";
import "../styles/Register.css";
import DanceLahLogo from "../assets/DanceLahLogoHigh.png";
import eyeIcon from "../assets/eyeIcon.png";
import eyeIconCrossed from "../assets/eyeIconCrossed.png";
import axios from "axios";
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("artist"); // Default to artist
    const [dob, setDob] = useState("");
    const [guardian_name, setGuardian_Name] = useState("");
    const [coach_name, setCoach_name] = useState(""); // Coach selection if artist is selected
    const [coaches, setCoaches] = useState([]); // List of coaches
    const [error, setError] = useState("");
    const [captchaValue, setCaptchaValue] = useState(null);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [uniqueCode, setUniqueCode] = useState(""); // Unique code for coach and director

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1;
        }
        return age;
    };

    useEffect(() => {
        // Fetch coaches from the backend
        const fetchCoaches = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/coaches/");
                setCoaches(response.data);
            } catch (error) {
                console.error("Error fetching coaches:", error);
            }
        };

        fetchCoaches();
    }, []);

    useEffect(() => {
        // Check if the age is below 12
        if (dob) {
            const age = calculateAge(dob);
            if (age < 7 || age > 70) {
                setError("Age must be between 7 and 70.");
            } else {
                setError("");
            }
        }
    }, [dob]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 5000); // Clear error message after 5 seconds
            return () => clearTimeout(timer); // Clear timeout if component unmounts
        }
    }, [error]);

    const handleRegister = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!captchaValue) {
            alert("Please verify the captcha");
            return;
        }

        try {
            await axios.post("http://localhost:8000/api/user/register/", {
                full_name: fullName,
                email,
                password,
                confirmPassword,
                role,
                dob,
                guardian_name,
                coach_name,
                unique_code: uniqueCode,  // Send unique code to backend
                recaptcha: captchaValue,  // Send reCAPTCHA token to backend
            });
            setOtpSent(true);
        } catch (err) {
            setError(err.response.data.unique_code || "An error occurred. Please try again.");
            console.error("Registration failed:", err);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/user/verify-otp/", { otp, email });
            setRegistrationSuccess(true);
            setTimeout(() => {
                window.location.href = '/login'; // Redirect to login page after 2 seconds
            }, 2000);
        } catch (error) {
            console.error("OTP verification failed:", error);
            setError("Failed to verify OTP. Please check the OTP and try again.");
        }
    };

    if (registrationSuccess) return <h1>Registration Successful! You can now Log In.</h1>;

    return (
        <div className="register-container">
            <div className="register-left">
                <img src={DanceLahLogo} alt="Dance Lah Logo" className="register-logo" />
            </div>

            <div className="register-right">
                <h2 className="register-title">Create an account</h2>

                {error && <p className="error-message">{error}</p>}

                {!otpSent ? (
                    <form className="register-form" onSubmit={handleRegister} autoComplete="off">
                        <label>Full Name*</label>
                        <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="" 
                            required 
                        />

                        <label>Email*</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="eg: myname@gmail.com" 
                            required 
                            autoComplete="new-password"
                        />

                        <label>Password*</label>
                        <div className="password-field-register">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                            <img
                                src={showPassword ? eyeIconCrossed : eyeIcon}
                                alt="toggle visibility"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        <label>Confirm Password*</label>
                        <div className="password-field-register">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                required 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <img
                                src={showConfirmPassword ? eyeIconCrossed : eyeIcon}
                                alt="toggle visibility"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>

                        <label>Select User Type*</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="" disabled >
                                Please Select
                            </option>
                            <option value="artist">Artist</option>
                            <option value="coach">Coach</option>
                            <option value="director">Director</option>
                        </select>

                        {role === "artist" && (
                            <div>
                                <label>Select Coach*</label>
                                <select value={coach_name} onChange={(e) => setCoach_name(e.target.value)} required>
                                    <option value="" disabled >
                                        Please Select Coach
                                    </option>
                                    {coaches.map((coach) => (
                                        <option key={coach.id} value={coach.user.full_name}>
                                            {coach.user.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {role !== "artist" && (
                            <div>
                                <label>Unique Code*</label>
                                <input 
                                    type="text" 
                                    value={uniqueCode}
                                    onChange={(e) => setUniqueCode(e.target.value)}
                                    required 
                                />
                            </div>
                        )}

                        <label>Date of Birth*</label>
                        <input 
                            type="date" 
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required 
                        />

                        {/* Show Guardian Name only if the user type is Artist and age is below 12 */}
                        {role === "artist" && calculateAge(dob) < 12 && (
                            <div>
                                <label>Guardian Name*</label>
                                <input
                                    type="text"
                                    value={guardian_name}
                                    onChange={(e) => setGuardian_Name(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="register-checkbox">
                            <input type="checkbox" required />
                            <span>
                                By creating an account, I agree to the <a href="/TermsCondition">Terms of Use</a> and{" "}
                                <a href="/PrivacyPolicy">Privacy Policy</a>.
                            </span>
                        </div>

                        {/* Google reCAPTCHA */}
                        <ReCAPTCHA
                            sitekey="6Lfz494qAAAAAPtrCHx6Bp8D3Hnc4IyK3RKorCcr" // Replace with actual site key
                            onChange={(value) => setCaptchaValue(value)}
                        />

                        <button type="submit" className="register-btn">
                            Create an account
                        </button>

                        <p className="register-login">
                            Have an account? <a href="/login">Log In</a> instead
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="form-group">
                            <label>Enter OTP:</label>
                            <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required style={{ border: "1px solid #000" }}/>
                        </div>
                        <button type="submit" className="cta-button">Verify OTP</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;