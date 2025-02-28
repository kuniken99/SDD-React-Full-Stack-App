import "../styles/CompanyInfo.css";
import DanceLahLogo from "../assets/DanceLahLogoHigh.png"; // Ensure this image is in the correct directory

function CompanyInfo() {
    return (
        <div className="company-info-container">
            <div className="company-info-image">
                <img src={DanceLahLogo} alt="DanceLah Logo"  className="company-logo" />
            </div>
            
            <div className="company-details">
                <h1>Company Information 🏢</h1>

                <section>
                    <h2>About Us</h2>
                    <p>
                        Welcome to DanceLah Performance and Dance Group! <br />
                        A community where passion for performance arts meets the joy of learning and collaboration. 
                        We are a vibrant community of artists, coaches, and directors dedicated to the art
                        of dance and performance. Our group includes individuals aged 7 to 70, providing a
                        platform for creative expression, skill development, and cultural appreciation.
                    </p>
                </section>

                <section>
                    <h2>Mission</h2>
                    <p>
                        To nurture talent and inspire a lifelong love of performance arts in a supportive
                        and inclusive environment.
                    </p>
                </section>

                <section>
                    <h2>Vision</h2>
                    <p>
                        To become a leading organization in performance and dance education, promoting
                        creativity, discipline, and collaboration.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default CompanyInfo;