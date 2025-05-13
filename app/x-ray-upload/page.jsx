'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function XRayUpload() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!file) {
    setErrorMessage('Please upload an X-ray image');
    return;
  }

  setIsLoading(true);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');
    
    const result = await response.json();
    
    // Store the analysis results
    const analysisResults = {
      originalImage: URL.createObjectURL(file),
      processedImage: `http://localhost:5000/output/${result.filename}`,
      predictions: result.predictions || []
    };
    
    sessionStorage.setItem('analysisResults', JSON.stringify(analysisResults));
    
    // Navigate to report page with the image filename
    router.push(`/report?image=${result.filename}`);
    
  } catch (error) {
    console.error('Upload error:', error);
    setUploadError('Failed to upload image. Please try again.');
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden relative p-4">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500 opacity-10 blur-xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-cyan-400 opacity-10 blur-xl"
        animate={{ 
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Subtle animated particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400"
          initial={{ 
            x: Math.random() * 1000, 
            y: Math.random() * 1000,
            opacity: 0.2 + Math.random() * 0.5
          }}
          animate={{ 
            y: [null, -100 - Math.random() * 100],
            opacity: [null, 0]
          }}
          transition={{ 
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Main content card */}
      <motion.div 
        className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-2xl z-10 backdrop-blur-sm bg-opacity-60 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#60A5FA" strokeWidth="1.5" />
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8.5 9C8.77614 9 9 8.77614 9 8.5C9 8.22386 8.77614 8 8.5 8C8.22386 8 8 8.22386 8 8.5C8 8.77614 8.22386 9 8.5 9Z" fill="#60A5FA" stroke="#60A5FA" strokeWidth="1.5" />
                <path d="M15.5 9C15.7761 9 16 8.77614 16 8.5C16 8.22386 15.7761 8 15.5 8C15.2239 8 15 8.22386 15 8.5C15 8.77614 15.2239 9 15.5 9Z" fill="#60A5FA" stroke="#60A5FA" strokeWidth="1.5" />
              </svg>
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-3xl font-bold text-center text-cyan-400 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            X-Ray Image Upload
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Upload your dental X-ray for AI analysis
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-gray-300 text-sm font-medium mb-2">Choose an X-Ray Image</label>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center justify-center mt-2"
              >
                <label
                  htmlFor="file-input"
                  className="cursor-pointer w-full h-48 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-xl hover:border-cyan-400 hover:bg-gray-700/70 transition-all flex flex-col items-center justify-center"
                >
                  {file ? (
                    <div className="text-center text-cyan-400 font-medium">{file.name}</div>
                  ) : (
                    <div className="text-center text-gray-400 flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 mb-3 text-cyan-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span>Click to select file</span>
                      <span className="text-xs mt-1">or drag and drop</span>
                    </div>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </motion.div>

              {errorMessage && (
                <motion.p 
                  className="text-red-400 text-center mt-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errorMessage}
                </motion.p>
              )}
            </motion.div>

            {filePreview && (
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative inline-block">
                  <img
                    src={filePreview}
                    alt="X-Ray Preview"
                    className="max-w-full h-auto rounded-lg shadow-lg border-2 border-gray-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="text-cyan-400 text-sm font-medium">X-Ray Preview</span>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div 
              className="text-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.03, boxShadow: "0px 0px 12px rgba(34, 211, 238, 0.5)" } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                className={`${
                  isLoading ? 'bg-cyan-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600'
                } text-white font-medium px-8 py-3 rounded-full shadow-lg w-full max-w-xs flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <span>Processing</span>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Upload & Analyze</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </motion.button>
            </motion.div>

            {successMessage && (
              <motion.p 
                className="text-green-400 text-center mt-4"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {successMessage}
              </motion.p>
            )}
          </form>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs text-gray-500">Supported formats: JPG, PNG, DICOM</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}