import React from "react";
import "../styles/TermsCondition.css";
import DanceLahLogo from "../assets/DanceLahLogoHigh.png"; // Ensure this image is in the correct directory

function TermsCondition() {
    return (
      <div className="terms-container">
        <div className="terms-image">
            <img src={DanceLahLogo} alt="DanceLah Logo" />
        </div>

        <div className="terms-details">
            <h1>Terms and Condition 📜</h1>

            <section>
                <h2>Acceptance of Terms</h2>
                <p>By using this website, you agree to abide by these Terms and Conditions.</p>
            </section>

            <section>
                <h2>Use of Services</h2>
                <ul>
                    <li>Services are provided solely for performance and dance-related activities.</li>
                    <li>Users must provide accurate and up-to-date information.</li>
                    <li>Unauthorized use of the platform is strictly prohibited.</li>
                </ul>
            </section>

            <section>
                <h2>User Accounts</h2>
                <ul>
                    <li>Each user is responsible for maintaining the confidentiality of their login credentials.</li>
                    <li>Sharing accounts is not permitted.</li>
                </ul>
            </section>

            <section>
                <h2>Payments and Subscriptions</h2>
                <ul>
                    <li>Payments must be made through secure methods provided on the website.</li>
                    <li>Refund policies will be outlined for each service.</li>
                </ul>
            </section>

            <section>
                <h2>Limitation of Liability</h2>
                <ul>
                    <li>The organization is not responsible for unforeseen technical issues.</li>
                    <li>User-generated content accuracy.</li>
                </ul>
            </section>

            <section>
                <h2>Changes to Terms</h2>
                <p>We reserve the right to update these Terms and Conditions at any time. Users will be notified of changes via the website.</p>
            </section>
        </div>
        </div>
    );
}

export default TermsCondition;