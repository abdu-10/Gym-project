import React, { useEffect, useRef, useState } from 'react';

function TrainerBookingModal({ isOpen, onClose, trainer }) {
  if (!isOpen || !trainer) return null;

  // State for animation control
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef(null);

  // Handle mounting/unmounting for fade-in/out effect
  useEffect(() => {
    if (isOpen) {
      // Start animation right after mount
      requestAnimationFrame(() => setIsAnimating(true));
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          // Trigger smooth close
          setIsAnimating(false);
          setTimeout(onClose, 300);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking request submitted for:", trainer.name);
    
    console.log('--- Submission Data ---');
    new FormData(e.target).forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });
    
    // Smooth close after successful submission simulation
    setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); 
    }, 500);
  };

  // Determine the final scale based on the animation state
  const scaleClass = isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0';

  return (
    // Elite Overlay: Backdrop Blur and Darkened Background
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 backdrop-blur-sm bg-gray-900/80 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
      onClick={() => { setIsAnimating(false); setTimeout(onClose, 300); }} // Trigger smooth close on outside click
    >
      {/* Modal Container: Responsive height (max-h) and internal scroll (overflow-y-auto) */}
      <div 
        ref={modalRef}
        className={`bg-white rounded-xl shadow-2xl w-full max-w-lg p-7 relative transform transition-all duration-300 ease-out border border-red-50 max-h-[90vh] overflow-y-auto ${scaleClass}`}
        onClick={e => e.stopPropagation()} // Prevents closing when clicking inside the modal
      >
        
        {/* Close button: Sleek and subtle */}
        <button
          onClick={() => { setIsAnimating(false); setTimeout(onClose, 300); }}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50"
          aria-label="Close booking modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header content: Trainer profile focus */}
        <div className="text-center mb-6 pt-2">
          <img
            src={trainer.image}
            alt={trainer.name}
            // Sharp ring effect
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-red-600 ring-offset-2"
          />
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Book Session with {trainer.name}
          </h3>
          <p className="text-red-600 font-bold text-sm uppercase mt-0.5">{trainer.role}</p>
        </div>

        {/* Booking form: Sleek inputs, tight spacing */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Your Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              // Refined Input Styling: py-2.5, less aggressive border
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 transition duration-150 text-sm"
              placeholder="Full Name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 transition duration-150 text-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Phone and Date (side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 transition duration-150 text-sm"
                placeholder="(555) 555-5555"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Preferred Date
              </label>
              <input
                id="date"
                type="date"
                name="date"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 transition duration-150 text-sm"
                required
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
              Goals & Requirements
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 transition duration-150 text-sm"
              rows="3"
              placeholder="Tell us about your fitness goals..."
            ></textarea>
          </div>

          {/* Buttons: Sleeker, faster hover effect */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { setIsAnimating(false); setTimeout(onClose, 300); }}
              // Secondary Button: Ghost effect with border
              className="flex-1 px-4 py-3 text-sm font-bold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition duration-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              // Primary Button: Reduced vertical padding (py-3), bold shadow, aggressive hover
              className="flex-1 px-4 py-3 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 shadow-lg shadow-red-500/50 hover:shadow-red-500/70"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrainerBookingModal;