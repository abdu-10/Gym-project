import React, { useState } from 'react';

function DisputeModal({ isOpen, onClose, booking, onSubmit }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please enter a reason for the dispute');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/trainer_bookings/${booking.id}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dispute_reason: reason }),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        onSubmit(data);
        setReason('');
        onClose();
      } else {
        alert(data.message || 'Failed to submit dispute');
      }
    } catch (err) {
      console.error('Error submitting dispute:', err);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  const handleCloseModal = () => {
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/30">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl transform">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Dispute Session</h2>
              <p className="text-sm text-gray-600 mt-1">With {booking.trainer_name}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {new Date() < new Date(new Date(booking.created_at).getTime() + 24 * 60 * 60 * 1000) 
              ? "You have 24 hours to dispute this session."
              : "Dispute window has expired."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Text Area */}
          <div>
            <label htmlFor="reason" className="block text-sm font-bold text-gray-700 mb-2">
              Why are you disputing this session? *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why this session didn't happen or was incomplete..."
              disabled={loading}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white hover:border-gray-300 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">{reason.length}/500 characters</p>
          </div>

          {/* Session Details */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Session Details</p>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold text-gray-700">📅 Date:</span> <span className="text-gray-600">{new Date(booking.preferred_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></p>
              <p><span className="font-semibold text-gray-700">⏰ Time:</span> <span className="text-gray-600">{booking.preferred_time}</span></p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">ℹ️ What happens next</p>
            <p className="text-sm text-blue-700">
              Your dispute will be reviewed by the gym admin. If valid, the session won't be deducted from your package.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              Keep It
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? '🔄 Submitting...' : '📤 Submit Dispute'}
            </button>
          </div>
        </form>

        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DisputeModal;
