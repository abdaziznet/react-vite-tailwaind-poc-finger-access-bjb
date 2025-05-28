// components/FingerSelector.js
import React from 'react';
import fingerImg from '../assets/finger.png';

const FingerSelector = ({ selectedFingers, toggleFinger, fingerPositions, selectorDisabled }) => {
  return (
    <div className="relative w-[700px] h-[505px] border border-gray-300">
      <div className="absolute left-1/2 top-1/2 w-[80%] h-[50%] -translate-x-1/2 -translate-y-1/2">
        {fingerPositions.map((pos, idx) => (
          <label
            key={idx}
            className="absolute cursor-pointer"
            style={{ left: pos.left, top: pos.top }}
            title={`Finger ${idx + 1}`}
          >
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={selectedFingers[idx]}
              onChange={() => toggleFinger(idx)}
              disabled={selectorDisabled}
            />
          </label>
        ))}
        <img
          src={fingerImg}
          alt="Finger positions"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default FingerSelector;
