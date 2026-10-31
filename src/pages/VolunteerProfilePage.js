import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVolunteerById } from "../data/volunteers";
import "../styles/Profile.css";

function VolunteerProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const volunteer = useMemo(() => getVolunteerById(id), [id]);

  if (!volunteer) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h2>Volunteer not found</h2>
          <p>The requested volunteer profile could not be found.</p>
          <button className="view-profile-btn" onClick={() => navigate("/volunteer-list")}>
            Back to Volunteer List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card volunteer-profile-page-card">
        <div className="profile-header">
          <div className="volunteer-avatar large">{volunteer.fullName?.charAt(0) || "V"}</div>
          <h2>{volunteer.fullName}</h2>
          <p>{volunteer.role}</p>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span>📧 Email</span>
            <span>{volunteer.email}</span>
          </div>
          <div className="detail-row">
            <span>📱 Phone</span>
            <span>{volunteer.phone || "Not provided"}</span>
          </div>
          <div className="detail-row">
            <span>📅 Joined</span>
            <span>{volunteer.joined || "Recently joined"}</span>
          </div>
          <div className="detail-row">
            <span>🍱 Deliveries</span>
            <span>{volunteer.donations || 0}</span>
          </div>
        </div>

        <div className="impact-summary">
          <h4>Impact Summary</h4>
          <p>{volunteer.impact || "This volunteer is actively helping the community."}</p>
        </div>

        <div className="profile-buttons">
          <button type="button" className="view-profile-btn" onClick={() => navigate("/volunteer-list")}>
            Back to List
          </button>
          <button type="button" className="logout-btn" onClick={() => navigate("/receiver")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default VolunteerProfilePage;
