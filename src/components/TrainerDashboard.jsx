import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';
import { FaWhatsapp } from 'react-icons/fa';

function TrainerDashboard({ user, onGoHome }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

      if (response.ok) {
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: action } : b));
        setToast({ 
          message: action === 'confirmed' ? 'Booking confirmed!' : 'Booking rejected', 
          type: action === 'confirmed' ? 'success' : 'info' 
        });
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

  // Filter bookings by status
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  
  // Confirmed bookings only if date is in the future
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const acceptedBookings = bookings.filter(b => {
    if (b.status !== 'confirmed') return false;
    const bookingDate = new Date(b.preferred_date);
    return bookingDate >= today;
  });
  
  // History: rejected, cancelled, or past confirmed bookings
  const historyBookings = bookings.filter(b => 
    b.status === 'rejected' || 
    b.status === 'cancelled' ||
    (b.status === 'confirmed' && new Date(b.preferred_date) < today)
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
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">{booking.user_name}</h3>
                        <p className="text-sm text-gray-500 font-semibold">{booking.user_email}</p>
                        <p className="text-sm text-gray-500 font-semibold">📱 {booking.user_phone}</p>
                      </div>
                      <span className="px-4 py-2 rounded-full font-bold text-sm border-2 bg-yellow-100 text-yellow-800 border-yellow-300">
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
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">{booking.user_name}</h3>
                        <p className="text-sm text-gray-500 font-semibold">{booking.user_email}</p>
                        <p className="text-sm text-gray-500 font-semibold">📱 {booking.user_phone}</p>
                      </div>
                      <span className="px-4 py-2 rounded-full font-bold text-sm border-2 bg-green-100 text-green-800 border-green-300">
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
                    <div className="mb-4">
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
                      <p className="text-xs text-gray-500 mt-2 text-center">📱 {booking.user_phone}</p>
                    </div>
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
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden opacity-75">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-700">{booking.user_name}</h3>
                        <p className="text-sm text-gray-500">{booking.user_email}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full font-bold text-sm border-2 ${
                        booking.status === 'rejected' 
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}>
                        {booking.status === 'rejected' ? '❌ Rejected' : '🚫 Cancelled'}
                      </span>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>📅 {formatDate(booking.preferred_date)}</span>
                      <span>⏰ {formatTime(booking.preferred_time)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
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
        title={confirmModal.action === 'confirmed' ? 'Confirm Booking' : 'Reject Booking'}
        message={
          confirmModal.action === 'confirmed'
            ? 'Are you sure you want to confirm this booking? The client will be notified.'
            : 'Are you sure you want to reject this booking? The client will be notified.'
        }
        confirmText={confirmModal.action === 'confirmed' ? 'Yes, Confirm' : 'Yes, Reject'}
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, bookingId: null, action: null })}
      />
    </div>
  );
}

export default TrainerDashboard;
