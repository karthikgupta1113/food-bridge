import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MysteryGiftBox from './MysteryGiftBox';
import ScratchRewardCard from './ScratchRewardCard';
import ConfettiEffect from './ConfettiEffect';
import { getRandomReward } from './RewardsData';
import '../styles/RewardPopup.css';

export function RewardPopup({ isOpen, onClose, onRewardRedeemed }) {
  const [stage, setStage] = useState('box'); // box, scratch, completed
  const [reward, setReward] = useState(null);
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setStage('box');
      setIsGiftOpened(false);
      setShowConfetti(false);
      setReward(getRandomReward());
    }
  }, [isOpen]);

  const handleGiftOpen = () => {
    setIsGiftOpened(true);
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
      setStage('scratch');
    }, 1500);
  };

  const handleRewardRedeemed = (redeemedReward) => {
    setShowConfetti(true);
    setRedeemedRewards([...redeemedRewards, redeemedReward]);

    // Store full reward object in localStorage
    const stored = JSON.parse(localStorage.getItem('redeemedRewards') || '[]');
    localStorage.setItem('redeemedRewards', JSON.stringify([...stored, redeemedReward]));

    // Call parent callback if provided
    if (onRewardRedeemed) {
      onRewardRedeemed(redeemedReward);
    }

    setTimeout(() => {
      setShowConfetti(false);
      setStage('completed');
    }, 1500);
  };

  const handlePopupClose = () => {
    setStage('box');
    setIsGiftOpened(false);
    setShowConfetti(false);
    onClose();
  };

  if (!isOpen || !reward) return null;

  return (
    <motion.div
      className="reward-popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={stage === 'completed' ? handlePopupClose : undefined}
    >
      {/* Confetti */}
      <ConfettiEffect isActive={showConfetti} width={window.innerWidth} height={window.innerHeight} />

      {/* Content */}
      <AnimatePresence mode="wait">
        {stage === 'box' && (
          <motion.div
            key="box"
            className="reward-popup-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MysteryGiftBox onOpen={handleGiftOpen} isOpened={isGiftOpened} />
          </motion.div>
        )}

        {stage === 'scratch' && (
          <motion.div key="scratch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ScratchRewardCard reward={reward} onRedeemed={handleRewardRedeemed} onClose={handlePopupClose} />
          </motion.div>
        )}

        {stage === 'completed' && (
          <motion.div
            key="completed"
            className="completion-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="completion-content"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <div className="completion-icon">🎉</div>
              <h2>Reward Redeemed!</h2>
              <p className="completion-text">{reward.title}</p>
              <p className="coupon-text">Code: {reward.couponCode}</p>
              <motion.button
                className="completion-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePopupClose}
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default RewardPopup;
