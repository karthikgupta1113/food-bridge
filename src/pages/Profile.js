import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { getCurrentUser, logout } from "../api";

function Profile() {
  const navigate = useNavigate();
  const user = getCurrentUser() || {};

  const avatars = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=John",
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia"
  ];

  const [profileImage, setProfileImage] = useState(
    user.profileImage || avatars[0]
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      const updatedUser = {
        ...user,
        profileImage: imageUrl
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );
    }
  };

  const selectAvatar = (avatar) => {
    setProfileImage(avatar);

    const updatedUser = {
      ...user,
      profileImage: avatar
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-card">

        <div className="profile-header">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-img"
          />

          <h2>{user.fullName}</h2>
          <p>{user.role}</p>

          <label className="upload-btn">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </label>
        </div>

        <div className="avatar-section">
          <h3>Select Avatar</h3>

          <div className="avatar-grid">
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt="avatar"
                className="avatar-option"
                onClick={() => selectAvatar(avatar)}
              />
            ))}
          </div>
        </div>

        <div className="profile-details">

          <div className="detail-row">
            <span>📧 Email</span>
            <span>{user.email}</span>
          </div>

          <div className="detail-row">
            <span>📱 Phone</span>
            <span>{user.phone}</span>
          </div>

          <div className="detail-row">
            <span>👤 User Type</span>
            <span>{user.role}</span>
          </div>

          <div className="detail-row">
            <span>📅 Joined</span>
            <span>{user.joined}</span>
          </div>

          <div className="detail-row">
            <span>🍱 Donations</span>
            <span>{user.donations || 0}</span>
          </div>

        </div>

        <div className="profile-buttons">
          <button
            type="button"
            className="logout-btn"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;