import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Receiverdashboard.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { getDonations, addRequest, updateDonation } from "../api";

const normalizeDonation = (item) => ({
  ...item,
  title: item?.title || item?.foodName || "Unnamed donation",
  quantity: item?.quantity || item?.serves || "N/A",
  image:
    item?.image ||
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600",
  donorName: item?.donorName || "Unknown Donor",
  address: item?.address || "",
  category: item?.category || "",
  status: typeof item?.status === "string" && item.status.trim() ? item.status.trim() : "Available",
});

function NGODashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, peopleFed: 0 });

  const loadDonations = async () => {
    try {
      const items = await getDonations();
      const normalizedItems = (items || []).map(normalizeDonation);
      setDonations(normalizedItems);

      const total = normalizedItems.length;
      const active = normalizedItems.filter((item) => {
        const status = (item.status || "").toString().trim().toLowerCase();
        return ["available", "requested", "accepted", "pending pickup", "claimed", "in progress"].includes(status);
      }).length;
      const completed = normalizedItems.filter((item) => {
        const status = (item.status || "").toString().trim().toLowerCase();
        return ["delivered", "completed", "done", "fulfilled"].includes(status);
      }).length;
      const peopleFed = normalizedItems.reduce((sum, item) => {
        const quantity = item.quantity || item.serves || item.peopleFed || item.meals_saved;
        const parsed = Number(String(quantity).replace(/[^0-9.-]/g, ""));
        return sum + (Number.isFinite(parsed) ? parsed : 0);
      }, 0);

      setStats({ total, active, completed, peopleFed });
    } catch (error) {
      console.error("Unable to load donations", error);
      alert(error.message || "Unable to load donations.");
    }
  };

  const foodData = [
    { name: "Snacks & Juice", qty: 30 },
    { name: "Rice & Canned Goods", qty: 25 },
    { name: "Fresh Fruits", qty: 20 },
    { name: "Fresh Vegetables", qty: 15 },
    { name: "Bread & Pastries", qty: 15 },
    { name: "Frozen Meat", qty: 8 },
  ];

  const ReceivedData = [
    { month: "Jan-feb", donations: 4 },
    { month: "mar-apr", donations: 8 },
    { month: "may-june", donations: 6 },
    { month: "july-aug", donations: 12 },
    { month: "sept-oct", donations: 10 },
    { month: "nov-dec", donations: 15 },
  ];

  useEffect(() => {
    loadDonations();
  }, []);

  const filteredDonations = donations.filter((item) => {
    const normalizedItem = normalizeDonation(item);
    const matchesStatus = selectedTab === "All" || normalizedItem.status === selectedTab;

    const itemName = normalizedItem.title.toLowerCase();
    const matchesSearch = itemName.includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleAccept = (item) => {
    setSelectedDonation(item);
    setShowConfirm(true);
  };

  const confirmAccept = async () => {
    if (!selectedDonation) return;

    try {
      await addRequest({
        id: Date.now().toString(),
        donationId: selectedDonation.id,
        title: selectedDonation.title || selectedDonation.foodName || "Food Donation",
        serves: selectedDonation.serves,
        quantity: selectedDonation.quantity || selectedDonation.serves,
        status: "Accepted",
        image: selectedDonation.image,
        donorName: selectedDonation.donorName || "Unknown Donor",
        category: selectedDonation.category || "",
        address: selectedDonation.address || "",
        pickup_address: selectedDonation.address || "",
        dropoff_address: selectedDonation.dropoff_address || selectedDonation.dropoffAddress || "Recipient location pending",
        acceptedAt: new Date().toISOString(),
      });
      await updateDonation(selectedDonation.id.toString(), {
        status: "Accepted",
      });
      await loadDonations();
      setShowConfirm(false);
      alert("Donation accepted. It will now appear in browse.");
    } catch (error) {
      alert(error.message || "Unable to accept donation.");
    }
  };

  return (
    <main className="content">
      <div className="topbar">
        <div className="brand">
          <h1> 🤝 Food Bridge</h1>
        </div>
        <div className="nav-actions">
          <button className="create-btn" onClick={() => navigate("/receive")}>🥗Browse Donations</button>
          <button className="profile-btn" onClick={() => navigate("/profile")}>👤 User</button>
        </div>
      </div>

      <h2>NGO Dashboard</h2>

      <div className="ngo-action-row">
        <button
          className="volunteer-list-btn"
          onClick={() => navigate("/volunteer-list")}
        >
          👥 Volunteer List
        </button>
      </div>

      <div className="stats">
        <div className="stat-card card1">
          <h3>{stats.total}</h3>
          <p>Donations</p>
        </div>
        <div className="stat-card card2">
          <h3>{stats.active}</h3>
          <p>Active Claims</p>
        </div>
        <div className="stat-card card3">
          <h3>{stats.completed}</h3>
          <p>Delivered</p>
        </div>
        <div className="stat-card card4">
          <h3>{stats.peopleFed}</h3>
          <p>People fed</p>
        </div>
      </div>

      <div className="analytics">
        <h2>Analytics</h2>
        <div className="chart-row">
          <div className="chart-card">
            <h2>Food Received Quantity (kg eq)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={foodData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#9B4A34" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h2>Monthly Donations Received</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={ReceivedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="donations" stroke="#9B4A34" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="receiver-section">
        <h2>NGO Actions</h2>
        <input
          type="text"
          placeholder="🔍 Search by food, serves or status..."
          className="search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-tabs">
          {["All", "Available", "Requested", "In Progress", "Delivered"].map((tab) => (
            <button
              key={tab}
              className={selectedTab === tab ? "tab active" : "tab"}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="receiver-grid">
          {filteredDonations.map((item) => {
            const normalizedItem = normalizeDonation(item);
            const statusClass = normalizedItem.status.toLowerCase().replace(/\s+/g, "-");

            return (
              <div className="food-card" key={normalizedItem.id}>
                <img src={normalizedItem.image} alt={normalizedItem.title} />
                <h3>{normalizedItem.title}</h3>
                <p>Quantity: {normalizedItem.quantity}</p>
                <span className={`status ${statusClass}`}>{normalizedItem.status}</span>
                {normalizedItem.status === "Available" && (
                  <button className="accept-btn" onClick={() => handleAccept(normalizedItem)}>
                    Accept
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showConfirm && selectedDonation && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Accept Donation</h2>
            <img src={selectedDonation.image} alt={selectedDonation.title} />
            <p>
              <strong>{selectedDonation.title}</strong>
            </p>
            <p>Quantity: {selectedDonation.quantity || selectedDonation.serves}</p>
            {selectedDonation.category && <p>Category: {selectedDonation.category}</p>}
            {selectedDonation.address && <p>Pickup Address: {selectedDonation.address}</p>}
            {selectedDonation.donorName && <p>From: {selectedDonation.donorName}</p>}
            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="modal-confirm" onClick={confirmAccept}>
                Confirm Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default NGODashboard;
