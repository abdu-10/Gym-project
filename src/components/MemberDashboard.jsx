import React from 'react';

// --- ICONS ---
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const QRIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-900" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 2h2v2h-2v-2zm3 3h3v2h-3v-2zM3 21h6v-6H3v6zm2-2v-2h2v2H5zm13-2h3v2h-3v-2zm-3-3h2v2h-2v-2zm3 3h3v2h-3v-2z"/>
  </svg>
);

const ChipIcon = () => (
  <svg width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90 shadow-sm">
    <rect width="45" height="35" rx="6" fill="#fbbf24"/> {/* Amber-400 */}
    <path d="M0 11H11V24H0" stroke="#b45309" strokeWidth="1.5"/>
    <path d="M34 11H45V24H34" stroke="#b45309" strokeWidth="1.5"/>
    <path d="M11 0V35" stroke="#b45309" strokeWidth="1.5"/>
    <path d="M34 0V35" stroke="#b45309" strokeWidth="1.5"/>
    <rect x="16" y="9" width="13" height="17" rx="3" stroke="#b45309" strokeWidth="1.5"/>
  </svg>
);

const ContactlessIcon = () => (
  <svg className="h-10 w-10 text-white opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008zm-3 3h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

import QRCode from "react-qr-code"; 

function MemberDashboard({ user, onGoHome }) {
  if (!user) return null;

  // Determine card style based on plan
  const getCardStyle = (plan) => {
    if (plan === 'Elite') return 'bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl shadow-gray-500/50';
    if (plan === 'Premium') return 'bg-gradient-to-br from-red-700 via-red-600 to-red-900 border-red-500 shadow-2xl shadow-red-500/40';
    return 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 border-blue-500 shadow-2xl shadow-blue-500/40';
  };

  // Generate Member ID
  const generateMemberID = (id) => {
    const prefix = "9901"; 
    const year = new Date().getFullYear();
    const paddedId = id.toString().padStart(4, '0'); 
    return `${prefix} ${year} ${paddedId}`;
  };

  const memberID = generateMemberID(user.id);

  const qrValue = JSON.stringify({
    id: user.id,
    email: user.email,
    plan: user.plan
  });

  // --- DATE LOGIC UPDATED ---
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
      // --- CHANGE HERE: Added day: 'numeric' ---
      joinDateString: joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
      renewalDateString: renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isActive: isActive,
      statusText: isActive ? "ACTIVE" : "INACTIVE",
      statusColor: isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    };
  };

  const membershipData = calculateStatus();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      
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
          &larr; Back to Website
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: Profile Info --- */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800 relative">
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full"></div>
            </div>
            <div className="px-6 relative">
                <div className="-mt-12 mb-4">
                    <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md inline-block">
                        <div className="h-full w-full rounded-full bg-red-600 flex items-center justify-center text-white text-3xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                        </div>
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
                    {/* Shows exact date now, e.g., Nov 24, 2025 */}
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

        {/* --- RIGHT COLUMN: Digital ID Card --- */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full flex flex-col justify-center items-center">
            
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Digital Access Pass</h2>
                <p className="text-gray-500 mt-2">Use this card to access the gym floor.</p>
            </div>

            {/* THE CARD */}
            <div className={`w-full max-w-[400px] aspect-[1.586/1] rounded-2xl p-6 relative overflow-hidden transition-transform hover:scale-[1.02] duration-500 ${getCardStyle(user.plan)}`}>
              
              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>

              <div className="relative z-10 h-full flex flex-col justify-between text-white">
                
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

                <div className="flex items-center pl-1">
                  <ChipIcon />
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest opacity-60">Cardholder</p>
                    <p className="font-medium text-lg tracking-wide shadow-black drop-shadow-md uppercase truncate max-w-[200px]">
                        {user.name}
                    </p>
                    <p className="text-xs font-mono opacity-80 tracking-wider">
                        {memberID}
                    </p>
                  </div>
                  
                  <div className="bg-white p-1.5 rounded-lg shadow-lg">
                    <div className="h-14 w-14 flex items-center justify-center">
                        <QRCode 
                            value={qrValue} 
                            size={56} 
                            level="L"
                            fgColor="#000000"
                            bgColor="#FFFFFF"
                        />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* STATUS INDICATOR */}
            {membershipData.isActive ? (
                <div className="mt-8 bg-green-50 rounded-lg p-4 w-full max-w-[400px] flex items-center justify-center gap-3 border border-green-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800">Pass Active & Ready to Scan</span>
                </div>
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
  );
}

export default MemberDashboard;