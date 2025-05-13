'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserContext } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import { symptomsList } from "../../data/symptoms";

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomSeverity, setSymptomSeverity] = useState({});
  const { userData } = useUserContext();
  const router = useRouter();
  const [showResult, setShowResult] = useState(false);
  const [opgAdvice, setOpgAdvice] = useState("");
  const [opgScore, setOpgScore] = useState(0);
  const [predictedConditions, setPredictedConditions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (symptom) => {
    setSelectedSymptoms((prev) => {
      const newSelection = prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom];

      if (!symptomSeverity[symptom] && !prev.includes(symptom)) {
        setSymptomSeverity((prevState) => ({
          ...prevState,
          [symptom]: 5,
        }));
      }

      return newSelection;
    });
  };

  const handleSliderChange = (symptom, value) => {
    setSymptomSeverity((prev) => ({
      ...prev,
      [symptom]: value,
    }));
  };

  const calculateOPGRecommendation = (symptoms) => {
    let totalScore = 0;

    symptoms.forEach((symptom) => {
      const symptomData = symptomsList.find(s => s.name === symptom.name);
      if (symptomData) {
        const severityMultiplier = symptom.severity / 5;
        totalScore += (symptomData.weight * severityMultiplier) * 20;
      }
    });

    const averageScore = symptoms.length > 0 ? totalScore / symptoms.length : 0;
    
    if (averageScore >= 70) {
      return {
        advice: "🦷 STRONGLY RECOMMEND OPG: High probability of significant findings",
        needsOPG: true,
        score: Math.round(averageScore)
      };
    } else if (averageScore >= 40) {
      return {
        advice: "📸 Consider OPG: Moderate probability of clinical findings",
        needsOPG: true,
        score: Math.round(averageScore)
      };
    } else {
      return {
        advice: "✅ OPG not necessary: Low probability of significant findings",
        needsOPG: false,
        score: Math.round(averageScore)
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom");
      return;
    }
  
    setError("");
    setIsLoading(true);
  
    try {
      const symptomsData = selectedSymptoms.map(symptom => ({
        name: symptom,
        severity: symptomSeverity[symptom] || 5
      }));
  
      const response = await fetch('http://localhost:5000/predict_conditions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: symptomsData }),
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      const opgResult = calculateOPGRecommendation(symptomsData);
      
      // Store ALL data in sessionStorage
      const patientReport = {
        name: userData?.patientName || "Patient Name",
        age: userData?.age || "N/A",
        gender: userData?.gender || "N/A",
        symptoms: symptomsData,
        conditions: result.conditions || [],
        suggestion: opgResult.advice,
        opgScore: opgResult.score
      };
  
      sessionStorage.setItem("patientSymptoms", JSON.stringify(symptomsData));
      sessionStorage.setItem("aiPredictions", JSON.stringify(result.conditions || []));
      sessionStorage.setItem("patientReport", JSON.stringify(patientReport));
      sessionStorage.setItem("userData", JSON.stringify(userData));
  
      setPredictedConditions(result);
      setOpgAdvice(opgResult.advice);
      setOpgScore(opgResult.score);
      setShowResult(true);
  
    } catch (error) {
      console.error('Prediction Error:', error);
      setError("Failed to analyze symptoms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Animation variants (keep your existing variants)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, type: "spring", stiffness: 100 } }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 8px rgb(6 182 212 / 70%)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const checkboxVariants = {
    checked: { scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 10 } },
    unchecked: { scale: 1 }
  };

  if (!userData?.patientName) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen w-full flex items-center justify-center text-center text-red-400 font-semibold bg-gray-900 p-6"
      >
        ⚠️ Patient details not found. Please go back and fill the patient form.
      </motion.div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden relative">
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

      {/* Main content card */}
      <motion.div
        className="bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-4xl z-10 backdrop-blur-sm bg-opacity-60 border border-gray-700 my-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {showResult ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Assessment Results</h2>
            
            {error && (
              <div className="bg-red-900/20 text-red-400 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="bg-gray-900/70 rounded-xl p-6 mb-6">
              <p className={`text-lg mb-4 ${opgAdvice.includes("STRONGLY RECOMMEND") ? "text-red-400" :
                  opgAdvice.includes("Consider") ? "text-yellow-400" :
                    "text-green-400"
                }`}>
                {opgAdvice}
              </p>

              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Diagnosis Summary
                </h3>
                <p className="text-gray-200 mb-6">
                  {predictedConditions?.summary || "Based on your symptoms, a clinical examination is recommended"}
                </p>

                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Detected Conditions ({predictedConditions?.conditions?.length || 0})
                </h3>

                {predictedConditions?.conditions?.length > 0 ? (
                  <ul className="space-y-4">
                    {predictedConditions.conditions.map((condition, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-medium text-cyan-400">
                            {condition.name}
                          </h4>
                          <span className={`text-xs px-2.5 py-1 rounded-full ${
                            condition.probability === 'High' ? 'bg-red-900/50 text-red-300' :
                            condition.probability === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-green-900/50 text-green-300'
                          }`}>
                            {condition.probability} probability
                          </span>
                        </div>
                        <p className="text-gray-300">{condition.description}</p>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No specific conditions identified</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                onClick={() => setShowResult(false)}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="bg-gray-700 text-white font-medium px-6 py-3 rounded-full shadow-lg"
              >
                Back to Symptoms
              </motion.button>
              
              <motion.button
                onClick={() => router.push("/x-ray-upload")}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium px-6 py-3 rounded-full shadow-lg"
              >
                Continue to X-ray Upload
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              variants={headerVariants}
              className="text-center pb-6"
            >
              <motion.div
                initial={{ rotate: -5, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block mb-3"
              >
                <span className="text-5xl">🦷</span>
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">
                Dental Symptom Checker
              </h1>
              <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto">
                Select your symptoms below and rate their severity to receive an initial assessment
              </p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-900/20 text-red-400 p-3 rounded-lg mb-4 text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              variants={containerVariants}
              className="bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700 overflow-hidden flex flex-col"
            >
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-grow overflow-hidden px-6 pt-6">
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full overflow-y-auto px-1 pt-2 pb-4"
                    variants={itemVariants}
                  >
                    {symptomsList.map((symptom, index) => (
                      <motion.div
                        key={symptom.name}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className="p-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all"
                      >
                        <label className="flex items-start gap-3 cursor-pointer">
                          <motion.div
                            variants={checkboxVariants}
                            animate={selectedSymptoms.includes(symptom.name) ? "checked" : "unchecked"}
                          >
                            <input
                              type="checkbox"
                              value={symptom.name}
                              onChange={() => handleChange(symptom.name)}
                              checked={selectedSymptoms.includes(symptom.name)}
                              className="mt-1 h-5 w-5 text-cyan-500 focus:ring-cyan-500 bg-gray-700 border-gray-600 rounded-md"
                            />
                          </motion.div>
                          <span className="text-sm md:text-base text-gray-300">{symptom.name}</span>
                        </label>

                        {selectedSymptoms.includes(symptom.name) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 pl-8"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-gray-500">Mild</span>
                              <motion.span
                                key={symptomSeverity[symptom.name]}
                                initial={{ scale: 1.5 }}
                                animate={{ scale: 1 }}
                                className="text-xs font-semibold px-2 py-1 rounded-full bg-cyan-900/50 text-cyan-400"
                              >
                                {symptomSeverity[symptom.name] || 5}
                              </motion.span>
                              <span className="text-xs text-gray-500">Severe</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={symptomSeverity[symptom.name] || 5}
                              onChange={(e) => handleSliderChange(symptom.name, parseInt(e.target.value))}
                              className="w-full accent-cyan-500 bg-gray-700 h-2 rounded-lg appearance-none cursor-pointer"
                            />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="sticky bottom-0 py-6 px-6 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 flex justify-center mt-auto"
                >
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium px-10 py-3 rounded-full shadow-lg flex items-center gap-3 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <span>Analyzing</span>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      </>
                    ) : (
                      <>
                        <span>Analyze Symptoms</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}