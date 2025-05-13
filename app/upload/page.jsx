'use client';
import FileUpload from '../../components/FileUpload';

export default function UploadPage() {
  const handleUpload = (file) => {
    console.log('Uploaded file:', file);
    // pass to ML model here
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Dental X-Ray</h1>
      <FileUpload onUpload={handleUpload} />
    </div>
  );
}
