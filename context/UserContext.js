// context/UserContext.js
'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    patientName: '',
    age: '',
    gender: '',
    phoneNumber: '', // Add phone number field
    symptoms: [],
    xRayFile: null,
    report: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};