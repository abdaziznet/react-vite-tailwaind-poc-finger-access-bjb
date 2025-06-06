import React, { useState } from 'react';
import { getFingerIndexFromEnum } from '../utils/fingerUtils';
import FingerSelector from '../components/FingerSelector';
import {fingerSelectorPositions} from '../constants/FingerConstant';
import ScanResult from '../components/ScanResult';

const Identify = () => {
  const [selectedFingers, setSelectedFingers] = useState(Array(fingerSelectorPositions.length).fill(false));
  const [formData, setFormData] = useState({ userId: '', firstName: '', lastName: '', score: ''});
  const [fingerIndex, setFingerIndex] = useState(0);
  const [log, setLog] = useState({ message: '', type: '' });
  const [scanImage, setScanImage] = useState(null);


  const toggleFinger = (index) => {
    const updated = Array(fingerSelectorPositions.length).fill(false);
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
      score: ''
    }));

    toggleFinger(null);
    setScanImage(null);

    setLog({ message: 'Please place your finger...', type: 'info' });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const url = import.meta.env.VITE_ENDPOINT_URL + '/api/identify';
      console.log(url);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await res.json();
      console.log('Identify response:', data);
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
          score: parseInt(data.Score, 5) || 0
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
        <label className="block mb-2 text-sm font-medium">Score</label>
        <input type="text" className="w-full mb-4 border border-gray-300 rounded px-2 py-1" value={formData.score} disabled />
      </div>

      <div className="flex flex-col items-center">
        <FingerSelector selectedFingers={selectedFingers} toggleFinger={toggleFinger} fingerPositions={fingerSelectorPositions} selectorDisabled={true}/>
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

      <ScanResult scanImage={scanImage}/>
    </div>
  );
};

export default Identify;
