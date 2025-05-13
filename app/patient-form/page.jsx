'use client';

import { useState, useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Calendar, Users, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export default function PatientForm() {
  const { userData, setUserData } = useUserContext();
  const [patientName, setPatientName] = useState(userData.patientName || '');
  const [age, setAge] = useState(userData.age || '');
  const [gender, setGender] = useState(userData.gender || '');
  const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !age || !gender || !phoneNumber) {
      setErrorMessage('All fields are required!');
      return;
    }

    // Update global state with all fields
    setUserData({ 
      ...userData, 
      patientName, 
      age, 
      gender, 
      phoneNumber 
    });

    router.push('/symptom-checker');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-blue-900 p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-500 opacity-10 blur-xl"
        animate={{ 
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-cyan-400 opacity-10 blur-xl"
        animate={{ 
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Subtle animated particles */}
      {[...Array(8)].map((_, i) => (
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
      
      <motion.div 
        className="max-w-2xl w-full mx-auto bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-sm bg-opacity-60 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="p-8">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-blue-900 p-3 rounded-full">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#60A5FA" strokeWidth="1.5" />
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8.5 9C8.77614 9 9 8.77614 9 8.5C9 8.22386 8.77614 8 8.5 8C8.22386 8 8 8.22386 8 8.5C8 8.77614 8.22386 9 8.5 9Z" fill="#60A5FA" stroke="#60A5FA" strokeWidth="1.5" />
                <path d="M15.5 9C15.7761 9 16 8.77614 16 8.5C16 8.22386 15.7761 8 15.5 8C15.2239 8 15 8.22386 15 8.5C15 8.77614 15.2239 9 15.5 9Z" fill="#60A5FA" stroke="#60A5FA" strokeWidth="1.5" />
              </svg>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-light text-center text-blue-100 mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Patient Information
          </motion.h1>

          {errorMessage && (
            <motion.div 
              className="mb-6 bg-red-900/30 border border-red-700 rounded-lg p-3 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle size={18} className="text-red-400 mr-2" />
              <p className="text-red-400 text-sm">{errorMessage}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Name Field */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="flex items-center text-gray-300 text-sm font-medium pl-1">
                <User size={16} className="mr-2 text-blue-400" />
                Patient Name
              </label>
              <div className={`relative ${focusedField === 'name' ? 'scale-[1.01]' : ''}`}>
                <motion.input
                  type="text"
                  className="w-full bg-gray-900/50 border-b-2 border-gray-600 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="John Doe"
                />
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: focusedField === 'name' ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
            
            {/* Age Field */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label className="flex items-center text-gray-300 text-sm font-medium pl-1">
                <Calendar size={16} className="mr-2 text-blue-400" />
                Age
              </label>
              <div className={`relative ${focusedField === 'age' ? 'scale-[1.01]' : ''}`}>
                <motion.input
                  type="number"
                  min="1"
                  max="120"
                  className="w-full bg-gray-900/50 border-b-2 border-gray-600 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="35"
                />
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: focusedField === 'age' ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
            
            {/* Gender Field */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label className="flex items-center text-gray-300 text-sm font-medium pl-1">
                <Users size={16} className="mr-2 text-blue-400" />
                Gender
              </label>
              <div className={`relative ${focusedField === 'gender' ? 'scale-[1.01]' : ''}`}>
                <motion.select
                  className="w-full bg-gray-900/50 border-b-2 border-gray-600 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-blue-400 transition-all duration-300 appearance-none"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  onFocus={() => setFocusedField('gender')}
                  onBlur={() => setFocusedField(null)}
                  required
                >
                  <option value="" disabled className="bg-gray-800 text-gray-400">Select Gender</option>
                  <option value="Male" className="bg-gray-800">Male</option>
                  <option value="Female" className="bg-gray-800">Female</option>
                  <option value="Other" className="bg-gray-800">Other</option>
                  <option value="Prefer not to say" className="bg-gray-800">Prefer not to say</option>
                </motion.select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: focusedField === 'gender' ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Phone Number Field */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <label className="flex items-center text-gray-300 text-sm font-medium pl-1">
                <Phone size={16} className="mr-2 text-blue-400" />
                Phone Number
              </label>
              <div className={`relative ${focusedField === 'phone' ? 'scale-[1.01]' : ''}`}>
                <motion.input
                  type="tel"
                  className="w-full bg-gray-900/50 border-b-2 border-gray-600 rounded-lg p-3 text-gray-200 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="+91 9346756612"
                  pattern="^\+?[\d\s\-\(\)]{10,}$"
                />
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-blue-400 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: focusedField === 'phone' ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              className="pt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-medium flex items-center justify-center"
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                }}
                whileTap={{ scale: 0.97 }}
              >
                Continue to Symptom Checker
                <ArrowRight size={18} className="ml-2" />
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}