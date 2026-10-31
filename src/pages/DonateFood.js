import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateProfile, addDonation } from "../api";
import WinScratchPopup from "../components/WinScratchPopup";
import { getRandomReward } from "../components/RewardsData";
import "../styles/DonateFood.css"
import bgImage from "../assets/bggg.jpg";

function FoodDonation() {
  const navigate = useNavigate();
  const [foodImage, setFoodImage] = useState(null);


  const [formData, setFormData] = useState({
    donorName: "",
    mobileNumber: "",
    foodName: "",
    quantity: "",
    category: "",
    pickupDate: "",
    pickupTime: "",
    address: "",
  });

  const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = getCurrentUser() || {};
    const nextDonationCount = (currentUser.donations || 0) + 1;

    if (!formData.foodName || !formData.quantity || !formData.category) {
      alert("Please complete the food name, quantity, and category.");
      return;
    }

    const donationPayload = {
      id: Date.now().toString(),
      donorName: formData.donorName || currentUser.fullName || "Anonymous",
      mobileNumber: formData.mobileNumber,
      foodName: formData.foodName,
      quantity: formData.quantity,
      category: formData.category,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      address: formData.address,
      image: foodImage ? await fileToDataUrl(foodImage) : "",
      status: "Available",
      createdAt: new Date().toISOString(),
    };

    try {
      await addDonation(donationPayload);
      await updateProfile({ donations: nextDonationCount });
      // show small win popup instead of alert
      setShowWin(true);
    } catch (error) {
      setNotice(error.message || "Unable to submit donation. Please try again.");
    }
  };

  const [showWin, setShowWin] = useState(false);
  const [notice, setNotice] = useState("");

  const handleReveal = () => {
    // pick a random reward and persist so Rewards page can show it
    const reward = getRandomReward();
    try {
      // append to redeemedRewards list
      const stored = JSON.parse(localStorage.getItem('redeemedRewards') || '[]');
      const updated = [reward, ...stored];
      localStorage.setItem('redeemedRewards', JSON.stringify(updated));
      // store an openReward marker so Rewards page opens detail
      localStorage.setItem('openReward', JSON.stringify(reward));
    } catch (e) {}
    setShowWin(false);
    navigate('/rewards');
  };

  return (
    <div
  className="donation-page"
  style={{
    backgroundImage: `url(${bgImage})`,
  }}
>
      <div className="donation-card">
        <div className="header">
          <span className="food-icon">🍱</span>
          <h1>Donate Food</h1>
          <p>
            Your donation can bring hope and a meal to someone in need.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Donor Name</label>
            <input
              type="text"
              name="donorName"
              placeholder="Enter your full name"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              placeholder="Enter your mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="input-group">
              <label>Food Name</label>
              <input
                type="text"
                name="foodName"
                placeholder="Enter the food item name"
                value={formData.foodName}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Quantity</label>
              <input
                type="text"
                name="quantity"
                placeholder="5 kg / 10 packets"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Food Category</label>
            <select name="category" onChange={handleChange}>
              <option>Select Category</option>
              <option>Cooked Food</option>
              <option>Raw Food</option>
              <option>Packed Food</option>
            </select>
          </div>
          <div className="input-group">
  <label>Upload Food Image</label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setFoodImage(e.target.files[0])}
  />

  {foodImage && (
    <img
      src={URL.createObjectURL(foodImage)}
      alt="Food Preview"
      style={{
        width: "200px",
        height: "150px",
        objectFit: "cover",
        marginTop: "10px",
        borderRadius: "10px",
        border: "2px solid #ddd",
      }}
    />
  )}
</div>

          <div className="row">
            <div className="input-group">
              <label>Pickup Date</label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Pickup Time</label>
              <select
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
              >
                <option value="">Select pickup time</option>
                <option value="08:00">08:00 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Pickup Address</label>
            <textarea
              name="address"
              rows="3"
              placeholder="House No, Street, Landmark, Area, City, PIN Code"
              onChange={handleChange}
            ></textarea>
          </div>
          

          <button type="submit" className="donate-btn">
            ❤️ Donate Now
          </button>
        </form>

        {notice && <div style={{ color: '#b91c1c', marginTop: 12, fontWeight: 700 }}>{notice}</div>}

        {showWin && <WinScratchPopup onReveal={handleReveal} onClose={() => setShowWin(false)} />}

        <p className="footer-text">
          Thank you for helping us fight hunger and spread kindness.
        </p>
      </div>
    </div>
  );
}

export default FoodDonation;