// components/PatientForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PatientForm() {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !age || !gender) {
      setErrorMessage('All fields are required!');
      return;
    }

    // Pass patient details to the symptom checker page via query params or context
    router.push({
      pathname: '/symptom-checker',
      query: { patientName, age, gender },
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 sm:p-8 bg-white/70 backdrop-blur-md rounded-3xl shadow-md border border-gray-200">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-8">
        🦷 Patient Information
      </h1>

      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Patient Name</label>
          <input
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Gender</label>
          <select
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all"
          >
            Continue to Symptom Checker
          </button>
        </div>
      </form>
    </div>
  );
}
