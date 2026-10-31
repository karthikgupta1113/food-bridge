import React from "react";
import { useNavigate } from "react-router-dom";
import dashboardBg from "../assets/bagg.jpg";
export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>

    <div style={styles.overlay}>
     
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1>🍱 Food Bridge</h1>

        <div style={styles.navRight}>
          <span>🔔</span>
          <span>👤 user</span>
          <button style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h2 style={styles.logo}>Dashboard</h2>

          <div style={styles.menu}>🏠 Home</div>
          <div style={styles.menu}>🍱 Donations</div>
          <div style={styles.menu}>📦 Requests</div>
          <div style={styles.menu}>🚚 Deliveries</div>
          <div style={styles.menu}>⚙️ Settings</div>
        </div>

        {/* Main */}
        <div style={styles.main}>
          {/* Welcome Banner */}
          <div style={styles.banner}>
            <h1>Welcome Back, 👋</h1>
            <p>
              Manage donations, requests and track your impact from one place.
            </p>
          </div>

           {/* Action Cards */}
          <div style={styles.actionGrid}>
            <div style={styles.actionCard}>
              <h2>🍱 Donate Food</h2>
              <p>Share excess food with people in need.</p>

              <button
                style={styles.greenBtn}
                onClick={() => navigate("/donate")}
              >
                Donate Now
              </button>
            </div>

            <div style={styles.actionCard}>
              <h2>🙏 Request Food</h2>
              <p>Request food support for yourself or others.</p>

              <button
                style={styles.greenBtn}
                onClick={() => navigate("/receive")}
              >
                Request Food
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h3>Total Donations</h3>
              <h1>128</h1>
            </div>

            <div style={styles.statCard}>
              <h3>Food Requests</h3>
              <h1>42</h1>
            </div>

            <div style={styles.statCard}>
              <h3>Food Distributed</h3>
              <h1>96</h1>
            </div>

            <div style={styles.statCard}>
              <h3>Active Donors</h3>
              <h1>76</h1>
            </div>
          </div>

         
          {/* Bottom Section */}
          <div style={styles.bottomGrid}>
            <div style={styles.card}>
              <h2>Recent Activity</h2>

              <p>✔ Restaurant donated 20 meals</p>
              <p>✔ NGO requested 15 meals</p>
              <p>✔ Food delivered successfully</p>
            </div>

            <div style={styles.card}>
              <h2>Your Impact</h2>

              <p>🍽 Meals Shared: 1,250</p>
              <p>👥 People Helped: 430</p>
              <p>🌱 Food Saved: 820 KG</p>
            </div>

            <div style={styles.card}>
              <h2>Top Donors</h2>

              <p>🥇 ABC Restaurant</p>
              <p>🥈 Green Leaf Cafe</p>
              <p>🥉 Helping Hands Group</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

const styles = {
  container: {
  minHeight: "100vh",
  backgroundImage: `url(${dashboardBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  fontFamily: "Arial",
},

  navbar: {
    color: "black",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  navRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },

  logoutBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  content: {
    display: "flex",
  },

  sidebar: {
    width: "240px",
    color: "black",
    minHeight: "100vh",
    padding: "25px",
  },

  logo: {
    marginBottom: "30px",
  },

  menu: {
    padding: "12px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "10px",
  },

  main: {
    flex: 1,
    padding: "20px",
  },

  banner: {
    background: "#f4a261",
    color: "white",
    padding: "30px",
    borderRadius: "20px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginTop: "20px",
  },

  statCard: {
    background: "#a5d697",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "20px",
  },

  actionCard: {
    background: "#a5d697",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  greenBtn: {
    background: "#d35400",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  blueBtn: {
    background: "#d35400",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px",
    marginTop: "20px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
};