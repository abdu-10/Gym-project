import React, { useState } from 'react';
// 1. IMPORT THE MODERN PACKAGE
import { Scanner } from '@yudiel/react-qr-scanner';

function StaffScanner({ onGoHome }) {
  const [inputMode, setInputMode] = useState("camera"); // 'camera' or 'manual'
  const [userIdInput, setUserIdInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- HANDLE THE SCAN ---
  const handleQrScan = (detectedCodes) => {
    // The library returns an array of detected codes
    if (detectedCodes && detectedCodes.length > 0 && !isLoading && !scanResult) {
        const rawValue = detectedCodes[0].rawValue;
        if (rawValue) verifyUser(rawValue);
    }
  };

  const handleQrError = (err) => {
    console.error("Scanner Error:", err);
  };

  // --- VERIFICATION API CALL ---
  const verifyUser = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id }),
      });
      const data = await response.json();
      setScanResult(data);
    } catch (error) {
      console.error("Verification failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manual Submit Handler
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if(userIdInput) verifyUser(userIdInput);
  };

  // Reset System
  const resetScanner = () => {
      setScanResult(null);
      setUserIdInput("");
      setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* ANIMATIONS */}
      <style>{`
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        .animate-popIn { animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes scanline { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scanline { animation: scanline 2s linear infinite; }
      `}</style>

      {/* TERMINAL HEADER */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black to-transparent">
         <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_#22c55e] bg-green-500"></div>
             <div className="flex flex-col">
                 <span className="text-green-500 text-xs font-mono tracking-widest">
                    OPTICAL SENSORS ACTIVE
                 </span>
                 <span className="text-gray-600 text-[10px] font-mono">SECURE GATE v3.0</span>
             </div>
         </div>
         <button onClick={onGoHome} className="text-gray-600 hover:text-white text-xs font-mono uppercase tracking-widest transition">
            [ Terminate Session ]
         </button>
      </div>

      <div className="w-full max-w-lg relative z-10 flex flex-col items-center">
        
        {/* --- THE LIVE SCANNER CONTAINER --- */}
        <div className="relative mb-8 group">
            {/* Glow Effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl blur opacity-20 transition duration-1000 ${inputMode === 'camera' ? 'group-hover:opacity-40' : 'opacity-0'}`}></div>
            
            <div className="relative w-80 h-80 bg-black rounded-2xl border-2 border-gray-800 flex items-center justify-center overflow-hidden shadow-2xl">
                
                {/* 1. CAMERA FEED (USING MODERN PACKAGE) */}
                {inputMode === 'camera' && (
                    <div className="absolute inset-0 w-full h-full bg-black">
                        <Scanner
                            onScan={handleQrScan}
                            onError={handleQrError}
                            // Clean UI: No audio, no default outline (we use our own)
                            components={{
                                audio: false,
                                onOff: false,
                                torch: false,
                                finder: false, 
                            }}
                            styles={{
                                container: { width: '100%', height: '100%' },
                                video: { width: '100%', height: '100%', objectFit: 'cover' }
                            }}
                        />
                        
                        {/* Target Overlay (The "Cool" visual part stays on top) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="w-48 h-48 border-2 border-red-500/50 rounded-lg relative">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
                                {/* Scanning Laser */}
                                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444] animate-scanline opacity-70"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. MANUAL MODE */}
                {inputMode === 'manual' && (
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 flex items-center justify-center">
                         <div className="text-center">
                            <svg className="w-12 h-12 text-gray-700 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                            <p className="text-gray-500 text-xs font-mono">CAMERA PAUSED</p>
                         </div>
                    </div>
                )}
                
                {/* Status Text Overlay */}
                <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                     <p className="text-white/70 text-[10px] font-mono bg-black/50 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                        {isLoading ? "VERIFYING IDENTITY..." : (inputMode === 'camera' ? "SCANNING TARGET..." : "MANUAL OVERRIDE")}
                     </p>
                </div>
            </div>
        </div>

        {/* --- MANUAL INPUT TOGGLE --- */}
        {inputMode === 'manual' && (
             <form onSubmit={handleManualSubmit} className="flex gap-2 animate-fadeIn mb-4">
                <input 
                    type="text" 
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    className="bg-gray-900 border border-gray-700 text-white font-mono text-sm px-4 py-2 rounded focus:outline-none focus:border-red-600"
                    placeholder="Enter ID #"
                    autoFocus
                />
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-red-700">SUBMIT</button>
             </form>
        )}

        <button 
            onClick={() => setInputMode(inputMode === 'camera' ? 'manual' : 'camera')}
            className="text-xs text-gray-600 hover:text-gray-400 font-mono underline decoration-dotted underline-offset-4"
        >
            {inputMode === 'camera' ? "Switch to Manual Entry" : "Switch to Camera Mode"}
        </button>


        {/* --- RESULTS DISPLAY OVERLAY --- */}
        {scanResult && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center animate-fadeIn p-4">
             <div className="w-full max-w-sm relative">
                
                {/* CLOSE BUTTON */}
                <button 
                    onClick={resetScanner}
                    className="absolute -top-12 right-0 text-white hover:text-red-500 transition flex items-center gap-2"
                >
                    <span className="text-xs font-mono uppercase">Next Scan</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>

                {scanResult.status === 'granted' ? (
                    <div className="text-center">
                        <div className="relative mb-10 inline-block">
                             <div className="w-56 h-56 rounded-full border-[8px] border-green-500 p-1 bg-black animate-popIn shadow-[0_0_60px_#22c55e]">
                                {scanResult.user.photo ? (
                                    <img src={scanResult.user.photo} className="w-full h-full rounded-full object-cover" alt="User" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-6xl font-bold text-white">
                                        {scanResult.user.name.charAt(0)}
                                    </div>
                                )}
                             </div>
                             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-black font-black text-sm uppercase px-6 py-2 rounded-full tracking-widest shadow-xl animate-popIn" style={{animationDelay: '0.2s'}}>
                                Match Confirmed
                             </div>
                        </div>
                        
                        <h2 className="text-5xl font-black text-white italic tracking-tighter mb-2">GRANTED</h2>
                        <p className="text-green-500 font-mono text-sm tracking-widest uppercase mb-8">Subject: {scanResult.user.name}</p>

                        <div className="flex justify-center gap-4">
                            <div className="bg-gray-900 px-6 py-3 rounded-xl border border-gray-800">
                                <span className="text-gray-500 text-[10px] uppercase block mb-1">Membership</span>
                                <span className="text-white font-bold uppercase text-lg">{scanResult.user.plan}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-40 h-40 mx-auto rounded-full border-[6px] border-red-600 flex items-center justify-center mb-8 bg-red-900/20 shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-popIn">
                            <svg className="w-20 h-20 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-5xl font-black text-white tracking-tighter mb-4">DENIED</h2>
                        <div className="bg-red-950/50 border border-red-900 p-6 rounded-xl inline-block">
                             <p className="text-red-500 font-mono text-sm tracking-widest uppercase">
                                REASON: {scanResult.message}
                             </p>
                        </div>
                        {scanResult.user && (
                            <p className="text-gray-500 mt-8 font-mono text-sm uppercase">Identity: {scanResult.user.name}</p>
                        )}
                    </div>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default StaffScanner;