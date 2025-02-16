import React from "react";
import "../styles/PrivacyPolicy.css";
import DanceLahLogo from "../assets/DanceLahLogoHigh.png"; // Ensure this image is in the correct directory

function PrivacyPolicy() {
    return (
      <div className="privacy-container">
        <div className="privacy-image">
            <img src={DanceLahLogo} alt="DanceLah Logo" />
        </div>

        <div className="privacy-policy-container">
            <h1>Privacy Policy 🔒</h1>

            <section>
                <h2>Introduction</h2>
                <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you interact with our website and services.</p>
            </section>

            <section>
                <h2>Data We Collect</h2>
                <ul>
                    <li><strong>Personal Information:</strong> Name, contact details, and age group.</li>
                    <li><strong>Performance Data:</strong> Attendance, training records, and performance statistics.</li>
                    <li><strong>Health Data:</strong> Injury records and recovery plans (if applicable).</li>
                    <li><strong>Payment Details:</strong> If applicable for subscriptions or services.</li>
                </ul>
            </section>

            <section>
                <h2>How We Use Your Information</h2>
                <ul>
                    <li>To manage user accounts and profiles.</li>
                    <li>To provide training schedules, performance reports, and notifications.</li>
                    <li>To ensure compliance with legal obligations.</li>
                </ul>
            </section>

            <section>
                <h2>Data Protection Measures</h2>
                <ul>
                    <li>Secure database storage with encryption.</li>
                    <li>Restricted access to sensitive information.</li>
                    <li>Regular security audits and updates.</li>
                </ul>
            </section>

            <section>
                <h2>Your Rights</h2>
                <ul>
                    <li>Request access to your data.</li>
                    <li>Request corrections or deletions.</li>
                    <li>Opt-out of marketing communications.</li>
                </ul>
            </section>
        </div>
        </div>
    );
}

export default PrivacyPolicy;
