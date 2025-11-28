import React, { useState } from 'react';
import QRCode from "react-qr-code"; 

// --- ICONS ---
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2h10a2 2 0 002 2z" />
    </svg>
);

const ChipIcon = () => (
  <svg width="40" height="30" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90 shadow-sm">
    <rect width="45" height="35" rx="6" fill="#fbbf24"/>
    <path d="M0 11H11V24H0" stroke="#b45309" strokeWidth="1.5"/>
    <path d="M34 11H45V24H34" stroke="#b45309" strokeWidth="1.5"/>
    <path d="M11 0V35" stroke="#b45309" strokeWidth="1.5"/>
    <path d="M34 0V35" stroke="#b45309" strokeWidth="1.5"/>
    <rect x="16" y="9" width="13" height="17" rx="3" stroke="#b45309" strokeWidth="1.5"/>
  </svg>
);

const ContactlessIcon = () => (
  <svg className="h-8 w-8 text-white opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008zm-3 3h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

function MemberDashboard({ user, onGoHome }) {
  const [showScanner, setShowScanner] = useState(false);

  if (!user) return null;

  // --- 1. CARD STYLE LOGIC ---
  const getCardStyle = (plan) => {
    if (plan === 'Elite') return 'bg-gradient-to-br from-yellow-700 via-yellow-600 to-amber-800 border-yellow-500 shadow-2xl shadow-yellow-600/30';
    if (plan === 'Premium') return 'bg-gradient-to-br from-red-700 via-red-600 to-red-900 border-red-500 shadow-2xl shadow-red-500/40';
    return 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 border-blue-500 shadow-2xl shadow-blue-500/40';
  };

  // --- 2. ID GENERATION ---
  const generateMemberID = (id) => {
    const prefix = "9901"; 
    const year = new Date().getFullYear();
    const paddedId = id.toString().padStart(4, '0'); 
    return `${prefix} ${year} ${paddedId}`;
  };

  const memberID = generateMemberID(user.id);
  const qrValue = user.id.toString();

  // --- 3. MEMBERSHIP STATUS LOGIC ---
  const calculateStatus = () => {
    const joinDate = user.joined_at ? new Date(user.joined_at) : new Date();
    const now = new Date();
    
    let monthsToAdd = 1; 
    if (user.plan === 'Quarterly') monthsToAdd = 3;
    if (user.plan === 'Premium') monthsToAdd = 6;
    if (user.plan === 'Elite') monthsToAdd = 12;

    const renewalDate = new Date(joinDate);
    renewalDate.setMonth(renewalDate.getMonth() + monthsToAdd);

    const isActive = now < renewalDate;
    
    return {
      joinDateString: joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
      renewalDateString: renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isActive: isActive,
      statusText: isActive ? "ACTIVE" : "INACTIVE",
      statusColor: isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    };
  };

  const membershipData = calculateStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn relative">
      
      {/* Top Navigation Bar */}
      <div className="max-w-5xl mx-auto mb-10 flex justify-between items-center border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-red-600 rounded-full"></div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            MEMBER <span className="text-gray-400 font-light">PORTAL</span>
            </h1>
        </div>
        <button 
          onClick={onGoHome}
          className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          &larr; Back to Home
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: Profile Info (Exact same as you pasted) --- */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800 relative">
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            </div>
            <div className="px-6 relative">
                <div className="-mt-12 mb-4">
                    <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md inline-block relative z-10">
                        {user.photo_url ? (
                            <img 
                                src={user.photo_url} 
                                alt={user.name} 
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-6">{user.email}</p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 py-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Membership</p>
                        <p className="text-lg font-bold text-gray-900">{user.plan}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${membershipData.statusColor}`}>
                          {membershipData.statusText}
                        </span>
                    </div>
                </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Account Details</h3>
                <CalendarIcon />
            </div>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Member Since</span>
                    <span className="font-medium text-gray-900">{membershipData.joinDateString}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Renewal Date</span>
                    <span className={`font-medium ${membershipData.isActive ? "text-gray-900" : "text-red-600 font-bold"}`}>
                      {membershipData.renewalDateString}
                    </span>
                </div>
                <div className="flex justify-between py-2">
                    <span className="text-gray-500">Home Gym</span>
                    <span className="font-medium text-gray-900">FitElite HQ</span>
                </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: Digital ID Card (Updated for Tap Interaction) --- */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full flex flex-col items-center justify-center">
            
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Digital Access Pass</h2>
                <p className="text-gray-500 mt-2 text-sm">Tap card to scan for entry.</p>
            </div>

            {/* --- THE CARD (Clickable) --- */}
            <div 
                onClick={() => setShowScanner(true)}
                className={`w-full max-w-[400px] aspect-[1.586/1] rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-2xl ${getCardStyle(user.plan)}`}
            >
              
              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>

              <div className="relative z-10 h-full flex flex-col justify-between text-white">
                
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight leading-none italic">
                      FIT<span className="text-red-500">ELITE</span>
                    </h3>
                    <p className="text-[10px] opacity-80 uppercase tracking-[0.2em] mt-1">
                       {user.plan} Member
                    </p>
                  </div>
                  <ContactlessIcon />
                </div>

                {/* Chip */}
                <div className="flex items-center pl-1">
                  <ChipIcon />
                </div>

                {/* Footer: Details & PHOTO */}
                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest opacity-60">Cardholder</p>
                    <p className="font-medium text-lg tracking-wide shadow-black drop-shadow-md uppercase truncate max-w-[200px]">
                        {user.name}
                    </p>
                    <p className="text-xs font-mono opacity-80 tracking-wider">
                        {memberID}
                    </p>
                  </div>
                  
                  {/* Photo on Card */}
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-0.5 rounded-md h-[70px] w-[55px] flex items-center justify-center overflow-hidden">
                    {user.photo_url ? (
                        <img 
                            src={user.photo_url} 
                            alt="ID" 
                            className="h-full w-full object-cover rounded-[3px]" 
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs">No Pic</span>
                        </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* --- BOTTOM TEXT (Replaced Static QR) --- */}
            <div className="mt-10 text-center">
                 {membershipData.isActive ? (
                    <button 
                        onClick={() => setShowScanner(true)}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold bg-gray-900 text-white hover:bg-black transition-colors shadow-lg"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Tap Card to Scan
                    </button>
                 ) : (
                    <div className="mt-8 bg-red-50 rounded-lg p-4 w-full max-w-[400px] flex items-center justify-center gap-3 border border-red-100">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-red-800">Pass Expired - Please Renew</span>
                    </div>
                 )}
            </div>

          </div>
        </div>

      </div>

      {/* --- SCANNER MODAL (ANIMATED) --- */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative transform transition-all scale-100">
                
                <button 
                    onClick={() => setShowScanner(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
                >
                    <CloseIcon />
                </button>

                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Access Scanner</h3>
                    <p className="text-sm text-gray-500 mb-6">Place this code under the turnstile scanner.</p>
                    
                    <div className="bg-gray-900 p-5 rounded-xl shadow-inner inline-block relative overflow-hidden group">
                        {/* Scanning Line Animation */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent h-full w-full animate-scan" style={{backgroundSize: '100% 200%'}}></div>
                        
                        <div className="bg-white p-3 rounded-lg border-4 border-white">
                            <QRCode value={qrValue} size={180} level="H" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center items-center gap-2 text-sm text-gray-500 font-mono">
                        <span>ID:</span>
                        <span className="font-bold text-gray-900 tracking-widest">{memberID}</span>
                    </div>

                    <p className="mt-6 text-xs text-gray-400">
                        Security Token Refreshes: <span className="text-green-600 font-bold">Live</span>
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* Inline styles for custom scan animation */}
      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default MemberDashboard;