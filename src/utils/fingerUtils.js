// src/utils/fingerUtils.js

const fingerPositionEnum = {
  1: 5,
  2: 6,
  3: 7,
  4: 8,
  5: 9,
  6: 4,
  7: 3,
  8: 2,
  9: 1,
  10: 0
};

// Balikkan mapping: index → enum
const indexToEnum = Object.entries(fingerPositionEnum).reduce((acc, [key, value]) => {
  acc[value] = parseInt(key);
  return acc;
}, {});

/**
 * Convert enum (1–10) → UI index (0–9)
 * @param {number} enumNumber
 * @returns {number | undefined}
 */
export function getFingerIndexFromEnum(enumNumber) {
  return fingerPositionEnum[enumNumber];
}

/**
 * Convert UI index (0–9) → enum (1–10)
 * @param {number} index
 * @returns {number | undefined}
 */


export function getEnumFromFingerIndex(index) {
  return indexToEnum[index];
}
