import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import PublicFooter from "./components/PublicFooter";
import FAQ from "./pages/FAQ";
import CompanyInfo from "./pages/CompanyInfo";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsCondition from "./pages/TermsCondition";
import Home from "./pages/Home"; // Public home page
import "./App.css";

// Artist
import HomeArtist from "./pages/Artist/HomeArtist";
import ArtistProfile from "./pages/Artist/ArtistProfile";

// Coach
import HomeCoach from "./pages/Coach/HomeCoach";

// Director
import HomeDirector from "./pages/Director/HomeDirector";
import ManageArtists from "./pages/Director/ManageArtists";
import CreateClubActivities from "./pages/Director/CreateClubActivities";
import ViewInjuries from "./pages/Director/ViewInjuries";


function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Retrieve user type from local storage on app load
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.type) {
      setUserType(storedUser.type);
    }
  }, []);

  // Function to determine which home page to show for logged-in users
  const getHomeComponent = () => {
    if (!userType) return <Home />; // Show the public home page if not logged in
    switch (userType) {
      case "artist":
        return <HomeArtist />;
      case "coach":
        return <HomeCoach />;
      case "director":
        return <HomeDirector />;
      default:
        return <Home />;
    }
  };

  return (
    <BrowserRouter>
      <Navbar userType={userType} /> {/* Dynamic navbar */}

      <Routes>
        <Route path="/" element={getHomeComponent()} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/CompanyInfo" element={<CompanyInfo />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/TermsCondition" element={<TermsCondition />} />
        
        {/* Artist routes */}
        <Route path="/HomeArtist" element={<HomeArtist />} />
        <Route path="/profile" element={<ArtistProfile />} />
        
        {/* Coach routes */}
        <Route path="/HomeCoach" element={<HomeCoach />} />

        {/* Director routes */}
        <Route path="/HomeDirector" element={<HomeDirector />} />
        <Route path="/manage-artists" element={<ManageArtists />} />
        <Route path="/create-club-activities" element={<CreateClubActivities />} />
        <Route path="/view-injuries" element={<ViewInjuries />} />
               
      </Routes>

      <PublicFooter />
    </BrowserRouter>
  );
}

export default App;
