import React, { useState, useEffect, useCallback } from 'react';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';
import { FaWhatsapp } from 'react-icons/fa';

function TrainerDashboard({ user, onGoHome }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(null);
  const [earningsPackages, setEarningsPackages] = useState([]);
  const [earningsLoading, setEarningsLoading] = useState(true);
  const [earningsError, setEarningsError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, bookingId: null, action: null });

  // Fetch trainer's bookings
  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    fetch(`http://localhost:3000/trainer_bookings?trainer_user_id=${user.id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data.trainer_bookings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setToast({ message: 'Failed to load bookings', type: 'error' });
        setLoading(false);
      });
  }, [user]);

  const fetchEarnings = useCallback(() => {
    const trainerId = user?.trainer_id ?? user?.id;
    if (!trainerId) return;

    setEarningsLoading(true);
    setEarningsError(null);

    fetch(`http://localhost:3000/trainer_packages?trainer_id=${trainerId}`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch earnings');
        return res.json();
      })
      .then(data => {
        setEarnings(data.earnings || null);
        setEarningsPackages(data.trainer_packages || []);
        setEarningsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching earnings:', err);
        setEarningsError('Failed to load earnings');
        setEarningsLoading(false);
      });
  }, [user]);

  // Fetch trainer earnings summary
  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  // Handle accept/reject
  const handleAction = (bookingId, action) => {
    setConfirmModal({ isOpen: true, bookingId, action });
  };

  const handleConfirmAction = async () => {
    const { bookingId, action } = confirmModal;
    setConfirmModal({ isOpen: false, bookingId: null, action: null });
    
    setProcessingId(bookingId);
    try {
      const response = await fetch(`http://localhost:3000/trainer_bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Booking update response:', data);
      console.log('trainer_package in response:', data.trainer_package);

      if (response.ok) {
        // Use backend response if available, otherwise use local action
        const updatedBooking = data.booking || { id: bookingId, status: action };
        console.log('Updated booking status:', updatedBooking.status);
        
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, ...updatedBooking } : b));
        const messages = {
          confirmed: 'Booking confirmed!',
          rejected: 'Booking rejected',
          completed: '✅ Session completed & session deducted!'
        };
        setToast({ 
          message: messages[action] || 'Booking updated', 
          type: ['confirmed', 'completed'].includes(action) ? 'success' : 'info' 
        });

        // If session completed, update earnings with returned package data
        if (action === 'completed') {
          console.log('Completed action detected');
          console.log('data.trainer_package exists?', !!data.trainer_package);
          console.log('earningsPackages before update:', earningsPackages);
          
          if (data.trainer_package) {
            console.log('Updating earningsPackages with:', data.trainer_package);
            setEarningsPackages(prevPkgs => {
              const updated = prevPkgs.map(pkg => 
                pkg.id === data.trainer_package.id 
                  ? {
                      ...pkg,
                      sessions_used: data.trainer_package.sessions_used,
                      sessions_left: data.trainer_package.sessions_remaining
                    }
                  : pkg
              );
              console.log('Updated earningsPackages:', updated);
              return updated;
            });
          }
          // Also refresh to get updated earnings totals
          console.log('Calling fetchEarnings');
          fetchEarnings();
        }
      } else {
        console.error('Backend error:', data);
        setToast({ message: data.message || 'Failed to update booking', type: 'error' });
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      setToast({ message: 'Network error', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  // Check if session time has passed (allows marking complete)
  const canMarkComplete = (booking) => {
    if (booking.status !== 'confirmed') return false;
    const bookingDateTime = new Date(`${booking.preferred_date}T${booking.preferred_time || '00:00'}`);
    const now = new Date();
    return bookingDateTime <= now;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  };

  // Filter bookings by status
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  
  // Confirmed bookings stay in Accepted until explicitly completed or cancelled
  // This allows trainers to mark past sessions as complete
  const acceptedBookings = bookings.filter(b => b.status === 'confirmed');
  
  // History: rejected, cancelled, or completed bookings
  const historyBookings = bookings.filter(b => 
    b.status === 'rejected' || 
    b.status === 'cancelled' ||
    b.status === 'completed'
  );

  // Stats
  const stats = {
    pending: pendingBookings.length,
    accepted: acceptedBookings.length,
    total: bookings.length
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-red-600 rounded-full"></div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            TRAINER <span className="text-gray-400 font-light">PORTAL</span>
          </h1>
        </div>
        <button 
          onClick={onGoHome}
          className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          ← Back to Home
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Earnings Summary */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Earnings Overview</h2>
              <p className="text-sm text-gray-500">Revenue split: 60% trainer · 40% gym</p>
            </div>
            {earningsError && (
              <span className="text-xs font-semibold text-red-600">{earningsError}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">Gross Revenue</p>
              <p className="text-3xl font-black">
                {earningsLoading ? '...' : formatCurrency(earnings?.gross_revenue)}
              </p>
              <p className="text-xs text-indigo-100 mt-1">All package sales</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">Your Earnings (60%)</p>
              <p className="text-3xl font-black">
                {earningsLoading ? '...' : formatCurrency(earnings?.trainer_earnings)}
              </p>
              <p className="text-xs text-emerald-100 mt-1">Available earnings</p>
            </div>

            <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-slate-200 text-xs font-bold uppercase tracking-wider mb-2">Packages Sold</p>
              <p className="text-3xl font-black">
                {earningsLoading ? '...' : (earnings?.package_count ?? 0)}
              </p>
              <p className="text-xs text-slate-200 mt-1">Total packages</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-bold uppercase tracking-wider mb-2">Pending</p>
                <p className="text-4xl font-black">{stats.pending}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-bold uppercase tracking-wider mb-2">Accepted</p>
                <p className="text-4xl font-black">{stats.accepted}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-2">Total</p>
                <p className="text-4xl font-black">{stats.total}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-200 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all relative ${
              activeTab === 'pending' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ⏳ Pending ({stats.pending})
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-lg"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all relative ${
              activeTab === 'accepted' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✅ Accepted ({stats.accepted})
            {activeTab === 'accepted' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-lg"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all relative ${
              activeTab === 'history' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📜 History
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-lg"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-6 py-4 font-bold uppercase tracking-wider text-sm transition-all relative ${
              activeTab === 'earnings' ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💰 Earnings
            {activeTab === 'earnings' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-lg"></div>
            )}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-red-600 rounded-full"></div>
              </div>
              <p className="text-gray-600 font-semibold">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* Pending Tab */}
        {!loading && activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingBookings.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-gray-200">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600 font-semibold">No pending booking requests at the moment.</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <div key={booking.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all">
                  <div className="p-6">
                    {/* User Header with Avatar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4 flex-1">
                        {/* User Avatar/Image */}
                        {booking.user_image ? (
                          <img 
                            src={getImageUrl(booking.user_image)} 
                            alt={booking.user_name}
                            className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-yellow-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-yellow-200 flex-shrink-0">
                            {booking.user_name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        {/* User Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-gray-900">{booking.user_name}</h3>
                          <p className="text-sm text-gray-500 font-semibold">{booking.user_email}</p>
                        </div>
                      </div>
                      <span className="px-4 py-2 rounded-full font-bold text-sm border-2 bg-yellow-100 text-yellow-800 border-yellow-300 whitespace-nowrap">
                        ⏳ Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">📅 Date</p>
                        <p className="text-lg font-black text-gray-900">{formatDate(booking.preferred_date)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">⏰ Time</p>
                        <p className="text-lg font-black text-gray-900">{formatTime(booking.preferred_time)}</p>
                      </div>
                    </div>

                    {booking.goals_message && (
                      <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <p className="text-xs font-black text-blue-700 uppercase tracking-wider mb-2">💪 Client Goals</p>
                        <p className="text-sm text-gray-700">{booking.goals_message}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAction(booking.id, 'confirmed')}
                        disabled={processingId === booking.id}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all hover:scale-105 shadow-lg disabled:opacity-50"
                      >
                        {processingId === booking.id ? '🔄 Processing...' : '✅ Accept'}
                      </button>
                      <button
                        onClick={() => handleAction(booking.id, 'rejected')}
                        disabled={processingId === booking.id}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all hover:scale-105 shadow-lg disabled:opacity-50"
                      >
                        {processingId === booking.id ? '🔄 Processing...' : '❌ Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Accepted Tab */}
        {!loading && activeTab === 'accepted' && (
          <div className="space-y-4">
            {acceptedBookings.length === 0 ? (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 text-center border-2 border-blue-200">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No Accepted Sessions</h3>
                <p className="text-gray-600 font-semibold">You haven't confirmed any bookings yet.</p>
              </div>
            ) : (
              acceptedBookings.map((booking) => (
                <div key={booking.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all">
                  <div className="p-6">
                    {/* User Header with Avatar */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4 flex-1">
                        {/* User Avatar/Image */}
                        {booking.user_image ? (
                          <img 
                            src={getImageUrl(booking.user_image)} 
                            alt={booking.user_name}
                            className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-red-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-red-200 flex-shrink-0">
                            {booking.user_name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        {/* User Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-gray-900">{booking.user_name}</h3>
                          <p className="text-sm text-gray-500 font-semibold">{booking.user_email}</p>
                        </div>
                      </div>
                      <span className="px-4 py-2 rounded-full font-bold text-sm border-2 bg-green-100 text-green-800 border-green-300 whitespace-nowrap">
                        ✅ Confirmed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">📅 Date</p>
                        <p className="text-lg font-black text-gray-900">{formatDate(booking.preferred_date)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                        <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">⏰ Time</p>
                        <p className="text-lg font-black text-gray-900">{formatTime(booking.preferred_time)}</p>
                      </div>
                    </div>

                    {booking.goals_message && (
                      <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <p className="text-xs font-black text-blue-700 uppercase tracking-wider mb-2">💪 Client Goals</p>
                        <p className="text-sm text-gray-700">{booking.goals_message}</p>
                      </div>
                    )}

                    {/* Contact Client Section */}
                    <div className="mb-6">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">💬 Contact Client</p>
                      <div className="flex gap-3">
                        {/* Call Client Button */}
                        <a
                          href={`tel:${booking.user_phone?.replace(/\s/g, '')}`}
                          className="flex-1 px-4 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-black rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 hover:shadow-lg shadow-md flex items-center justify-center gap-2 active:scale-95"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>Call</span>
                        </a>

                        {/* WhatsApp Button */}
                        <a
                          href={`https://wa.me/${booking.user_phone?.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-4 bg-gradient-to-br from-green-500 to-green-600 text-white font-black rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 hover:shadow-lg shadow-md flex items-center justify-center gap-2 active:scale-95"
                        >
                          <FaWhatsapp className="w-5 h-5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    {/* Mark Complete Button */}
                    {canMarkComplete(booking) && (
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleAction(booking.id, 'completed')}
                          disabled={processingId === booking.id}
                          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-black rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 hover:shadow-lg shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {processingId === booking.id ? '🔄 Processing...' : '✅ Mark Complete & Deduct Session'}
                        </button>
                        <p className="text-xs text-purple-600 mt-2 text-center font-semibold">Session time has passed - mark complete to deduct from package</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* History Tab */}
        {!loading && activeTab === 'history' && (
          <div className="space-y-4">
            {historyBookings.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-gray-200">
                <div className="text-5xl mb-4">📜</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No History</h3>
                <p className="text-gray-600 font-semibold">No rejected or cancelled bookings.</p>
              </div>
            ) : (
              historyBookings.map((booking) => (
                <div key={booking.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden opacity-75 hover:opacity-100 transition-all">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* User Avatar/Image */}
                        {booking.user_image ? (
                          <img 
                            src={getImageUrl(booking.user_image)} 
                            alt={booking.user_name}
                            className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-gray-300 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md border-2 border-gray-300 flex-shrink-0">
                            {booking.user_name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        {/* User Info */}
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-700">{booking.user_name}</h3>
                          <p className="text-sm text-gray-500">{booking.user_email}</p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full font-bold text-sm border-2 whitespace-nowrap ${
                        booking.status === 'rejected' 
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : booking.status === 'completed'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}>
                        {booking.status === 'rejected' ? '❌ Rejected' : booking.status === 'completed' ? '✅ Completed' : '🚫 Cancelled'}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
                      <span className="font-semibold">📅 {formatDate(booking.preferred_date)}</span>
                      <span className="font-semibold">⏰ {formatTime(booking.preferred_time)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Earnings Tab */}
        {!loading && activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Earnings Detail</h3>
                  <p className="text-sm text-gray-500">Packages sold and your 60% earnings</p>
                </div>
                {earningsError && (
                  <span className="text-xs font-semibold text-red-600">{earningsError}</span>
                )}
              </div>

              <div className="p-6">
                {earningsLoading ? (
                  <div className="text-center text-sm text-gray-500">Loading earnings...</div>
                ) : earningsPackages.length === 0 ? (
                  <div className="text-center text-sm text-gray-500">No packages sold yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Package</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Sessions</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Used</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Left</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Gross</th>
                          <th className="text-left py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Your 60%</th>
                          <th className="text-right py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Purchased</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[...earningsPackages]
                          .map((pkg) => {
                            const sessions = Number(pkg.sessions_purchased ?? pkg.sessions ?? 0);
                            const sessionsUsed = Number(pkg.sessions_used ?? 0);
                            const sessionsLeft = Math.max(sessions - sessionsUsed, 0);
                            const isCompleted = sessions > 0 && sessionsLeft === 0;
                            const expiresAt = pkg.expires_at ? new Date(pkg.expires_at) : null;
                            const isOverdue = !isCompleted && expiresAt && expiresAt < new Date();

                            return {
                              pkg,
                              sessions,
                              sessionsUsed,
                              sessionsLeft,
                              isCompleted,
                              isOverdue
                            };
                          })
                          .sort((a, b) => {
                            if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
                            if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
                            return (b.sessionsLeft ?? 0) - (a.sessionsLeft ?? 0);
                          })
                          .map(({ pkg, sessions, sessionsUsed, sessionsLeft, isCompleted, isOverdue }) => {
                          const gross = Number(pkg.total_cost ?? pkg.amount ?? 0);
                          const trainerShare = pkg.trainer_earnings ?? (gross * 0.6);
                          const clientName = pkg.user_name || pkg.client_name || pkg.user?.name || 'Client';
                          const packageName = pkg.package_type || pkg.plan_name || 'Package';
                          const purchasedAt = pkg.purchased_at || pkg.created_at;
                          const progress = sessions > 0 ? Math.min((sessionsUsed / sessions) * 100, 100) : 0;

                          return (
                            <tr
                              key={pkg.id}
                              className={`hover:bg-gray-50 transition-colors ${
                                isOverdue ? 'bg-amber-50/60' : ''
                              }`}
                            >
                              <td className="py-3 text-sm font-semibold text-gray-900">{clientName}</td>
                              <td className="py-3 text-sm text-gray-600">{packageName}</td>
                              <td className="py-3 text-sm text-gray-600">{sessions || '—'}</td>
                              <td className="py-3 text-sm text-gray-600">{sessionsUsed}</td>
                              <td className="py-3 text-sm text-gray-600">{sessionsLeft}</td>
                              <td className="py-3 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                  isCompleted
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : isOverdue
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {isCompleted ? '✅ Completed' : isOverdue ? '⚠️ Overdue' : '⏳ Active'}
                                </span>
                              </td>
                              <td className="py-3 text-sm text-gray-600">
                                <div className="w-28">
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${isCompleted ? 'bg-emerald-500' : isOverdue ? 'bg-amber-500' : 'bg-red-500'}`}
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-[10px] text-gray-500 mt-1">{Math.round(progress)}%</div>
                                </div>
                              </td>
                              <td className="py-3 text-sm text-gray-600">{formatCurrency(gross)}</td>
                              <td className="py-3 text-sm font-semibold text-emerald-600">{formatCurrency(trainerShare)}</td>
                              <td className="py-3 text-sm text-gray-600 text-right">{purchasedAt ? formatDate(purchasedAt) : '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={
          confirmModal.action === 'confirmed'
            ? 'Confirm Booking'
            : confirmModal.action === 'completed'
            ? 'Mark Session Complete'
            : 'Reject Booking'
        }
        message={
          confirmModal.action === 'confirmed'
            ? 'Are you sure you want to confirm this booking? The client will be notified.'
            : confirmModal.action === 'completed'
            ? 'Mark this session as completed and deduct one session from the client package?'
            : 'Are you sure you want to reject this booking? The client will be notified.'
        }
        confirmText={
          confirmModal.action === 'confirmed'
            ? 'Yes, Confirm'
            : confirmModal.action === 'completed'
            ? 'Yes, Mark Complete'
            : 'Yes, Reject'
        }
        variant={
          confirmModal.action === 'rejected'
            ? 'danger'
            : confirmModal.action === 'completed'
            ? 'success'
            : 'info'
        }
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, bookingId: null, action: null })}
      />
    </div>
  );
}

export default TrainerDashboard;
