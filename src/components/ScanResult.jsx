import React from 'react';

const ScanResult = ({ scanImage }) => {
  return (
    <div className="w-60 border border-gray-300 p-4 rounded-lg shadow-sm flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Scan Result</h2>
      {scanImage ? (
        <img src={scanImage} alt="Fingerprint Scan" className="w-full rounded" />
      ) : (
        <p className="text-sm text-gray-500">No scan image</p>
      )}
    </div>
  );
};

export default ScanResult;
