import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getVolunteerData } from "../data/volunteers";
import "../styles/Profile.css";

function VolunteerListPage() {
  const navigate = useNavigate();
  const volunteers = useMemo(() => getVolunteerData(), []);

  return (
    <div className="profile-container volunteer-page-container">
      <div className="profile-card volunteer-list-card">
        <div className="profile-header">
          <h2>Volunteer Network</h2>
          <p>Browse each volunteer profile in a full view.</p>
        </div>

        <div className="volunteer-page-grid">
          {volunteers.map((volunteer) => (
            <div className="volunteer-page-card" key={volunteer.id}>
              <div className="volunteer-avatar large">{volunteer.fullName?.charAt(0) || "V"}</div>
              <h3>{volunteer.fullName}</h3>
              <p>{volunteer.email}</p>
              <p>Impact: {volunteer.donations || 0} supported deliveries</p>
              <button
                className="view-profile-btn"
                onClick={() => navigate(`/volunteer-profile/${volunteer.id}`)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        <div className="profile-buttons">
          <button type="button" className="logout-btn" onClick={() => navigate("/receiver")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default VolunteerListPage;
