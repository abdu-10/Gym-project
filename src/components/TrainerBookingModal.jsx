import React, { useEffect, useRef, useState } from 'react';

function TrainerBookingModal({ isOpen, onClose, trainer, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setErrors([]);
      setSuccessMessage(null);
      requestAnimationFrame(() => setIsAnimating(true));

      const handleEscape = (e) => {
        if (e.key === 'Escape') handleCloseModal();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen || !trainer) return null;

  const handleCloseModal = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccessMessage(null);

    const formData = new FormData(e.target);

    const submissionData = {
      trainer_booking: {
        trainer_name: trainer.name,
        user_name: formData.get('user_name'),
        user_email: formData.get('user_email'),
        user_phone: formData.get('user_phone'),
        preferred_date: formData.get('preferred_date'),
        goals_message: formData.get('goals_message'),
      },
    };

    try {
      const response = await fetch('http://localhost:3000/trainer_bookings', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
        credentials: 'include'
      });

      const data = await response.json().catch(() => ({ errors: ['Server returned a non-JSON response.'] }));

      if (response.ok) {
        setSuccessMessage(`Success! Your session request with ${trainer.name} has been submitted. A confirmation email is on its way.`);
        setTimeout(handleCloseModal, 3000);
      } else {
        setErrors(data.errors || [`Submission failed with status ${response.status}.`]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors(['Network error or server unreachable.']);
      setLoading(false);
    }
  };

  const scaleClass = isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0';

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm bg-gray-900/80 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleCloseModal}
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-xl shadow-2xl w-full max-w-lg p-7 relative transform transition-all duration-300 ease-out border border-red-50 max-h-[90vh] overflow-y-auto ${scaleClass}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50"
          aria-label="Close booking modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="text-center mb-6 pt-2">
          <img src={trainer.image || 'https://placehold.co/80x80/9F1239/ffffff?text=PT'} alt={trainer.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-red-600 ring-offset-2"/>
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Book Session with {trainer.name}</h3>
          <p className="text-red-600 font-bold text-sm uppercase mt-0.5">{trainer.role}</p>
        </div>

        {loading && <div className="flex items-center justify-center p-3 mb-4 text-sm font-semibold text-red-700 bg-red-100 rounded-lg">Sending booking request...</div>}
        {errors.length > 0 && <div className="p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg" role="alert"><ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul></div>}
        {successMessage && <div className="p-4 mb-4 text-sm text-green-800 bg-green-50 rounded-lg font-bold" role="alert">{successMessage}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <fieldset disabled={loading || successMessage} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="user_name" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Your Name</label>
              <input 
                id="user_name"
                name="user_name"
                type="text"
                defaultValue={currentUser?.name || ''}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="user_email" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Email Address</label>
              <input 
                id="user_email"
                name="user_email"
                type="email"
                defaultValue={currentUser?.email || ''}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                required
              />
            </div>

            {/* Phone & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="user_phone" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Phone</label>
                <input id="user_phone" name="user_phone" type="tel" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" required/>
              </div>
              <div>
                <label htmlFor="preferred_date" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Preferred Date</label>
                <input id="preferred_date" name="preferred_date" type="date" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" required/>
              </div>
            </div>

            <div>
              <label htmlFor="goals_message" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Goals & Requirements</label>
              <textarea id="goals_message" name="goals_message" rows="3" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" placeholder="Tell us about your fitness goals..."></textarea>
            </div>
          </fieldset>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} disabled={loading} className="flex-1 px-4 py-3 text-sm font-bold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading || successMessage} className="flex-1 px-4 py-3 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700">{loading ? 'Submitting...' : 'Confirm Booking'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrainerBookingModal;
