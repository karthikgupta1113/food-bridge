import React from 'react';
import Confetti from 'react-confetti';

export function ConfettiEffect({ isActive, width, height }) {
  return (
    isActive && (
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        gravity={0.3}
        recycle={false}
        colors={['#FFD700', '#FFA500', '#18a558', '#FF6B6B', '#4ECDC4', '#FFB6C1']}
      />
    )
  );
}

export default ConfettiEffect;
