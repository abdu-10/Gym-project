import React, { useCallback, useEffect, useRef, useState } from 'react';

function TrainerBookingModal({ isOpen, onClose, trainer, currentUser }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const modalRef = useRef(null);

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  // Generate next 30 days
  const getNextDates = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const nextDates = getNextDates();

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Convert 12-hour format (6:00 AM) back to 24-hour format (06:00) for backend
  const formatTime12to24 = (time12) => {
    const [time, period] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    
    if (period === 'AM') {
      hours = hours === 12 ? 0 : hours;
    } else {
      hours = hours === 12 ? 12 : hours + 12;
    }
    
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  // Convert 24-hour format (06:00) to 12-hour format (6:00 AM)
  const formatTime24to12 = (time24) => {
    try {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      const formatted = `${hour12}:${minutes} ${ampm}`;
      return formatted;
    } catch (e) {
      console.error('Error formatting time:', time24, e);
      return time24;
    }
  };

  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a time slot is in the past for today
  const isTimePast = (timeSlot, date) => {
    if (!date) return false;
    const todayStr = getTodayDateString();

    if (date < todayStr) return true;
    if (date > todayStr) return false;

    // Parse the time slot (e.g., "4:00 PM" -> 16:00)
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return hour < currentHour || (hour === currentHour && parseInt(minutes, 10) <= currentMinute);
  };

  // Filter available slots to remove past times
  const getFilteredSlots = () => timeSlots.filter((slot) => !isTimePast(slot, selectedDate));

  // Fetch available slots when date is selected
  const fetchAvailableSlots = async (trainerId, date) => {
    if (!date || !trainerId) {
      console.warn('⚠️  Missing trainerId or date:', { trainerId, date });
      return;
    }
    
    console.log('🔍 Fetching slots for trainer:', trainerId, 'date:', date);
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedTimeSlot('');
    
    try {
      const url = `http://localhost:3000/trainers/${trainerId}/available_slots?date=${date}`;
      console.log('📡 Fetching from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch available slots`);
      }
      const data = await response.json();
      console.log('✅ Backend response:', data);
      console.log('📋 Raw available_slots array:', data.available_slots);
      
      if (!data.available_slots || data.available_slots.length === 0) {
        console.warn('⚠️  No available slots returned from backend!');
      }
      
      // Convert 24-hour format to 12-hour format
      const formattedSlots = (data.available_slots || []).map((slot) => {
        const formatted = formatTime24to12(slot);
        console.log(`  Slot: "${slot}" → "${formatted}"`);
        return formatted;
      });
      
      console.log('✨ All formatted slots:', formattedSlots);
      setAvailableSlots(formattedSlots);
      console.log('📌 availableSlots state updated to:', formattedSlots);
    } catch (err) {
      console.error('❌ Error fetching available slots:', err);
      console.log('🔄 Falling back to all slots');
      setAvailableSlots(timeSlots);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date) => {
    console.log('📅 handleDateChange called with date:', date, 'trainer.id:', trainer.trainer_id);
    setSelectedDate(date);
    fetchAvailableSlots(trainer.trainer_id, date);
  };

  const handleCloseModal = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setErrors([]);
      setSuccessMessage(null);
      setSelectedDate('');
      setSelectedTimeSlot('');
      setAvailableSlots([]);
      requestAnimationFrame(() => setIsAnimating(true));

      const handleEscape = (e) => {
        if (e.key === 'Escape') handleCloseModal();
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }

    setIsAnimating(false);
  }, [handleCloseModal, isOpen]);

  if (!isOpen || !trainer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTimeSlot) {
      setErrors(['Please select both a date and time slot']);
      return;
    }

    setLoading(true);
    setErrors([]);
    setSuccessMessage(null);

    const formData = new FormData(e.target);

    const submissionData = {
      trainer_booking: {
        trainer_id: trainer.trainer_id,
        trainer_name: trainer.name,
        user_name: formData.get('user_name'),
        user_email: formData.get('user_email'),
        user_phone: formData.get('user_phone'),
        preferred_date: selectedDate,
        preferred_time: formatTime12to24(selectedTimeSlot),
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

  const getAnimationDelay = (index) => `${index * 30}ms`;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm bg-gradient-to-br from-black/50 to-black/40 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleCloseModal}
    >
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes pulse-soft {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(220, 38, 38, 0);
          }
        }
        .animate-slide-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .animate-slide-down {
          animation: slideInDown 0.5s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s infinite;
        }
      `}</style>

      <div 
        ref={modalRef}
        className={`bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-2xl w-full max-w-lg p-8 relative transform transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto border border-gray-100 ${scaleClass}`}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-all p-2 rounded-full hover:bg-red-50 hover:scale-110 duration-200"
          aria-label="Close booking modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <div className="text-center mb-8 pt-2 animate-slide-down">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur-xl opacity-20 animate-pulse-soft"></div>
            <img src={trainer.image || 'https://placehold.co/80x80/9F1239/ffffff?text=PT'} alt={trainer.name} className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-red-500 ring-offset-2 shadow-lg relative animate-float"/>
          </div>
          <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Book with {trainer.name}</h3>
          <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-red-50 to-red-100 rounded-full border border-red-200">
            <p className="text-red-600 font-bold text-sm uppercase tracking-widest">🔥 {trainer.role}</p>
          </div>
        </div>

        {loading && <div className="flex items-center justify-center gap-2 p-4 mb-4 text-sm font-semibold text-red-700 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 animate-slide-up"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div> Sending booking request...</div>}
        {errors.length > 0 && <div className="p-4 mb-4 text-sm text-red-800 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 animate-slide-up" role="alert"><ul className="space-y-1">{errors.map((e, i) => <li key={i}>⚠️ {e}</li>)}</ul></div>}

        <form className="space-y-7" onSubmit={handleSubmit}>
          <fieldset disabled={loading || successMessage} className="space-y-7">
            {/* Name */}
            <div className="animate-slide-up opacity-0" style={{animation: `slideInUp 0.6s ease-out ${getAnimationDelay(0)} forwards`}}>
              <label htmlFor="user_name" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">👤 Your Name</label>
              <input 
                id="user_name"
                name="user_name"
                type="text"
                defaultValue={currentUser?.name || ''}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white hover:border-gray-300"
                required
              />
            </div>

            {/* Email */}
            <div style={{animation: `slideInUp 0.6s ease-out ${getAnimationDelay(1)} forwards`}} className="opacity-0">
              <label htmlFor="user_email" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">📧 Email Address</label>
              <input 
                id="user_email"
                name="user_email"
                type="email"
                defaultValue={currentUser?.email || ''}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white hover:border-gray-300"
                required
              />
            </div>

            {/* Phone */}
            <div style={{animation: `slideInUp 0.6s ease-out ${getAnimationDelay(2)} forwards`}} className="opacity-0">
              <label htmlFor="user_phone" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">📱 Phone</label>
              <input id="user_phone" name="user_phone" type="tel" className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white hover:border-gray-300" required/>
            </div>

            {/* Date Selection */}
            <div style={{animation: `slideInUp 0.6s ease-out ${getAnimationDelay(3)} forwards`}} className="opacity-0">
              <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">📅 Preferred Date</label>
              <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto pr-2 scrollbar-hide">
                {nextDates.map((date, idx) => {
                  const dateStr = formatDateForInput(date);
                  const isSelected = selectedDate === dateStr;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        console.log('🔘 DATE BUTTON CLICKED!!! dateStr:', dateStr);
                        handleDateChange(dateStr);
                      }}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all duration-200 transform hover:scale-105 ${
                        isSelected
                          ? 'bg-gradient-to-br from-red-500 to-red-600 text-white ring-2 ring-red-400 ring-offset-1 shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <div>{formatDateDisplay(date).split(' ')[0]}</div>
                      <div className="text-xs">{formatDateDisplay(date).split(' ')[1]} {formatDateDisplay(date).split(' ')[2]}</div>
                    </button>
                  );
                })}
              </div>
              {!selectedDate && <p className="text-xs text-red-500 font-semibold mt-2">📌 Please select a date</p>}
            </div>

            {/* Time Slot Selection */}
            <div style={{animation: `slideInUp 0.6s ease-out ${getAnimationDelay(4)} forwards`}} className="opacity-0">
              <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">⏰ Preferred Time</label>
              {loadingSlots && selectedDate && (
                <div className="text-center py-3 text-sm text-gray-600">Loading available times...</div>
              )}
              {selectedDate && !loadingSlots && (
                <div className="grid grid-cols-4 gap-2">
                  {(() => {
                    const filteredSlots = getFilteredSlots();

                    return filteredSlots.map((slot) => {
                      const isAvailable = availableSlots.includes(slot);
                      const isSelected = selectedTimeSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            isAvailable && setSelectedTimeSlot(slot);
                          }}
                          disabled={!isAvailable}
                          className={`py-3 px-3 rounded-xl text-xs font-bold transition-all duration-200 transform ${
                            isSelected
                              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white ring-2 ring-red-400 ring-offset-1 shadow-lg hover:scale-105'
                              : isAvailable
                              ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 hover:scale-105'
                              : 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {slot}
                          {!isAvailable && <div className="text-xs">❌</div>}
                        </button>
                      );
                    });
                  })()}
                </div>
              )}
              {!selectedDate && <p className="text-xs text-gray-500 font-semibold mt-2">Select a date first</p>}
              {selectedDate && !loadingSlots && (() => {
                const filteredSlots = getFilteredSlots();
                const hasSelectableSlots = filteredSlots.some((slot) => availableSlots.includes(slot));
                const isToday = selectedDate === getTodayDateString();

                if (filteredSlots.length === 0) {
                  return (
                    <p className="text-xs text-orange-500 font-semibold mt-2">
                      {isToday ? '⏰ No remaining slots today' : '⚠️ No available slots for this date'}
                    </p>
                  );
                }

                if (!hasSelectableSlots) {
                  return (
                    <p className="text-xs text-orange-500 font-semibold mt-2">⚠️ All remaining slots are booked</p>
                  );
                }

                if (!selectedTimeSlot) {
                  return (
                    <p className="text-xs text-red-500 font-semibold mt-2">📌 Please select a time slot</p>
                  );
                }

                return null;
              })()}
            </div>

            {/* Goals & Requirements */}
            <div style={{animation: `slideInUp 0.6s ease-out ${getAnimationDelay(5)} forwards`}} className="opacity-0">
              <label htmlFor="goals_message" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">💪 Goals & Requirements</label>
              <textarea id="goals_message" name="goals_message" rows="3" className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-200 bg-white resize-none hover:border-gray-300" placeholder="Tell us about your fitness goals..."></textarea>
            </div>
          </fieldset>

          <div style={{animation: `slideInUp 0.6s ease-out ${getAnimationDelay(6)} forwards`}} className="opacity-0 flex gap-3 pt-4">
            <button type="button" onClick={handleCloseModal} disabled={loading || successMessage} className="flex-1 px-4 py-3.5 text-sm font-bold border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 hover:scale-105 transform">Cancel</button>
            <button type="submit" disabled={loading || successMessage || !selectedTimeSlot || !selectedDate} className={`flex-1 px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105 active:scale-95 ${
              successMessage
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl'
                : 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white hover:from-red-700 hover:via-red-600 hover:to-red-700 hover:shadow-xl disabled:opacity-50'
            }`}>
              {successMessage ? '✅ Booking Confirmed!' : loading ? '⏳ Submitting...' : '🎯 Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrainerBookingModal;
