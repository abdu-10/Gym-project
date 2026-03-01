import React, { useEffect, useState } from 'react';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';
import DisputeModal from './DisputeModal';

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, bookingId: null });
  const [disputeModal, setDisputeModal] = useState({ isOpen: false, booking: null });

  // Fetch user's bookings
  useEffect(() => {
    if (!user?.id) return;
    
    setLoading(true);
    fetch(`http://localhost:3000/trainer_bookings?user_id=${user.id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data.trainer_bookings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setToast({ message: 'Failed to load bookings. Please refresh the page.', type: 'error' });
        setLoading(false);
      });
  }, [user]);

  // Cancel booking
  const handleCancelClick = (bookingId) => {
    setConfirmModal({ isOpen: true, bookingId });
  };

  const handleCancelConfirm = async () => {
    const bookingId = confirmModal.bookingId;
    setConfirmModal({ isOpen: false, bookingId: null });
    
    setCancellingId(bookingId);
    try {
      const response = await fetch(`http://localhost:3000/trainer_bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
        credentials: 'include'
      });

      if (response.ok) {
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        setToast({ message: 'Booking cancelled successfully!', type: 'success' });
      } else {
        setToast({ message: 'Failed to cancel booking. Please try again.', type: 'error' });
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setToast({ message: 'Network error. Please check your connection.', type: 'error' });
    } finally {
      setCancellingId(null);
    }
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      accepted: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
      completed: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    const labels = {
      pending: '⏳ Pending',
      accepted: '✅ Accepted',
      rejected: '❌ Rejected',
      cancelled: '🚫 Cancelled',
      completed: '✅ Completed'
    };
    return { style: styles[status] || styles.pending, label: labels[status] || status };
  };

  // Check if dispute window is still open (24 hours from completion)
  const isDisputeWindowOpen = (completedAt) => {
    if (!completedAt) return false;
    const completionTime = new Date(completedAt).getTime();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return (now - completionTime) < twentyFourHours;
  };

  // Get remaining dispute time
  const getDisputeTimeRemaining = (completedAt) => {
    const completionTime = new Date(completedAt).getTime();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const remaining = twentyFourHours - (now - completionTime);
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  // Handle dispute submission
  const handleDisputeSubmit = (data) => {
    // Update booking to show disputed status
    setBookings(bookings.map(b => 
      b.id === data.booking.id 
        ? { ...b, dispute_reason: data.booking.dispute_reason, is_disputed: true }
        : b
    ));
    
    setToast({ 
      message: '📤 Dispute submitted successfully. Our team will review it shortly.', 
      type: 'success' 
    });
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-red-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 font-semibold">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-8 bg-red-600 rounded-full"></div>
        <h2 className="text-3xl font-black text-gray-900">My Bookings</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 text-center border-2 border-blue-200">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Bookings Yet</h3>
          <p className="text-gray-600 font-semibold mb-6">
            Book a trainer to get started with your fitness journey!
          </p>
          <a
            href="#trainers"
            className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
          >
            Browse Trainers
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const { style, label } = getStatusBadge(booking.status);
            const trainerPhone = booking.trainer_phone || '';
            const whatsappLink = trainerPhone ? `https://wa.me/${trainerPhone.replace(/\D/g, '')}` : null;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="p-6">
                  {/* Top Row: Trainer info + Status */}
                  <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      {booking.trainer_image && (
                        <img
                          src={booking.trainer_image}
                          alt={booking.trainer_name}
                          className="w-16 h-16 rounded-xl object-cover shadow-md"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-black text-gray-900">
                          {booking.trainer_name}
                        </h3>
                        <p className="text-sm text-gray-500 font-semibold">
                          {booking.trainer_role || 'Trainer'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Booking ID: #{booking.id}
                        </p>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full font-bold text-sm border-2 ${style}`}>
                      {label}
                    </span>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                        📅 Date
                      </p>
                      <p className="text-lg font-black text-gray-900">
                        {formatDate(booking.preferred_date)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                        ⏰ Time
                      </p>
                      <p className="text-lg font-black text-gray-900">
                        {booking.preferred_time}
                      </p>
                    </div>
                  </div>

                  {/* Goals */}
                  {booking.goals_message && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                      <p className="text-xs font-black text-blue-700 uppercase tracking-wider mb-2">
                        💪 Your Goals
                      </p>
                      <p className="text-sm text-gray-700">{booking.goals_message}</p>
                    </div>
                  )}

                  {/* Status-specific actions */}
                  <div className="flex gap-3 flex-wrap">
                    {booking.status === 'pending' && (
                      <>
                        <div className="flex-1 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                          <p className="text-sm font-semibold text-yellow-800">
                            ⏳ Waiting for trainer response
                          </p>
                          <p className="text-xs text-yellow-700 mt-1">
                            {booking.trainer_name} will confirm soon
                          </p>
                        </div>
                        <button
                          onClick={() => handleCancelClick(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? '🔄 Cancelling...' : '❌ Cancel'}
                        </button>
                      </>
                    )}

                    {booking.status === 'accepted' && (
                      <>
                        <div className="flex-1 bg-green-50 rounded-xl p-4 border border-green-200">
                          <p className="text-sm font-semibold text-green-800">
                            ✅ Trainer accepted your booking!
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Ready to connect and discuss details
                          </p>
                        </div>
                        <a
                          href={`tel:${booking.trainer_phone?.replace(/\s/g, '')}`}
                          className="px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
                          title="Call trainer"
                        >
                          📞 Call
                        </a>
                        {whatsappLink && (
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
                          >
                            💬 WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => handleCancelClick(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? '🔄 Cancelling...' : '❌ Cancel'}
                        </button>
                      </>
                    )}

                    {booking.status === 'rejected' && (
                      <>
                        <div className="flex-1 bg-red-50 rounded-xl p-4 border border-red-200">
                          <p className="text-sm font-semibold text-red-800">
                            ❌ Trainer unavailable for this time
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            Please try booking another trainer
                          </p>
                        </div>
                        <a
                          href="#trainers"
                          className="px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
                        >
                          🔄 Book Another
                        </a>
                      </>
                    )}

                    {booking.status === 'completed' && (
                      <>
                        <div className="flex-1 bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <p className="text-sm font-semibold text-purple-800">
                            ✅ Session Completed
                          </p>
                          <p className="text-xs text-purple-700 mt-1">
                            Completed on {formatDate(booking.updated_at)}
                          </p>
                          {booking.is_disputed && (
                            <p className="text-xs text-orange-700 mt-2 font-semibold">
                              ⚠️ Dispute Pending Review
                            </p>
                          )}
                          {!booking.is_disputed && isDisputeWindowOpen(booking.updated_at) && (
                            <p className="text-xs text-purple-700 mt-2">
                              You can dispute this session within 24 hours
                            </p>
                          )}
                        </div>
                        {!booking.is_disputed && isDisputeWindowOpen(booking.updated_at) && (
                          <button
                            onClick={() => setDisputeModal({ isOpen: true, booking })}
                            className="px-4 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 border-2 border-red-200 transition-all"
                            title={`Dispute expires in ${getDisputeTimeRemaining(booking.updated_at)}`}
                          >
                            ⚠️ Dispute ({getDisputeTimeRemaining(booking.updated_at)})
                          </button>
                        )}
                      </>
                    )}

                    {booking.status === 'cancelled' && (
                      <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">
                          🚫 You cancelled this booking
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Cancelled on {formatDate(booking.updated_at)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Trainer Contact Info */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3 text-sm">
                    <span className="text-gray-700 font-semibold">📧 Trainer Email:</span>
                    <a
                      href={`mailto:${booking.trainer_email}`}
                      className="text-red-600 font-bold hover:underline"
                    >
                      {booking.trainer_email}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Notification */}
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
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="Keep Booking"
        onConfirm={handleCancelConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, bookingId: null })}
      />

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={disputeModal.isOpen}
        booking={disputeModal.booking}
        onClose={() => setDisputeModal({ isOpen: false, booking: null })}
        onSubmit={handleDisputeSubmit}
      />
    </div>
  );
}

export default MyBookings;
