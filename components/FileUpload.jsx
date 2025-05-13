'use client';
import { useState } from 'react';

export default function FileUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  return (
    <div className="p-6 border rounded-xl bg-gray-50 shadow-inner">
      <input type="file" accept="image/*" onChange={(e) => {
        setFile(e.target.files[0]);
        onUpload(e.target.files[0]);
      }} />
      {file && <p className="mt-2 text-sm">Selected: {file.name}</p>}
    </div>
  );
}
