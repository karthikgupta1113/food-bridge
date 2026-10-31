import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { rarityStyles } from './RewardsData';
import '../styles/ScratchRewardCard.css';

export function ScratchRewardCard({ reward, onRedeemed, onClose }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const rarityStyle = rarityStyles[reward.rarity] || rarityStyles.common;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 150;

    // Draw scratch layer
    ctx.fillStyle = rarityStyle.border;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < 10; i++) {
      ctx.fillRect(i * 30, 0, 15, canvas.height);
    }

    // Add text
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Reveal →', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText('Your Secret Reward', canvas.width / 2, canvas.height / 2 + 20);
  }, [rarityStyle.border]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    scratch(e);
  };

  const handleMouseMove = (e) => {
    if (isDrawing && !isRevealed) {
      scratch(e);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const scratch = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(x - 15, y - 15, 30, 30);

    // Calculate reveal percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let scratchedPixels = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) {
        scratchedPixels++;
      }
    }

    const progress = (scratchedPixels / (canvas.width * canvas.height)) * 100;
    setScratchProgress(progress);

    if (progress > 60) {
      handleReveal();
    }
  };

  const handleReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleRedeem = () => {
    if (onRedeemed) {
      onRedeemed(reward);
    }
    setTimeout(() => {
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <motion.div
      className="scratch-reward-container"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Blur */}
      <motion.div className="scratch-overlay" onClick={onClose} />

      {/* Card */}
      <motion.div 
        className="scratch-card-wrapper"
        style={{ borderColor: rarityStyle.border }}
      >
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Rarity Badge */}
        <motion.div 
          className="rarity-badge"
          style={{ 
            background: rarityStyle.bgGradient,
            border: `2px solid ${rarityStyle.border}`,
            boxShadow: `0 0 20px ${rarityStyle.glow}40`
          }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="rarity-label">{rarityStyle.label}</span>
          <span className="rarity-icon">
            {reward.rarity === 'common' && '⭐'}
            {reward.rarity === 'rare' && '✨'}
            {reward.rarity === 'epic' && '💎'}
            {reward.rarity === 'legendary' && '👑'}
          </span>
        </motion.div>

        {/* Header */}
        <div className="scratch-header">
          <h2>{reward.brand}</h2>
          <p className="scratch-progress">{Math.round(scratchProgress)}% scratched</p>
        </div>

        {/* Reward Info */}
        <div className="reward-info">
          <div className="reward-image">
            <span className="emoji-icon">{reward.image}</span>
          </div>
          <div className="reward-text">
            <h3>{reward.reward}</h3>
            <p className="description">{reward.reward}</p>
          </div>
        </div>

        {/* Scratch Layer */}
        <div className="scratch-layer-container">
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Reveal Layer */}
          <motion.div
            className="reveal-layer"
            animate={isRevealed ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Success Animation */}
        {showSuccess && (
          <motion.div
            className="success-badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            <span className="check-mark">✓</span>
            <p>Reward Unlocked!</p>
          </motion.div>
        )}

        {/* Coupon Code */}
        {isRevealed && (
          <motion.div
            className="coupon-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className="coupon-label">Coupon Code</p>
            <div className="coupon-code-box">
              <span className="code">{reward.couponCode}</span>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(reward.couponCode);
                  alert('Coupon copied!');
                }}
              >
                📋 Copy
              </button>
            </div>
          </motion.div>
        )}

        {/* Redeem Button */}
        {isRevealed && (
          <motion.button
            className="redeem-btn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRedeem}
            style={{ 
              background: `linear-gradient(135deg, ${rarityStyle.border} 0%, ${rarityStyle.glow} 100%)`,
            }}
          >
            ✨ Redeem Offer
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ScratchRewardCard;
