'use client';
import { useEffect, useState } from 'react';

export default function ReportPreview() {
  const [report, setReport] = useState('');

  useEffect(() => {
    // Replace with real data or API result
    setReport('🪥 You may be experiencing early gum issues. Seek dental advice.');
  }, []);

  const download = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dental_report.txt';
    a.click();
  };

  return (
    <div className="p-6 border bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">📝 Report Preview</h2>
      <p className="mb-6">{report}</p>
      <button onClick={download} className="bg-green-600 text-white px-6 py-2 rounded-lg">
        Download Report
      </button>
    </div>
  );
}
