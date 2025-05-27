import React, { useState } from 'react';
import fingerImg from '../assets/finger.png';
import { getEnumFromFingerIndex } from '../utils/fingerUtils';

const fingerPositions = [
  { left: '-2%', top: '23%' }, // Left pinky
  { left: '6%', top: '-3%' }, // Left ring
  { left: '18%', top: '-13%' },  // Left middle
  { left: '30%', top: '-7%' }, // Left index
  { left: '45%', top: '40%' }, // Left thumb
  { left: '53%', top: '40%' }, // Right thumb
  { left: '67%', top: '-7%' }, // Right index
  { left: '79%', top: '-13%' },  // Right middle
  { left: '92%', top: '-3%' }, // Right ring
  { left: '100%', top: '23%' }, // Right pinky
];

const Enroll = () => {
  const [selectedFingers, setSelectedFingers] = useState(
    Array(fingerPositions.length).fill(false)
  );

  const toggleFinger = (index) => {
    // const updated = [...selectedFingers];
    // updated[index] = !updated[index];
    // setSelectedFingers(updated);

    const updated = Array(fingerPositions.length).fill(false);
    if (!selectedFingers[index]) {
      updated[index] = true;
      setFingerIndex(index);
      setSelectedFingers(updated);
      setScanImage(null);
      setLog('');
    } else {
      setSelectedFingers(updated);
      setFingerIndex(index);
      setScanImage(null);
      setLog('');
    }
  };

  const [formData, setFormData] = useState({
    imageQuality: '70',
    userId: '',
    firstName: '',
    lastName: '',
  });

  const [fingerIndex, setFingerIndex] = useState(0);
  const [log, setLog] = useState({ message: '', type: '' });
  const [scanImage, setScanImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId.trim()) newErrors.userId = 'User ID is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const enrollCapture = async () => {
    if (!validateForm()) {
      setLog({ message: 'Please complete all required fields.', type: 'error' });
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



    const ENROLL_ENDPOINT = import.meta.env.VITE_ENDPOINT_URL + '/api/enroll';

    // console.log("url: " + ENROLL_ENDPOINT);

    setIsEnrolled(true);

    setLog({ message: 'Please place your finger...', type: 'info' });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {

      const fingerPosition = getEnumFromFingerIndex(fingerIndex); // Convert index (0-9) to enum (1-10)

      // console.log('Finger position:', fingerPosition);

      const userData = {
        userId: formData.userId,
        imageQualityThreshold: formData.imageQuality,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fingerPosition: fingerPosition
      };

      console.log('Sending user data:', userData);

      const res = await fetch("/data/enrollResult.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.OperationStatus === false) {
            setLog({ message: data.OperationMessage || 'Enrollment failed.', type: 'error' });
            setScanImage(null); // Kosongkan image jika gagal
          } else {
            setScanImage(data.CaptureImage);
            setLog({
              message: `Successfully enrollment finger for user (ID: ${formData.userId}) ${formData.firstName} ${formData.lastName}`,
              type: 'success'
            });
          }
        })
        .catch((error) => setLog('Failed to load fingerprint scan image. ' + error.message));
    } catch (err) {
      setLog({ message: 'Failed to load fingerprint scan image. ' + err.message, type: 'error' });
      console.error('Error during enrollment:', err);
    }
    finally {
      setIsEnrolled(false);
    }

  };

  return (
    <div className="flex flex-row items-start justify-center p-8 gap-8">
      {/* Form Section */}
      <div className="w-80 border border-gray-300 p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">User Information</h2>

        <label className="block mb-2 text-sm font-medium">Image Quality ({formData.imageQuality})</label>
        <input
          type="range"
          min="1"
          max="100"
          value={formData.imageQuality}
          onChange={(e) => setFormData({ ...formData, imageQuality: parseInt(e.target.value, 10) })}
          className="w-full mb-4"
        />

        <label className="block mb-2 text-sm font-medium">User ID <span className="text-red-500">*</span></label>
        <input
          type="text"
          className="w-full mb-4 border border-gray-300 rounded px-2 py-1"
          value={formData.userId}
          maxLength={10} 
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
        {errors.userId && <p className="text-xs text-red-500 mb-2">{errors.userId}</p>}

        <label className="block mb-2 text-sm font-medium">First Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          className="w-full mb-4 border border-gray-300 rounded px-2 py-1"
          value={formData.firstName}
          maxLength={20} 
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        {errors.firstName && <p className="text-xs text-red-500 mb-2">{errors.firstName}</p>}

        <label className="block mb-2 text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          className="w-full mb-4 border border-gray-300 rounded px-2 py-1"
          value={formData.lastName}
          maxLength={20} 
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        {errors.lastName && <p className="text-xs text-red-500 mb-2">{errors.lastName}</p>}
      </div>

      {/* Finger UI Section */}
      <div className="flex flex-col items-center">
        <div className="relative w-[700px] h-[505px] border border-gray-300">
          {/* <h2 className="text-lg text-center font-semibold mb-4 p-4">Enrollment</h2> */}
          <div className="absolute left-1/2 top-1/2 w-[80%] h-[50%] -translate-x-1/2 -translate-y-1/2">
            {/* Placeholder for hand outline */}

            {/* Finger checkbox targets */}
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
                />
              </label>
            ))}
            <img
              src={fingerImg}
              alt="Finger positions"
              className="w-full h-full object-cover">

            </img>
          </div>
        </div>
        <button
          onClick={enrollCapture}
          disabled={isEnrolled}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
        >
          Enroll
        </button>

        {log.message && (
          <p className={`mt-4 text-sm ${log.type === 'error' ? 'text-red-600' : log.type === 'success' ? 'text-green-600' : 'text-gray-700'}`}>{log.message}</p>
        )}
      </div>
      {/* Scanned Image Section */}
      <div className="w-60 border border-gray-300 p-4 rounded-lg shadow-sm flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4">Scan Result</h2>
        {scanImage ? (
          <img src={scanImage} alt="Fingerprint Scan" className="w-full rounded" />
        ) : (
          <p className="text-sm text-gray-500">No scan image</p>
        )}
      </div>
    </div>
  )
};

export default Enroll;
