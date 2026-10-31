import React from 'react';
import { motion } from 'framer-motion';

export default function WinScratchPopup({ onReveal, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500 }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{ width: 360, borderRadius: 12, background: '#fff', padding: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', zIndex: 1600, textAlign: 'center' }}
      >
        <h3 style={{ margin: 0, fontSize: 18 }}>🎉 You won a scratch card!</h3>
        <p style={{ color: '#555', marginTop: 8 }}>Click reveal to see your reward in the Rewards section.</p>

        <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'center' }}>
          <button onClick={onReveal} style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Reveal</button>
          <button onClick={onClose} style={{ background: 'transparent', color: '#1a73e8', border: '1px solid #cfe0ff', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
