import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <section id="home">
                <h1>Welcome to DanceLah</h1>
                <button onClick={() => navigate("/login")}>Try Now</button>
            </section>
            <section id="how-it-works">
                <h2>How it Works?</h2>
                <p>Explanation of how it works...</p>
            </section>
            <section id="pricing">
                <h2>Pricing</h2>
                <p>Details about pricing...</p>
                <button onClick={() => navigate("/login")}>Get Started</button>
            </section>
            <section id="why-choose-us">
                <h2>Why Choose Us?</h2>
                <p>Reasons to choose us...</p>
            </section>
            <section id="testimonial">
                <h2>Testimonials</h2>
                <div className="testimonial-container">
                    <div className="testimonial">Customer testimonial 1...</div>
                    <div className="testimonial">Customer testimonial 2...</div>
                    <div className="testimonial">Customer testimonial 3...</div>
                    <div className="testimonial">Customer testimonial 4...</div>
                    <div className="testimonial">Customer testimonial 5...</div>
                </div>
            </section>
            <footer>
                <p>© 2025 DanceLah. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;