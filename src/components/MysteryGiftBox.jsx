import React from 'react';
import { motion } from 'framer-motion';
import '../styles/MysteryGiftBox.css';

export function MysteryGiftBox({ onOpen, isOpened }) {

  const containerVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const boxVariants = {
    closed: {
      rotateX: 0,
      rotateY: 0,
    },
    opening: {
      rotateX: [0, -30, 180],
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  };

  const lidVariants = {
    closed: {
      rotateX: 0,
      y: 0,
    },
    opening: {
      rotateX: -90,
      y: -50,
      transition: { duration: 0.8, delay: 0.1, ease: 'easeInOut' },
    },
  };

  const glowVariants = {
    closed: { opacity: 0.5, scale: 1 },
    opening: { opacity: 1, scale: 1.3 },
    opened: { opacity: 0.3, scale: 0.8 },
  };

  const handleClick = () => {
    if (!isOpened) {
      onOpen();
    }
  };

  return (
    <motion.div
      className="gift-box-container"
      variants={containerVariants}
      initial="initial"
      whileHover={!isOpened ? 'hover' : 'initial'}
      onClick={handleClick}
    >
      {/* Sparkles Background */}
      <div className="sparkles">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="sparkle"
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + i * 0.1,
              repeat: Infinity,
              delay: i * 0.15,
            }}
            style={{
              left: `${Math.cos((i / 12) * Math.PI * 2) * 150 + 150}px`,
              top: `${Math.sin((i / 12) * Math.PI * 2) * 150 + 150}px`,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Glow Effect */}
      <motion.div
        className="glow-effect"
        variants={glowVariants}
        animate={isOpened ? 'opened' : 'closed'}
        initial="closed"
      />

      {/* Gift Box */}
      <motion.div
        className="gift-box"
        variants={boxVariants}
        animate={isOpened ? 'opening' : 'closed'}
        initial="closed"
      >
        {/* Box Body */}
        <div className="box-body">
          {/* Front Face */}
          <div className="box-face front">
            <div className="ribbon ribbon-horizontal" />
            <div className="ribbon ribbon-vertical" />
            <motion.div
              className="bow"
              animate={isOpened ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>

          {/* Back Face */}
          <div className="box-face back" />

          {/* Top Face (Lid) */}
          <motion.div
            className="box-face top"
            variants={lidVariants}
            animate={isOpened ? 'opening' : 'closed'}
            initial="closed"
          >
            <div className="ribbon ribbon-horizontal" />
            <div className="ribbon ribbon-vertical" />
          </motion.div>

          {/* Bottom Face */}
          <div className="box-face bottom" />

          {/* Left Face */}
          <div className="box-face left">
            <div className="ribbon ribbon-vertical" />
          </div>

          {/* Right Face */}
          <div className="box-face right">
            <div className="ribbon ribbon-vertical" />
          </div>
        </div>
      </motion.div>

      {/* Interactive Text */}
      <motion.div
        className="gift-text"
        animate={isOpened ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-main">Click to Open</p>
        <p className="text-sub">🎁 Claim Your Mystery Reward</p>
      </motion.div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              y: [0, -100, -50],
              x: [0, Math.cos((i / 8) * Math.PI * 2) * 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default MysteryGiftBox;
