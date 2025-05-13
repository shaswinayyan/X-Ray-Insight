'use client';

import { useEffect, useState, useRef } from 'react';
import { useUserContext } from '@/context/UserContext';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';

export default function ReportPage() {
  const [results, setResults] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const { userData } = useUserContext();
  const reportRef = useRef();
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching report data...');
        
        // Retrieve all stored data
        const storedResults = sessionStorage.getItem('analysisResults');
        const storedReport = sessionStorage.getItem('patientReport');
        const storedUserData = sessionStorage.getItem('userData');
        const storedSymptoms = sessionStorage.getItem('patientSymptoms');
        const storedPredictions = sessionStorage.getItem('aiPredictions');
  
        const urlParams = new URLSearchParams(window.location.search);
        const imageFilename = urlParams.get('image');
  
        if (storedResults && storedReport) {
          console.log('Using data from session storage');
          setResults(JSON.parse(storedResults));
          
          // Combine all report data
          const combinedReport = {
            ...JSON.parse(storedReport),
            symptoms: JSON.parse(storedSymptoms) || [],
            conditions: JSON.parse(storedPredictions) || []
          };
          
          setReport(combinedReport);
        } else if (imageFilename) {
          console.log('Fetching images from backend');
          let processedUrl, originalUrl;
          
          try {
            // Fetch processed image from ML model
            const processedResponse = await fetch(`http://localhost:5000/output/${imageFilename}`);
            if (!processedResponse.ok) throw new Error('Failed to load processed image');
            const processedBlob = await processedResponse.blob();
            processedUrl = URL.createObjectURL(processedBlob);
            
            // Fetch original uploaded image
            const originalFilename = imageFilename.replace('annotated_', '');
            const originalResponse = await fetch(`http://localhost:5000/uploads/${originalFilename}`);
            if (!originalResponse.ok) throw new Error('Failed to load original image');
            const originalBlob = await originalResponse.blob();
            originalUrl = URL.createObjectURL(originalBlob);
            
            console.log('Images loaded successfully');
            
            // Store the image URLs in session storage
            const analysisResults = {
              processedImage: processedUrl,
              originalImage: originalUrl,
              predictions: [] // Add predictions if available
            };
            
            sessionStorage.setItem('analysisResults', JSON.stringify(analysisResults));
            setResults(analysisResults);
            
            // Create or update report with all available data
            const reportData = storedReport ? JSON.parse(storedReport) : {
              name: userData?.patientName || "Patient Name",
              age: userData?.age || "30",
              gender: userData?.gender || "Male",
              symptoms: JSON.parse(storedSymptoms) || [],
              conditions: JSON.parse(storedPredictions) || [],
              suggestion: "Based on radiographic findings, please consult with your dentist"
            };
            
            setReport(reportData);
            
          } catch (error) {
            console.error('Error loading images:', error);
            setImageLoadError(true);
          }
        }
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  
    return () => {
      if (results?.processedImage) URL.revokeObjectURL(results.processedImage);
      if (results?.originalImage) URL.revokeObjectURL(results.originalImage);
    };
  }, [userData]);


  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 1cm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
    documentTitle: `Dental_Report_${report?.name?.replace(' ', '_') || 'Patient'}_${currentDate.replace(/ /g, '_')}`,
    onBeforeGetContent: () => {
      if (!reportRef.current) {
        console.error('Print content not ready');
        return Promise.reject();
      }
      return Promise.resolve();
    },
    onPrintError: (error) => console.error('Print error:', error)
  });

  if (loading || !report || !results) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700">Loading medical report...</p>
          {imageLoadError && (
            <p className="text-red-500 mt-2">Failed to load images. Please try again.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      {/* Floating action buttons */}
      <div className="no-print fixed bottom-8 right-8 z-10 space-y-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Download PDF
        </motion.button>
        
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="#contact"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
          Consult Dentist
        </motion.a>
      </div>

      {/* Report Container */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden" ref={reportRef}>
        {/* Report Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dental Health Report</h1>
              <p className="text-blue-100">Generated on {currentDate}</p>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1E40AF" strokeWidth="2" />
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
                <path d="M9 9H9.01" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
                <path d="M15 9H15.01" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p><span className="font-medium">Full Name:</span> {report.name}</p>
              <p><span className="font-medium">Date of Birth:</span> {report.age} years old</p>
            </div>
            <div>
              <p><span className="font-medium">Gender:</span> {report.gender}</p>
              <p><span className="font-medium">Report ID:</span> DENT-{Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
          </div>
        </div>

        {/* Radiographic Findings */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            Radiographic Findings
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Original OPG</h3>
              {results.originalImage ? (
                <img src={results.originalImage} alt="Original X-Ray" className="w-full h-auto rounded border border-gray-200" />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded border border-gray-200">
                  <p className="text-gray-500">Original image not available</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3">AI Analysis</h3>
              {results.processedImage ? (
                <img src={results.processedImage} alt="Processed Result" className="w-full h-auto rounded border border-gray-200" />
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded border border-gray-200">
                  <p className="text-gray-500">Processed image not available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Radiologist Notes</h3>
            <p className="text-gray-700">
              The panoramic radiograph reveals several areas of interest marked by the AI analysis. 
              Notable findings include potential periodontal involvement in the lower left quadrant 
              and possible caries in the posterior teeth. A clinical examination is recommended to 
              confirm these findings.
            </p>
          </div>
        </div>

        {/* Symptom Analysis */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Symptom Analysis
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Reported Symptoms</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {report.symptoms?.map((symptom, index) => (
                    <li key={index}>
                      {symptom.name} <span className="text-sm text-gray-500">(Severity: {symptom.severity}/10)</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Differential Diagnosis</h3>
                <ul className="list-decimal list-inside text-gray-600 space-y-1">
                  {report.conditions?.slice(0, 3).map((condition, index) => (
                    <li key={index}>
                      {condition.name} 
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-4">
              <h3 className="font-medium text-yellow-800 mb-1">Clinical Impression</h3>
              <p className="text-yellow-700 text-sm">{report.suggestion}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Treatment Recommendations
          </h2>

          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="font-medium text-green-800 mb-2">Immediate Actions</h3>
              <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                <li>Schedule a comprehensive dental examination within 2 weeks</li>
                <li>Begin oral hygiene improvements including proper brushing technique</li>
                <li>Use antimicrobial mouthwash twice daily if periodontal involvement suspected</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-medium text-purple-800 mb-2">Long-term Management</h3>
              <ul className="list-disc list-inside text-purple-700 space-y-1 text-sm">
                <li>Regular dental check-ups every 6 months</li>
                <li>Professional cleaning every 3-4 months if periodontal disease confirmed</li>
                <li>Dietary counseling to reduce caries risk</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-medium">SmileCare Dental Diagnostics</h3>
              <p className="text-gray-400 text-sm">AI-Assisted Dental Analysis System</p>
            </div>
            <div className="text-sm text-gray-300">
              <p>Report generated on {currentDate}</p>
              <p>This is not a substitute for professional dental evaluation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dentist Contact Section */}
      <div id="contact" className="no-print max-w-5xl mx-auto mt-12 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule a Dental Consultation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Recommended Dentists</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Dr. Parimala</h4>
                    <p className="text-gray-600 text-sm">Periodontist • 15 years experience</p>
                    <p className="text-blue-600 text-sm mt-1">SmileCare Dental Clinic • 2.5 Km away</p>
                    <button className="mt-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Book Appointment</button>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Dr. Shaswin</h4>
                    <p className="text-gray-600 text-sm">Endodontist • 12 years experience</p>
                    <p className="text-blue-600 text-sm mt-1">City Dental Center • 3.1 Km away</p>
                    <button className="mt-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Book Appointment</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h3>
              <p className="text-gray-600 mb-4">If you're experiencing severe pain or swelling, contact an emergency dental service immediately.</p>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="font-medium text-red-700 mb-2">24/7 Emergency Dental Service</h4>
                <p className="text-red-600">📞 +91 9443452611</p>
                <p className="text-red-600 text-sm mt-1">Available round the clock for urgent dental needs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}