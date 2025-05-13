"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (user.username === "admin" && user.password === "admin") {
      router.push("/patient-form");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden relative">
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
      
      {/* Login Card */}
      <motion.div 
        className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-sm z-10 backdrop-blur-sm bg-opacity-60 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex justify-center mb-8">
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
          
          <motion.h2 
            className="text-3xl font-light mb-8 text-center text-blue-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Dental Assistant Login
          </motion.h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div 
              className={`relative ${focusedField === 'username' ? 'scale-105' : ''}`}
              transition={{ duration: 0.2 }}
            >
              <motion.input 
                whileFocus={{ scale: 1.02 }}
                type="text" 
                placeholder="Username" 
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className={`w-full border-b-2 border-gray-600 px-4 py-3 focus:outline-none focus:border-blue-400 bg-transparent text-gray-200 transition-all duration-300 ${focusedField === 'username' ? 'border-blue-400' : ''}`}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
              />
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-blue-400"
                initial={{ width: "0%" }}
                animate={{ width: focusedField === 'username' ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            
            <motion.div 
              className={`relative ${focusedField === 'password' ? 'scale-105' : ''}`}
              transition={{ duration: 0.2 }}
            >
              <motion.input 
                whileFocus={{ scale: 1.02 }}
                type="password" 
                placeholder="Password" 
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className={`w-full border-b-2 border-gray-600 px-4 py-3 focus:outline-none focus:border-blue-400 bg-transparent text-gray-200 transition-all duration-300 ${focusedField === 'password' ? 'border-blue-400' : ''}`}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-blue-400"
                initial={{ width: "0%" }}
                animate={{ width: focusedField === 'password' ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            
            {error && (
              <motion.p 
                className="text-red-400 text-sm px-2"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
            
            <div className="flex justify-between items-center text-sm mt-2">
              <div className="flex items-center space-x-1">
                <input type="checkbox" id="remember" className="rounded border-gray-700 text-blue-500 focus:ring-blue-500 bg-gray-700" />
                <label htmlFor="remember" className="text-gray-400">Remember me</label>
              </div>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</a>
            </div>
            
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.03, backgroundColor: "#3B82F6" }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium mt-4"
            >
              Sign In
            </motion.button>
          </form>
          
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs text-gray-500">Hint: Use "admin" for both username and password</p>
          </motion.div>
        </motion.div>
      </motion.div>
      
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
    </div>
  );
}