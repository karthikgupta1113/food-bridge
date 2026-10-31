
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Donordashboard.css";
import { getCurrentUser, getDonations } from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,

  


} from "recharts";
function DonorDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser() || {};
  const [selectedTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: Number(currentUser.donations || 0),
    active: 0,
    completed: 0,
    peopleServed: 0,
  });
  const [statusData, setStatusData] = useState([
    { name: "Available", value: 0 },
    { name: "Pending pickup", value: 0 },
    { name: "Claimed", value: 0 },
    { name: "Delivered", value: 0 },
  ]);

const COLORS = [
  "#769268",
  "#A56726",
  "#295687",
  "#447344"
];
const regions = [
  { name: "Hyderabad", percentage: 65 },
  { name: "Visakhapatnam", percentage: 70 },
  { name: "Vijayawada", percentage: 55 },
  { name: "Guntur", percentage: 40 }
];

useEffect(() => {
  const loadDonations = async () => {
    try {
      const items = await getDonations();
      const userDonations = (items || []).filter((item) => {
        const donorName = (item.donorName || item.donor_name || "").toString().toLowerCase();
        const currentEmail = (currentUser.email || "").toString().toLowerCase();
        const currentName = (currentUser.fullName || currentUser.full_name || "").toString().toLowerCase();
        const itemEmail = (item.email || "").toString().toLowerCase();
        return !itemEmail || itemEmail === currentEmail || donorName === currentName || donorName === (currentUser.fullName || "").toLowerCase();
      });

      const total = userDonations.length > 0 ? userDonations.length : Number(currentUser.donations || 0);
      const active = userDonations.filter((item) => {
        const status = (item.status || "").toString().trim().toLowerCase();
        return ["available", "accepted", "pending pickup", "claimed", "active", "requested", "in progress"].includes(status);
      }).length;
      const completed = userDonations.filter((item) => {
        const status = (item.status || "").toString().trim().toLowerCase();
        return ["delivered", "completed", "done", "fulfilled"].includes(status);
      }).length;
      const peopleServed = userDonations.reduce((sum, item) => {
        const quantity = item.quantity || item.serves || item.peopleServed || item.meals_saved;
        const parsed = Number(String(quantity).replace(/[^0-9.-]/g, ""));
        return sum + (Number.isFinite(parsed) ? parsed : 0);
      }, 0);

      setDonations(userDonations);
      setStats({ total, active, completed, peopleServed });
      setStatusData([
        { name: "Available", value: userDonations.filter((item) => (item.status || "").toString().trim().toLowerCase() === "available").length },
        { name: "Pending pickup", value: userDonations.filter((item) => ["accepted", "pending pickup"].includes((item.status || "").toString().trim().toLowerCase())).length },
        { name: "Claimed", value: userDonations.filter((item) => ["requested", "claimed", "in progress"].includes((item.status || "").toString().trim().toLowerCase())).length },
        { name: "Delivered", value: userDonations.filter((item) => ["delivered", "completed", "done", "fulfilled"].includes((item.status || "").toString().trim().toLowerCase())).length },
      ]);
    } catch (error) {
      console.error("Unable to load donor donations", error);
      setDonations([]);
      setStats({ total: Number(currentUser.donations || 0), active: 0, completed: 0, peopleServed: 0 });
      setStatusData([
        { name: "Available", value: 0 },
        { name: "Pending pickup", value: 0 },
        { name: "Claimed", value: 0 },
        { name: "Delivered", value: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  loadDonations();
}, [currentUser.email, currentUser.fullName, currentUser.full_name, currentUser.donations]);

const filteredDonations = donations.filter((item) => {
  const matchesStatus = selectedTab === "All" || item.status === selectedTab;
  const title = (item.foodName || item.title || "").toString().toLowerCase();
  const matchesSearch = title.includes(searchTerm.toLowerCase());
  return matchesStatus && matchesSearch;
});
  return (
    
    

      

      <main className="content">
      <div className="topbar">

  <div className="brand">
    <h1> 🤝 Food Bridge</h1>
  </div>

  <div className="nav-actions">

    <button
      className="create-btn"
      onClick={() => navigate("/donate")}
    >
      ➕ Create Donation
    </button>

    <button
      className="reward-btn"
      onClick={() => navigate("/rewards")}
    >
      🎁 Rewards
    </button>

    <button
      className="profile-btn"
      onClick={() => navigate("/profile")}
    >
      👤 User
    </button>

  </div>

</div>
<h2>Donor Dashboard</h2>
<br/>
       <div className="stats"> 
        
      <div className="stat-card card1"> 
        <h3>{stats.total}</h3> 
        <p>Total Donations</p> 
        </div> 
        <div className="stat-card card2"> 
          <h3>{stats.active}</h3> <p>Active</p>
        
           </div>
            <div className="stat-card card3">
               <h3>{stats.completed}</h3>
                <p>Completed</p>
                 </div>
                  <div className="stat-card card4">
                     <h3>{stats.peopleServed}</h3>
                      <p>People Served</p>
                       </div> 
                       </div>
                      
        <div className="analytics">
          <h2>Donation Analytics</h2>
          <div className="chart-row">
<div className="chart-card">
  <h2>Donation Status</h2>
  <ResponsiveContainer width="100%" height={350}>
    <PieChart>
      <Pie
        data={statusData}
        dataKey="value"
        innerRadius={90}
        outerRadius={130}
        paddingAngle={5}
      >
        {statusData.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index]}
          />
        ))}
      </Pie>

      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>
 <div className="chart-card">
      <h2>Top Donation Regions</h2>
      {regions.map((region, index) => (
        <div className="region" key={index}>
          <span>{region.name}</span>

          <div className="progress">
            <div
              className="fill"
              style={{ width: `${region.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
</div>
</div>
<div className="donation-actions">

  <h2>Your Donation Actions</h2>


  

  <input
    type="text"
    placeholder="🔍 Search by food,serves..."
    className="search-box"
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
  />

  <div className="donation-grid">
    {loading ? (
      <div className="empty-state-card">
        <h3>Loading your donations...</h3>
      </div>
    ) : filteredDonations.length === 0 ? (
      <div className="empty-state-card">
        <h3>No donations yet</h3>
        <p>Create your first donation to see it here.</p>
      </div>
    ) : (
      filteredDonations.map((item) => (
        <div className="food-card" key={item.id}>
          <img src={item.image || ""} alt={item.foodName || item.title || "Donation"} />
          <h3>{item.foodName || item.title}</h3>
          <p>{item.quantity || item.serves || "Quantity not provided"}</p>
          <span className={`status ${(item.status || "Available").toLowerCase().replace(" ", "-")}`}>
            {item.status || "Available"}
          </span>
        </div>
      ))
    )}
  </div>

</div>
 </main>

  );
}

export default DonorDashboard;