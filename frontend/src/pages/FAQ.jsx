import React, { useState } from "react";
import "../styles/FAQ.css";
import DropDown from "../assets/DropDown.png";

const faqData = [
    {
        category: "Sign Up",
        questions: [
            {
                question: "What is the minimum age requirement to register an account?",
                answer: "DanceLah caters dance performance group aging from 7 to 70 years old. However, those under 12 years old will need to have a guardian managing the account.",
            },
            {
                question: "Do I need to pay to create an account?",
                answer: "No, signing up is free!",
            },
            {
                question: "Can I sign up using my social media accounts?",
                answer: "Currently, we only support email-based registration, but social media sign-in options may be available in future updates.",
            },
        ],
    },
    {
        category: "General Information",
        questions: [
            {
                question: "What is the Performance and Dance Group Management Website?",
                answer: "It is a web-based platform designed to help directors, coaches, and artists manage training records, performance data, attendance, and more in a secure and efficient manner.",
            },
            {
                question: "Who can use this platform?",
                answer: "The platform is designed for directors, coaches, and artists within dance and performance groups.",
            },
            {
                question: "Is my data safe?",
                answer: "Yes! We use secure design approach with industry-standard encryption and security measures to protect all user data.",
            },
        ],
    },
    {
        category: "Events and Club Activities",
        questions: [
            {
                question: "Can I track attendance for performances?",
                answer: "Yes! The platform allows you to mark attendance for each event and track who participated.",
            },
            {
                question: "How do I create a new club activity?",
                answer: "As the Director, go to the 'Events' section in the navigation bar and click 'Create Event.' Fill in the details such as event name, date, location, and description.",
            },
        ],
    },
    {
        category: "Technical Support",
        questions: [
            {
                question: "What should I do if I experience technical issues?",
                answer: "If you encounter any technical difficulties, try refreshing your browser, clearing cache, or using a different device. If the issue persists, contact our support team.",
            },
            {
                question: "The website is not loading properly. What should I do?",
                answer: "Ensure you have a stable internet connection and try using an updated browser such as Chrome, Firefox, or Edge. If the problem continues, contact support.",
            },
            {
                question: "How do I update my account details?",
                answer: "Go to your 'Profile Settings' and make the necessary changes. For security reasons, some updates may require email verification.",
            },
        ],
    },
];

function FAQ() {
    const [openSections, setOpenSections] = useState({});

    function toggleSection(category) {
        setOpenSections((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    }

    return (
        <div className="faq-container">
            <h1 className="faq-title">DanceLah Frequently Asked Questions (FAQs)</h1>
            <p className="faq-description">
                Find information about DanceLah Support on topics such as Signing Up, General Information,
                Events and Performances, and Technical Support.
            </p>
            {faqData.map((section, index) => (
                <div key={index} className="faq-section">
                    <div className="faq-category" onClick={() => toggleSection(section.category)}>
                        <h2>{section.category}</h2>
                        <img
                            src={DropDown}
                            alt="Expand/Collapse"
                            className={`faq-arrow ${openSections[section.category] ? "open" : ""}`}
                        />
                    </div>
                    {openSections[section.category] && (
                        <div className="faq-questions">
                            {section.questions.map((item, idx) => (
                                <div key={idx} className="faq-question">
                                    <p className="faq-question-text">{item.question}</p>
                                    <p className="faq-answer">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default FAQ;
