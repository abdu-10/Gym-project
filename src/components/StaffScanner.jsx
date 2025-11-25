import React, { useState } from 'react';

function StaffScanner({ onGoHome }) {
  const [userIdInput, setUserIdInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setScanResult(null);

    try {
      // CALL THE REAL BACKEND
      const response = await fetch('http://localhost:3000/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userIdInput }),
      });

      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Header */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
         <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
         <span className="text-gray-400 text-sm font-mono">SYSTEM ONLINE</span>
      </div>
      
      <button onClick={onGoHome} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">
        Exit System
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            FIT<span className="text-red-600">ELITE</span>
          </h1>
          <p className="text-gray-500 tracking-widest text-xs mt-2 uppercase">Access Control Terminal</p>
        </div>

        {/* Scanner Input Box */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <form onSubmit={handleScan} className="space-y-4">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
              Enter Member ID or Scan QR
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="Scanning..."
                className="w-full bg-gray-900 border border-gray-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-600 font-mono text-lg placeholder-gray-600 transition-colors"
                autoFocus
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                {isLoading ? "..." : "VERIFY"}
              </button>
            </div>
          </form>
        </div>

        {/* RESULTS DISPLAY */}
        {scanResult && (
          <div className={`mt-8 p-1 rounded-3xl bg-gradient-to-br ${scanResult.status === 'granted' ? 'from-green-500 to-green-900' : 'from-red-500 to-red-900'} shadow-2xl animate-fadeIn`}>
            <div className="bg-gray-900 rounded-[22px] p-8 text-center overflow-hidden relative">
              
              {/* Background Glow */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 ${scanResult.status === 'granted' ? 'bg-green-500' : 'bg-red-500'} blur-[80px] opacity-20`}></div>

              {scanResult.status === 'granted' ? (
                <>
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-green-500 p-1 mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                    <img src={scanResult.user.photo} alt="Member" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-1">ACCESS GRANTED</h2>
                  <p className="text-green-400 font-mono text-sm tracking-widest uppercase">Welcome, {scanResult.user.name}</p>
                  <div className="mt-6 inline-block bg-gray-800 px-4 py-1 rounded-full border border-gray-700">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Plan: </span>
                    <span className="text-white text-xs font-bold uppercase">{scanResult.user.plan}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-red-600 flex items-center justify-center mb-4 bg-red-900/20 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                    <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-1">ACCESS DENIED</h2>
                  <p className="text-red-500 font-mono text-sm tracking-widest uppercase">{scanResult.message}</p>
                  {scanResult.user && (
                     <p className="text-gray-500 text-sm mt-2">Member: {scanResult.user.name}</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StaffScanner;