import React from 'react';
import { Link } from "react-router-dom";
import "../styles/Home.css";
import volImg from "../assets/landing-hero.png";
function Home() {
  return (
    <div className="homepage-container" id="home">
      {/* HEADER NAVBAR */}
      <header className="navbar">
       <div className="logo-container">
  <button
    onClick={() =>
      document
        .getElementById("home")
        .scrollIntoView({ behavior: "smooth" })
    }
    className="nav-btn"
  >
    <span className="logo-icon">🤝</span>
    <h1>
      <span className="logo-text">Food Bridge</span>
    </h1>
  </button>
</div>
        <nav className="nav-links">
  <button
    className="nav-btn"
    onClick={() =>
      document
        .getElementById("home")
        .scrollIntoView({ behavior: "smooth" })
    }
  >
    Home
  </button>

  <button
    className="nav-btn"
    onClick={() =>
      document
        .getElementById("how-it-works")
        .scrollIntoView({ behavior: "smooth" })
    }
  >
    How It Works
  </button>

  <Link
    to="/login"
    style={{
      textDecoration: "none",
      color: "inherit",
    }}
  >
    Login
  </Link>

  <Link to="/signup">
    <button className="signup-btn">Sign Up</button>
  </Link>
</nav>
      </header>

      {/* HERO SECTION */}
      <main className="hero-section">
        {/* Left Side: Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            SPARK HOPE.<br />
            <span className="highlight-text">SHARE FOOD.</span>
          </h1>
          <p className="hero-description">
            Bridging the gap between food surplus and communities in need. 
            Join us to reduce waste and feed families.
          </p>
                              <div style={{ marginTop: "15px", marginBottom: "55px" }}> {/* Changed spacing here */}
            <Link to="/login">
              <button
                style={{
                  padding: "20px 48px",
                  marginRight: "24px",
                  fontSize: "22px",
                  fontWeight: "700",
                  backgroundColor: "#2d6a4f",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            </Link>

            <Link to="/signup">
              <button
                style={{
                  padding: "20px 48px",
                  fontSize: "22px",
                  fontWeight: "700",
                  backgroundColor: "#f4a261",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Signup
              </button>
            </Link>
          </div>

    
           {/* Social Impact Stats Bar */}
          <div className="impact-validation">
            <p className="validation-title">Social Impact validation</p>
            <div className="stats-bar">
              <span className="stat-item">📊 <strong>12,400+</strong> Meals Saved</span>
              <span className="divider">|</span>
              <span className="stat-item">🤝 <strong>450+</strong> Active Donors</span>
              <span className="divider">|</span>
              <span className="stat-item">📍 <strong>12</strong> Local Communities</span>
            </div>
          </div>
        </div>

        {/* Right Side: Image Showcase */}
        <div className="hero-image-container">
          <div className="slanted-image-card">
            {/* Replace this placeholder URL with your actual image path */}
            <img 
            
              src={volImg}
              alt="Volunteers sharing food packages" 
              className="hero-img"
            />
          </div>
        </div>
      </main>
       {/* How It Works */}
    <section
  id="how-it-works"
  style={{
    padding: "100px 20px 60px",
    textAlign: "center",
  }}
>
        <h2>How It Works</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              width: "250px",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          >
              <div className="steps"></div>
             <span style={{ fontSize: "60px" }}>🥗</span>
            <h3> Donate Food</h3>
            <p>
            Donors submit available food through platform.
        Share surplus food through our platform.
            </p>
          </div>

          <div
            style={{
              width: "250px",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          >
             <span style={{ fontSize: "60px" }}>🤝</span>
            <h3>Match Requests</h3>
            <p>
              People or NGOs can browse available food donations
              Recipients find available food nearby..
            </p>
          </div>

          <div
            style={{
              width: "250px",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          >
             <span style={{ fontSize: "60px" }}>🚚</span>
            <h3> Distribute Food</h3>
            <p>
              Food reaches people in need quickly and efficiently
              Food reaches people who need it.
            </p>
          </div>
  
        <div
            style={{
              width: "250px",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              borderRadius: "10px",
            }}
          >
             <span style={{ fontSize: "60px" }}>🎁</span>
            <h3>Earn rewards</h3>
            <p>
             Donate food and earn rewards 
             Give more,Earn more!
            </p>
            </div>
          </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2>Why Choose Food Bridge?</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "30px",
          }}
        >
          <div style={{ width: "250px" }}>
            <h3>Reduce Waste</h3>
            <p>Prevent perfectly good food from being wasted.</p>
          </div>

          <div style={{ width: "250px" }}>
            <h3>Help Communities</h3>
            <p>Support families and individuals facing food insecurity.</p>
          </div>

          <div style={{ width: "250px" }}>
            <h3>Easy to Use</h3>
            <p>Simple process for donors, receivers, and NGOs.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#2d6a4f",
          color: "white",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <p>© 2026 Food Bridge. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

