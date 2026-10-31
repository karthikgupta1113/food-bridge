import React, { useState, useEffect } from "react";
import RewardPopup from "../components/RewardPopup";
import { rarityStyles } from "../components/RewardsData";
import "../styles/Rewards.css";

function Rewards() {
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showRewardDetail, setShowRewardDetail] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load redeemed rewards from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('redeemedRewards') || '[]');
    setRedeemedRewards(stored);
    // If a reward was just revealed from another flow, open it
    try {
      const open = JSON.parse(localStorage.getItem('openReward') || 'null');
      if (open) {
        setSelectedReward(open);
        setShowRewardDetail(true);
        // clear marker
        localStorage.removeItem('openReward');
      }
    } catch (e) {}
  }, []);

  const handleRewardRedeemed = (reward) => {
    const updated = [...redeemedRewards, reward];
    setRedeemedRewards(updated);
    localStorage.setItem('redeemedRewards', JSON.stringify(updated));
  };

  return (
    <div className="rewards-container">
      {/* Premium Mystery Box Popup */}
      <RewardPopup 
        isOpen={showMysteryBox} 
        onClose={() => setShowMysteryBox(false)}
        onRewardRedeemed={handleRewardRedeemed}
      />

      {/* Header */}
      <div className="rewards-header">
        <h1>
          <span className="brand">FoodShare</span>: Your Donations, Your Rewards
        </h1>
        <div className="header-icons">
          🔔 👤
        </div>
      </div>

      {/* Premium Mystery Box Section */}
      <div className="premium-section">
        <div className="mystery-box-banner">
          <div className="banner-content">
            <h2>✨ Unlock Your Mystery Gift</h2>
            <p>Every donation brings you closer to amazing rewards!</p>
            <button 
              className="open-mystery-btn"
              onClick={() => setShowMysteryBox(true)}
            >
              🎁 Open Mystery Box
            </button>
          </div>
          <div className="banner-decoration">
            <span>🎊</span>
            <span>🎁</span>
            <span>⭐</span>
          </div>
        </div>
      </div>

      {/* Reward History Button */}
      <div className="history-button-section">
        <button 
          className="history-toggle-btn"
          onClick={() => setShowHistory(!showHistory)}
        >
          📜 Reward History ({redeemedRewards.length})
          <span className="toggle-icon">{showHistory ? '▼' : '▶'}</span>
        </button>
      </div>

      {/* Reward History Section */}
      {showHistory && (
        <div className="reward-history-section">
          <div className="history-container">
            {redeemedRewards.length > 0 ? (
              <div className="history-list">
                {redeemedRewards.map((reward, index) => (
                  <div 
                    key={index} 
                    className="history-item clickable-reward"
                    onClick={() => {
                      setSelectedReward(reward);
                      setShowRewardDetail(true);
                    }}
                  >
                    <span className="history-icon">✓</span>
                    <div className="history-reward-info">
                      <span className="history-text">{reward.brand}</span>
                      <span className="reward-coupon">{reward.couponCode}</span>
                    </div>
                    <span className="click-icon">→</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-history">No reward history yet. Start donating to earn rewards!</p>
            )}
          </div>
        </div>
      )}

      {/* Reward Detail Modal */}
      {showRewardDetail && selectedReward && (
        <div className="reward-modal-overlay" onClick={() => setShowRewardDetail(false)}>
          <div className="reward-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowRewardDetail(false)}>✕</button>
            <div className="modal-reward-display">
              <h2>{selectedReward.brand}</h2>
              <p className="modal-reward-text">{selectedReward.reward}</p>
              <div className="modal-coupon-section">
                <p>Coupon Code</p>
                <div className="modal-coupon-box">
                  <span className="modal-code">{selectedReward.couponCode}</span>
                  <button 
                    className="modal-copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedReward.couponCode);
                      alert('Coupon copied!');
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              <div className="modal-rarity-badge" style={{
                background: rarityStyles[selectedReward.rarity]?.bgGradient || '#f0f0f0',
                borderColor: rarityStyles[selectedReward.rarity]?.border || '#ccc'
              }}>
                {selectedReward.rarity.toUpperCase()} REWARD
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Motivation Banner */}
      <div className="motivation-banner">
        <div>
          <h2>🎁 Give More, Earn More!</h2>
          <p>The more you donate, the more rewards you unlock.</p>
        </div>
      </div>
    </div>
  );
}

export default Rewards;