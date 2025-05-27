import React, { useState } from 'react';
import fingerImg from '../assets/finger.png';
import { getFingerIndexFromEnum } from '../utils/fingerUtils';

const fingerPositions = [
  { left: '-2%', top: '23%' },
  { left: '6%', top: '-3%' },
  { left: '18%', top: '-13%' },
  { left: '30%', top: '-7%' },
  { left: '45%', top: '40%' },
  { left: '53%', top: '40%' },
  { left: '67%', top: '-7%' },
  { left: '79%', top: '-13%' },
  { left: '92%', top: '-3%' },
  { left: '100%', top: '23%' },
];

const Identify = () => {
  const [selectedFingers, setSelectedFingers] = useState(Array(fingerPositions.length).fill(false));
  const [formData, setFormData] = useState({ userId: '', firstName: '', lastName: '' });
  const [fingerIndex, setFingerIndex] = useState(0);
  const [log, setLog] = useState({ message: '', type: '' });
  const [scanImage, setScanImage] = useState(null);


  const toggleFinger = (index) => {
    const updated = Array(fingerPositions.length).fill(false);
    updated[index] = true;
    setSelectedFingers(updated);
    setFingerIndex(index);
  };

  const identifyCapture = async () => {

    setFormData((prev) => ({
      ...prev,
      userId: '',
      firstName: '',
      lastName: '',
    }));

    toggleFinger(null);
    setScanImage(null);

    setLog({ message: 'Please place your finger...', type: 'info' });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const url = import.meta.env.VITE_ENDPOINT_URL + '/api/identify';

      const res = await fetch('/data/identifyResult.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.OperationMessage || 'Failed to Identification');
      }

      if (data.OperationStatus === false) {
        setLog({ message: data.OperationMessage || 'Identification failed', type: 'error' });
        setScanImage(null); // Kosongkan image jika gagal
      }
      else {
        if (!data.IsMatch) {
          setLog({ message: data.OperationMessage || 'Not match user found', type: 'error' });
          setScanImage(null); // Kosongkan image jika gagal
          return;
        }

        setScanImage(data.CaptureImage);
        setFormData((prev) => ({
          ...prev,
          userId: data.UserId || '',
          firstName: data.FirstName || '',
          lastName: data.LastName || '',
        }));
        const fingerIndex = getFingerIndexFromEnum(data.FingerPosition);
        // console.log('finger position:',data.fingerPosition);
        // console.log('Finger index:', fingerIndex);
        toggleFinger(fingerIndex);
        setLog({
          message: `Match user (ID: ${data.UserId}) ${data.FirstName} ${data.LastName}`,
          type: 'success'
        });
      }
    } catch (err) {
      setLog({ message: 'Failed to load fingerprint scan image. ' + err.message, type: 'error' });
      console.error('Error during enrollment:', err);
    }
  };

  return (
    <div className="flex flex-row items-start justify-center p-8 gap-8">
      <div className="w-80 border border-gray-300 p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">User Information</h2>
        <label className="block mb-2 text-sm font-medium">User ID</label>
        <input
          type="text"
          className="w-full mb-4 border border-gray-300 rounded px-2 py-1"
          value={formData.userId}
          disabled
        />
        <label className="block mb-2 text-sm font-medium">First Name</label>
        <input type="text" className="w-full mb-4 border border-gray-300 rounded px-2 py-1" value={formData.firstName} disabled />
        <label className="block mb-2 text-sm font-medium">Last Name</label>
        <input type="text" className="w-full mb-4 border border-gray-300 rounded px-2 py-1" value={formData.lastName} disabled />
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-[700px] h-[505px] border border-gray-300">
          {/* <h2 className="text-lg text-center font-semibold mb-4 p-4">Identification</h2> */}
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
                  disabled
                />
              </label>
            ))}
            <img src={fingerImg} alt="Finger positions" className="w-full h-full object-cover" />
          </div>
        </div>
        <button
          onClick={identifyCapture}
          className="mt-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded"
        >
          Identify
        </button>

        {log.message && (
          <p className={`mt-4 text-sm ${log.type === 'error' ? 'text-red-600' : log.type === 'success' ? 'text-green-600' : 'text-gray-700'}`}>{log.message}</p>
        )}
      </div>

      <div className="w-60 border border-gray-300 p-4 rounded-lg shadow-sm flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Scan Result</h2>
        {scanImage ? (
          <img src={scanImage} alt="Fingerprint Scan" className="w-full rounded" />
        ) : (
          <p className="text-sm text-gray-500">No scan image</p>
        )}
      </div>
    </div>
  );
};

export default Identify;
