'use client';

import { useState } from 'react';
import { symptoms } from '../data/symptom';

export default function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const [report, setReport] = useState('');

  const handleChange = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const generateReport = () => {
    let suggestion = '';

    // Sample logic based on selected symptoms
    const has = (symptom) => selected.includes(symptom);

    if (has('Bleeding gums') && has('Swollen or red gums')) {
      suggestion = '🪥 Likely Gingivitis – Consider professional cleaning and improving oral hygiene.';
    } else if (has('Loose teeth') && has('Pus or swelling near tooth')) {
      suggestion = '⚠️ Possible Periodontitis – Seek dental care immediately to avoid bone loss.';
    } else if (has('Tooth pain or sensitivity') && has('Visible holes or pits in teeth')) {
      suggestion = '🦷 You may have Dental Caries (Cavities). A filling might be required.';
    } else if (has('Cracked or chipped tooth') && has('Pain when chewing')) {
      suggestion = '⚠️ Potential Tooth Fracture – You should see a dentist urgently.';
    } else if (selected.length === 0) {
      suggestion = '⚠️ Please select at least one symptom.';
    } else {
      suggestion = '🩺 These symptoms need expert evaluation. Please consult a dentist.';
    }

    setReport(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 sm:p-8 bg-white/70 backdrop-blur-md rounded-3xl shadow-md border border-gray-200">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-8">
        🦷 Dental Symptom Checker
      </h1>

      <div className="grid sm:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto px-1">
        {symptoms.map((symptom) => (
          <label
            key={symptom}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <input
              type="checkbox"
              value={symptom}
              onChange={() => handleChange(symptom)}
              checked={selected.includes(symptom)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded-md border-gray-300"
            />
            <span className="text-sm text-gray-700">{symptom}</span>
          </label>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={generateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full shadow-lg transition-all"
        >
          Run Symptom Checker
        </button>
      </div>

      {report && (
        <div className="mt-10 bg-blue-50 border-l-4 border-blue-400 text-blue-900 px-6 py-5 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">📝 Suggested Diagnosis</h2>
          <p className="leading-relaxed">{report}</p>
        </div>
      )}
    </div>
  );
}
