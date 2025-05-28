import React, { useEffect, useState } from 'react';
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

const Verify = () => {
  const [selectedFingers, setSelectedFingers] = useState(Array(fingerPositions.length).fill(false));
  const [formData, setFormData] = useState({ userId: '', firstName: '', lastName: '', score: '' });
  const [fingerIndex, setFingerIndex] = useState(0);
  const [log, setLog] = useState({ message: '', type: '' });
  const [scanImage, setScanImage] = useState(null);
  const [errors, setErrors] = useState({});

  const toggleFinger = (index) => {
    const updated = Array(fingerPositions.length).fill(false);
    updated[index] = true;
    setSelectedFingers(updated);
    setFingerIndex(index);
    setLog({ message: '', type: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId.trim()) newErrors.userId = 'User ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserIdChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, userId: value }));
  };

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams({ userid: formData.userId });
    const urlGetUser = `${import.meta.env.VITE_ENDPOINT_URL}/api/getuser?${params}`;

    console.log('Fetching finger index from:', urlGetUser);

    if (formData.userId.trim() !== '') {
      const timer = setTimeout(() => {
        fetch(urlGetUser, {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.OperationStatus === false) {
              setLog({ message: data.OperationMessage || 'Failed to retrieve user or finger index data.', type: 'error' });
              setScanImage(null);
            }
            else {
              if (data.FingerPosition !== undefined) {
                const fingerIndex = getFingerIndexFromEnum(data.FingerPosition);
                // console.log('finger position:',data.fingerPosition);
                // console.log('Finger index:', fingerIndex);
                toggleFinger(fingerIndex);
              }
            }
          })
          .catch((err) => {
            if (err.name !== 'AbortError') {
              console.error('Fetch error:', err);
              setLog({ message: 'Failed to retrieve user or finger index data.', type: 'error' });
            }
          });
      }, 500);

      return () => {
        clearTimeout(timer);
        controller.abort();
      };
    }
    else {
      toggleFinger(null);
      setFormData((prev) => ({ ...prev, firstName: '', lastName: '' }));
      setScanImage(null);
      setLog({ message: '', type: '' });
    }
  }, [formData.userId]);

  const verifyCapture = async () => {
    if (!validateForm()) {
      setLog({ message: 'Please fill User ID required fields.', type: 'info' });
      return;
    }

    const selected = selectedFingers
      .map((v, i) => (v ? `Finger ${i + 1}` : null))
      .filter(Boolean);

    if (selected.length === 0) {
      setLog({ message: 'No fingers selected for capture.', type: 'info' });
      setScanImage(null);
      return;
    }

    setLog({ message: 'Please place your finger...', type: 'info' });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const paramsUserId = new URLSearchParams({ userid: formData.userId });
      const urlverify = `${import.meta.env.VITE_ENDPOINT_URL}/api/verify?${paramsUserId}`;

      const res = await fetch(urlverify, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.OperationMessage || 'Failed to Verification');
      }

      if (data.OperationStatus === false) {
        setLog({ message: data.OperationMessage || 'Verification failed', type: 'error' });
        setScanImage(null); // Kosongkan image jika gagal
      }
      else {
        if (!data.IsMatch) {
          setLog({ message: data.OperationMessage || 'Not match user found', type: 'error' });
          setScanImage(null); // Kosongkan image jika gagal
          setFormData((prev) => ({
          ...prev,
          score: parseInt(data.Score, 5) || 0,
        }));
          return;
        }
        setFormData((prev) => ({
          ...prev,
          firstName: data.FirstName || '',
          lastName: data.LastName || '',
          score: parseInt(data.Score, 5) || 0,
        }));
        setScanImage(data.CaptureImage);
        setLog({ message: `Match user (ID: ${formData.userId}) ${data.FirstName} ${data.LastName}`, type: 'success' });
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
        <label className="block mb-2 text-sm font-medium">User ID <span className="text-red-500">*</span></label>
        <input
          type="text"
          className="w-full mb-4 border border-gray-300 rounded px-2 py-1"
          value={formData.userId}
          onChange={handleUserIdChange}
        />
        {errors.userId && <p className="text-xs text-red-500 mb-2">{errors.userId}</p>}

        <label className="block mb-2 text-sm font-medium">First Name</label>
        <input type="text" className="w-full mb-4 border border-gray-300 rounded px-2 py-1" value={formData.firstName} disabled />
        <label className="block mb-2 text-sm font-medium">Last Name</label>
        <input type="text" className="w-full mb-4 border border-gray-300 rounded px-2 py-1" value={formData.lastName} disabled />
        <label className="block mb-2 text-sm font-medium">Score</label>
        <input type="text" className="w-full mb-4 border border-gray-300 rounded px-2 py-1" value={formData.score} disabled />
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-[700px] h-[505px] border border-gray-300">
          {/* <h2 className="text-lg text-center font-semibold mb-4 p-4">Verification</h2> */}
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
          onClick={verifyCapture}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded"
        >
          Verify
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

export default Verify;
