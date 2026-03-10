import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import MyBookings from './MyBookings'; 
import Toast from './Toast';

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

function MemberDashboard({ user, onGoHome, onUserUpdate }) {
  const [showScanner, setShowScanner] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [profilePromptDismissed, setProfilePromptDismissed] = useState(null);
  const [profileSavedSuccessfully, setProfileSavedSuccessfully] = useState(false);
  const [forceShowProfilePrompt, setForceShowProfilePrompt] = useState(false);
  const [profilePromptVisible, setProfilePromptVisible] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [toast, setToast] = useState(null);
  const [dobSelection, setDobSelection] = useState({
    year: '',
    month: '',
    day: ''
  });
  const [profileForm, setProfileForm] = useState({
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: ''
  });

  // --- FETCH DATA ---
  useEffect(() => {
    fetch('http://localhost:3000/member_dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setDashboardData(data);
      })
      .catch(err => console.error("Failed to load dashboard", err));
  }, []);

  useEffect(() => {
    setProfileForm({
      phone: user?.phone || '',
      gender: user?.gender || '',
      dateOfBirth: user?.date_of_birth || user?.dateOfBirth || '',
      address: user?.address || ''
    });
  }, [user]);

  useEffect(() => {
    const [year = '', month = '', day = ''] = String(profileForm.dateOfBirth || '').split('-');
    setDobSelection({ year, month, day });
  }, [profileForm.dateOfBirth]);

  useEffect(() => {
    if (!user?.id || typeof window === 'undefined') return;
    const dismissKey = `member-profile-prompt-dismissed-${user.id}`;
    setProfilePromptDismissed(localStorage.getItem(dismissKey) === '1');
    setProfileSavedSuccessfully(localStorage.getItem(`member-profile-saved-${user.id}`) === '1');
  }, [user?.id]);

  const profileChecks = [
    profileForm.phone,
    profileForm.gender,
    profileForm.dateOfBirth,
    profileForm.address
  ];
  const completedFields = profileChecks.filter(value => String(value || '').trim().length > 0).length;
  const backendProfileComplete = user?.profile_complete === true || user?.profile_complete === 'true';
  const isProfileComplete = backendProfileComplete || completedFields >= profileChecks.length;
  const shouldShowProfilePrompt = activeTab === 'overview' && profilePromptVisible;

  useEffect(() => {
    if (!user?.id) return;

    if (profilePromptDismissed === null) return;

    if (forceShowProfilePrompt) {
      setProfilePromptVisible(true);
      return;
    }

    if (profilePromptDismissed || isProfileComplete || profileSavedSuccessfully) {
      setProfilePromptVisible(false);
      return;
    }

    if (!isProfileComplete && !profilePromptDismissed && !profileSavedSuccessfully) {
      setProfilePromptVisible(true);
    }
  }, [user?.id, isProfileComplete, profilePromptDismissed, forceShowProfilePrompt, profileSavedSuccessfully]);

  if (!user) return null;

  const handleProfileFieldChange = (key, value) => {
    setProfileForm(prev => ({ ...prev, [key]: value }));
    setProfileError(null);
    setProfileSuccess(null);
  };

  const handleDismissProfilePrompt = () => {
    setProfilePromptDismissed(true);
    setForceShowProfilePrompt(false);
    setProfilePromptVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`member-profile-prompt-dismissed-${user.id}`, '1');
    }
  };

  const handleOpenProfilePrompt = () => {
    setForceShowProfilePrompt(true);
    setProfilePromptDismissed(false);
    setProfileSavedSuccessfully(false);
    setProfilePromptVisible(true);
    setProfileError(null);
    setProfileSuccess(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`member-profile-prompt-dismissed-${user.id}`);
      localStorage.removeItem(`member-profile-saved-${user.id}`);
    }
  };

  const currentYear = new Date().getFullYear();
  const dobYearOptions = Array.from({ length: 90 }, (_, i) => String(currentYear - 12 - i));
  const dobMonthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  const daysInSelectedMonth = dobSelection.month
    ? new Date(Number(dobSelection.year || currentYear), Number(dobSelection.month), 0).getDate()
    : 31;
  const dobDayOptions = Array.from({ length: daysInSelectedMonth }, (_, i) => String(i + 1).padStart(2, '0'));

  const handleDobSelectionChange = (part, value) => {
    const next = { ...dobSelection, [part]: value };

    if (next.month && next.day) {
      const maxDay = new Date(Number(next.year || currentYear), Number(next.month), 0).getDate();
      const safeDay = Math.min(Number(next.day), maxDay);
      next.day = String(safeDay).padStart(2, '0');
    }

    if (next.year && next.month && next.day) {
      const maxDay = new Date(Number(next.year), Number(next.month), 0).getDate();
      const safeDay = Math.min(Number(next.day), maxDay);
      const normalizedDay = String(safeDay).padStart(2, '0');
      const normalizedDate = `${next.year}-${next.month}-${normalizedDay}`;
      next.day = normalizedDay;
      setDobSelection(next);
      handleProfileFieldChange('dateOfBirth', normalizedDate);
      return;
    }

    setDobSelection(next);
    handleProfileFieldChange('dateOfBirth', '');
  };

  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!profileForm.phone.trim()) {
      setProfileError('Phone is required to complete your profile.');
      return;
    }

    setProfileSaving(true);
    const normalizedPayload = {
      phone: profileForm.phone.trim(),
      gender: profileForm.gender.trim(),
      date_of_birth: profileForm.dateOfBirth,
      address: profileForm.address.trim()
    };

    const payloadVariants = [
      normalizedPayload,
      { user: normalizedPayload },
      { member: normalizedPayload },
      { profile: normalizedPayload },
      { account: normalizedPayload },
      { user: { profile: normalizedPayload } }
    ];

    const submittedFields = {
      phone: normalizedPayload.phone,
      gender: normalizedPayload.gender,
      date_of_birth: normalizedPayload.date_of_birth,
      address: normalizedPayload.address
    };

    const hasPersistedSubmittedFields = (candidateUser) => {
      if (!candidateUser || typeof candidateUser !== 'object') return false;

      const normalizedCandidate = {
        phone: String(candidateUser.phone || '').trim(),
        gender: String(candidateUser.gender || '').trim().toLowerCase(),
        date_of_birth: String(candidateUser.date_of_birth || candidateUser.dateOfBirth || '').trim(),
        address: String(candidateUser.address || '').trim()
      };

      if (submittedFields.phone && normalizedCandidate.phone !== submittedFields.phone) return false;
      if (submittedFields.gender && normalizedCandidate.gender !== submittedFields.gender.toLowerCase()) return false;
      if (submittedFields.date_of_birth && normalizedCandidate.date_of_birth !== submittedFields.date_of_birth) return false;
      if (submittedFields.address && normalizedCandidate.address !== submittedFields.address) return false;

      return true;
    };

    const endpoints = [
      'http://localhost:3000/me/profile',
      'http://localhost:3000/me',
      `http://localhost:3000/users/${user.id}`,
      `http://localhost:3000/members/${user.id}`
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      for (const payload of payloadVariants) {
        try {
          const res = await fetch(endpoint, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (res.status === 404) {
            break;
          }

          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            lastError = new Error(data?.error || data?.message || 'Unable to save profile right now.');
            continue;
          }

          let candidateUser = data?.user || data?.member || data?.profile || (data && typeof data === 'object' ? data : null);

          if (!hasPersistedSubmittedFields(candidateUser)) {
            const verifyRes = await fetch('http://localhost:3000/me', { credentials: 'include' });
            const verifyData = await verifyRes.json().catch(() => ({}));
            const verifiedUser = verifyData?.user || verifyData;

            if (hasPersistedSubmittedFields(verifiedUser)) {
              candidateUser = verifiedUser;
            } else {
              lastError = new Error('Profile update was accepted but did not persist your fields.');
              continue;
            }
          }

          const updatedUser = {
            ...user,
            ...candidateUser,
            phone: candidateUser?.phone ?? normalizedPayload.phone,
            gender: candidateUser?.gender ?? normalizedPayload.gender,
            address: candidateUser?.address ?? normalizedPayload.address,
            date_of_birth: candidateUser?.date_of_birth || candidateUser?.dateOfBirth || normalizedPayload.date_of_birth,
            dateOfBirth: candidateUser?.dateOfBirth || candidateUser?.date_of_birth || normalizedPayload.date_of_birth,
            profile_complete: candidateUser?.profile_complete ?? user?.profile_complete
          };

          console.log('Profile save success - updatedUser.profile_complete:', updatedUser.profile_complete);
          onUserUpdate?.(updatedUser);
          setProfileSuccess('Profile updated successfully. Nice one!');
          setToast({ message: 'Profile updated successfully. Welcome to your upgraded FitElite experience! 🔥', type: 'success' });
          setProfilePromptDismissed(true);
          setProfileSavedSuccessfully(true);
          setForceShowProfilePrompt(false);
          setProfilePromptVisible(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem(`member-profile-prompt-dismissed-${user.id}`, '1');
            localStorage.setItem(`member-profile-saved-${user.id}`, '1');
          }
          setProfileSaving(false);
          return;
        } catch (err) {
          lastError = err;
        }
      }
    }

    setProfileError(lastError?.message || 'Could not update profile. Please try again later.');
    setProfileSaving(false);
  };

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
  
  // --- UPDATED SECURE LOGIC ---
  // Use the secure token from dashboard data, fallback to ID only if loading
  const qrValue = dashboardData?.user?.qr_code_value || user.id.toString();

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
        <div className="flex items-center gap-2">
          {!isProfileComplete && !profileSavedSuccessfully && (
            <button
              type="button"
              onClick={handleOpenProfilePrompt}
              className="text-xs font-black uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-3 py-2 rounded-lg shadow-sm transition"
            >
              Complete Profile
            </button>
          )}
          <button 
            onClick={onGoHome}
            className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
          >
            &larr; Back to Home
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex gap-4 border-b border-gray-200 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all relative ${
              activeTab === 'overview'
                ? 'text-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Overview
            {activeTab === 'overview' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-lg"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all relative ${
              activeTab === 'bookings'
                ? 'text-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📅 My Bookings
            {activeTab === 'bookings' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-lg"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: Profile Info --- */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Welcome Card */}
          <div className="group bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="h-28 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                 <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-500 opacity-10 rounded-full blur-2xl"></div>
            </div>
            <div className="px-6 relative">
                <div className="-mt-14 mb-4">
                    <div className="h-28 w-28 rounded-full bg-white p-1.5 shadow-2xl inline-block relative z-10 ring-4 ring-gray-100 group-hover:ring-red-100 transition-all">
                        {user.photo_url ? (
                            <img 
                                src={user.photo_url} 
                                alt={user.name} 
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white text-4xl font-black shadow-inner">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
                <h2 className="text-3xl font-black text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {user.email}
                </p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 py-2">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Membership</p>
                        <p className="text-xl font-black text-gray-900">{user.plan}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase ${membershipData.statusColor} shadow-sm`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${membershipData.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                          {membershipData.statusText}
                        </span>
                    </div>
                </div>

                {/* Profile Details - Only show if profile complete */}
                {isProfileComplete && (
                  <div className="grid grid-cols-2 gap-2 border-t border-gray-100 py-2">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                        <p className="text-xs font-black text-blue-600 uppercase tracking-wider mb-2">Phone</p>
                        <p className="text-lg font-black text-gray-900">{user.phone || '—'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                        <p className="text-xs font-black text-purple-600 uppercase tracking-wider mb-2">Gender</p>
                        <p className="text-lg font-black text-gray-900">{user.gender || '—'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                        <p className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Date of Birth</p>
                        <p className="text-lg font-black text-gray-900">
                          {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                        <p className="text-xs font-black text-orange-600 uppercase tracking-wider mb-2">Address</p>
                        <p className="text-lg font-black text-gray-900 truncate">{user.address || '—'}</p>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">Account Details</h3>
                <div className="bg-gray-100 p-2 rounded-lg">
                  <CalendarIcon />
                </div>
            </div>
            <div className="space-y-1 text-sm">
                <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600 font-semibold">Member Since</span>
                    <span className="font-bold text-gray-900">{membershipData.joinDateString}</span>
                </div>
                <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600 font-semibold">Renewal Date</span>
                    <span className={`font-bold ${membershipData.isActive ? "text-gray-900" : "text-red-600"}`}>
                      {membershipData.renewalDateString}
                    </span>
                </div>
                <div className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2 hover:bg-gray-100 transition-colors">
                    <span className="text-gray-600 font-semibold">Home Gym</span>
                    <span className="font-bold text-gray-900">FitElite HQ</span>
                </div>
                {/* TOTAL VISITS */}
                <div className="flex justify-between py-3 px-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                    <span className="text-red-700 font-bold">Total Visits</span>
                    <span className="font-black text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">{dashboardData?.stats?.total_visits || 0}</span>
                </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: Digital ID Card --- */}
        <div className="lg:col-span-7">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-8 h-full flex flex-col items-center justify-center relative overflow-hidden hover:shadow-2xl transition-shadow">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
            
            <div className="text-center mb-8 relative z-10">
                <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full mb-3">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-sm font-black uppercase tracking-wider">Digital Access Pass</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900">Your Membership Card</h2>
                <p className="text-gray-600 mt-2 text-sm font-semibold">🔒 Tap card to scan for entry</p>
            </div>

            {/* --- THE CARD (Clickable) --- */}
            <div 
                onClick={() => setShowScanner(true)}
                className={`group w-full max-w-[400px] aspect-[1.586/1] rounded-2xl p-6 relative overflow-hidden transition-all duration-500 hover:scale-[1.08] cursor-pointer shadow-2xl hover:shadow-3xl ${getCardStyle(user.plan)} relative z-10`}
            >
              
              {/* Glossy Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity"></div>
              <div className="absolute inset-0 border-2 border-white/20 rounded-2xl group-hover:border-white/40 transition-all"></div>

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

            {/* --- BOTTOM TEXT --- */}
            <div className="mt-10 text-center">
                 {membershipData.isActive ? (
                    <button 
                        onClick={() => setShowScanner(true)}
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white hover:shadow-2xl hover:shadow-red-900/50 transition-all hover:scale-105 shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                        <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></span>
                        <span className="relative z-10 uppercase tracking-wider">Tap Card to Scan</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                 ) : (
                    <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 w-full max-w-[400px] flex items-center justify-center gap-3 border-2 border-red-200 shadow-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-black text-red-800 uppercase tracking-wide">Pass Expired - Please Renew</span>
                    </div>
                 )}
            </div>

          </div>
        </div>

      </div>

        {/* --- BILLING HISTORY (Existing) --- */}
        <div className="max-w-5xl mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-8 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-3">
                <div className="bg-gray-900 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Billing History
              </h3>
            <span className="text-xs font-black text-green-700 bg-green-100 px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure
            </span>
          </div>
          
          <div className="divide-y divide-gray-50">
            {dashboardData?.billing_history && dashboardData.billing_history.length > 0 ? (
              dashboardData.billing_history.map((payment) => (
                <div key={payment.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${payment.status === 'succeeded' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{payment.description}</p>
                      <p className="text-xs text-gray-500">{payment.date} • {payment.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{payment.amount}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${payment.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500 text-sm">
                No payment history found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- ADDED: RECENT ACCESS LOG --- */}
      <div className="max-w-5xl mx-auto mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="px-8 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-3">
              <div className="bg-gray-900 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Recent Access Log
            </h3>
            <span className="text-xs font-black text-red-700 bg-red-100 px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              Live
            </span>
          </div>
          
          <div className="divide-y divide-gray-50">
            {dashboardData?.recent_activity && dashboardData.recent_activity.length > 0 ? (
              dashboardData.recent_activity.map((activity, index) => (
                <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-red-50 border-red-100 text-red-600">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                       </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Gym Entry</p>
                      <p className="text-xs text-gray-500">Main Entrance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{activity.time}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500 text-sm">
                No recent visits recorded.
              </div>
            )}
          </div>
        </div>
        </div>
      </>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="max-w-5xl mx-auto">
          <MyBookings user={user} />
        </div>
      )}

      {/* Elegant Complete Profile Modal */}
      {shouldShowProfilePrompt && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-zinc-900 text-white animate-slideUp" style={{animationDuration: '0.6s', animationFillMode: 'both', animationDelay: '0.1s'}}>
            <div className="px-5 py-4 border-b border-white/10 bg-zinc-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-red-400">Complete Profile</p>
                  <h3 className="text-lg font-black mt-1.5 text-white">Welcome, {user.name.split(' ')[0]} 👋</h3>
                  <p className="text-xs text-slate-400 mt-1.5">Finish your profile for better support.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDismissProfilePrompt}
                  className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
                  aria-label="Close profile prompt"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="px-5 py-4">
              <form onSubmit={submitProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div style={{animationDuration: '0.6s', animationDelay: '0.3s', animationFillMode: 'both'}}>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">📱 Phone</label>
                  <div className="relative group">
                    <input
                      value={profileForm.phone}
                      onChange={(e) => handleProfileFieldChange('phone', e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="+254 700 000"
                    />
                    {profileForm.phone && <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-400 text-sm">✓</div>}
                  </div>
                </div>
                <div style={{animationDuration: '0.6s', animationDelay: '0.4s', animationFillMode: 'both'}}>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">⚧ Gender</label>
                  <div className="relative group">
                    <select
                      value={profileForm.gender}
                      onChange={(e) => handleProfileFieldChange('gender', e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-white text-zinc-900" value="">Select</option>
                      <option className="bg-white text-zinc-900" value="male">Male</option>
                      <option className="bg-white text-zinc-900" value="female">Female</option>
                      <option className="bg-white text-zinc-900" value="other">Other</option>
                    </select>
                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    {profileForm.gender && <div className="absolute right-8 top-1/2 -translate-y-1/2 text-green-400 text-sm">✓</div>}
                  </div>
                </div>
                <div className="md:col-span-2" style={{animationDuration: '0.6s', animationDelay: '0.5s', animationFillMode: 'both'}}>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">📅 DOB</label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={dobSelection.month}
                      onChange={(e) => handleDobSelectionChange('month', e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-white text-zinc-900" value="">Month</option>
                      {dobMonthOptions.map((month) => (
                        <option key={month.value} className="bg-white text-zinc-900" value={month.value}>{month.label}</option>
                      ))}
                    </select>
                    <select
                      value={dobSelection.day}
                      onChange={(e) => handleDobSelectionChange('day', e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-white text-zinc-900" value="">Day</option>
                      {dobDayOptions.map((day) => (
                        <option key={day} className="bg-white text-zinc-900" value={day}>{day}</option>
                      ))}
                    </select>
                    <select
                      value={dobSelection.year}
                      onChange={(e) => handleDobSelectionChange('year', e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-xs text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none cursor-pointer"
                    >
                      <option className="bg-white text-zinc-900" value="">Year</option>
                      {dobYearOptions.map((year) => (
                        <option key={year} className="bg-white text-zinc-900" value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2" style={{animationDuration: '0.6s', animationDelay: '0.6s', animationFillMode: 'both'}}>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">📍 Address</label>
                  <div className="relative group">
                    <input
                      value={profileForm.address}
                      onChange={(e) => handleProfileFieldChange('address', e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="City, Street"
                    />
                    {profileForm.address && <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-400 text-sm">✓</div>}
                  </div>
                </div>

                {profileError && (
                  <div className="md:col-span-2 text-xs font-semibold text-red-300 bg-red-900/30 border border-red-700 rounded-lg px-3 py-2" role="alert">
                    <div className="flex items-center gap-1.5"><span>⚠️</span> {profileError}</div>
                  </div>
                )}
                {profileSuccess && (
                  <div className="md:col-span-2 text-xs font-semibold text-emerald-300 bg-emerald-900/30 border border-emerald-700 rounded-lg px-3 py-2" role="status">
                    <div className="flex items-center gap-1.5"><span>✨</span> {profileSuccess}</div>
                  </div>
                )}

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-2 sm:justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleDismissProfilePrompt}
                    className="px-4 py-2 rounded-lg border border-zinc-700 text-slate-300 hover:text-white hover:bg-zinc-800 text-xs font-bold transition-all"
                  >
                    Later
                  </button>
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black transition-all"
                  >
                    {profileSaving ? 'Saving' : '✅ Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- SCANNER MODAL (ANIMATED) --- */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-lg animate-fadeIn">
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Inline styles for custom animations */}
      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-slideUp {
            animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes slideInField {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        .animate-slideInField {
            animation: slideInField 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-slideDown {
            animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-shimmer {
            animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default MemberDashboard;