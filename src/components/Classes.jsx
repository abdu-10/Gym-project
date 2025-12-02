import React, { useState, useEffect, useCallback } from 'react';
import { FaClock, FaCalendarAlt, FaUserTie, FaCheckCircle, FaExclamationCircle, FaTimes, FaInfoCircle } from 'react-icons/fa'; 

// --- 1. ELITE TOAST NOTIFICATION COMPONENT ---

const EliteToast = ({ message, type, onClose }) => {
    // Determine styles based on notification type
    let colorClasses = '';
    let Icon = FaCheckCircle; 

    switch (type) {
        case 'success': // Used for Booking Success
            colorClasses = 'bg-green-600';
            Icon = FaCheckCircle;
            break;
        case 'error': // Used for API/Validation Errors (Class Full, Not Found)
            colorClasses = 'bg-red-600';
            Icon = FaExclamationCircle;
            break;
        case 'info': // Used for Neutral Messages (Login Required, Cancellation Success)
        default:
            colorClasses = 'bg-blue-600';
            Icon = FaInfoCircle; // Switched to FaInfoCircle for 'info'
            break;
    }

    if (!message) return null;

    return (
        <div className="fixed top-5 right-5 z-50">
            <div className={`flex items-center p-4 text-white rounded-lg shadow-2xl transition-all duration-500 ease-in-out transform scale-100 ${colorClasses}`}
                 style={{ minWidth: '300px', maxWidth: '400px' }}>
                
                <Icon className="w-6 h-6 mr-3 flex-shrink-0" />
                
                <div className="flex-grow font-medium">
                    {message}
                </div>
                
                <button 
                    onClick={onClose}
                    className="ml-4 -mr-1 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition duration-150"
                >
                    <FaTimes className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// --- 2. MAIN CLASSES COMPONENT ---

function Classes({ user, onLoginClick }) {
    const classCategories = [
        "All", "Cardio", "Strength", "Flexibility", "Mind & Body",
    ];

    const [activeCategory, setActiveCategory] = useState("All");
    const [classList, setClassList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ message: null, type: 'info' });

    // Function to show the elite toast notification
    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        setToast({ message, type });
        // Auto-dismiss after 'duration' milliseconds
        setTimeout(() => {
            setToast({ message: null, type: 'info' });
        }, duration);
    }, []);

    // --- FETCH DATA useEffect ---
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:3000/classes', { credentials: 'include' })
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch classes.');
                return r.json();
            })
            .then(data => {
                const processedData = data.map(cls => {
                    const isBooked = user ? user.booked_class_ids.includes(cls.id) : false;
                    
                    return {
                        ...cls,
                        image: cls.image_url, 
                        user_booked: isBooked,
                        // This placeholder ID (cls.id) is used on initial load/refresh.
                        user_booking_id: isBooked ? cls.booking_id : null 
                    };
                });
                setClassList(processedData);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setError("Could not load classes. Please try again.");
                showToast("Failed to load classes. Please check the API server.", 'error', 5000);
            })
            .finally(() => setLoading(false));
    }, [user, showToast]);

    // --- FILTERING LOGIC ---
    const filteredClasses = activeCategory === "All"
        ? classList
        : classList.filter((cls) => cls.category === activeCategory);


    // --- HANDLE BOOKING LOGIC (API Call) ---
    const handleBooking = (classId, isBooking, bookingId) => {
        if (!user) {
            showToast("You must be logged in to book a class.", 'info');
            onLoginClick();
            return;
        }

        const method = isBooking ? 'POST' : 'DELETE';
        
        // CRITICAL: Use the unique bookingId for DELETE requests, not the classId.
        const endpoint = isBooking ? '/bookings' : `/bookings/${bookingId}`; 

        const requestBody = isBooking ? JSON.stringify({ class_booking_id: classId }) : undefined;

        fetch(`http://localhost:3000${endpoint}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
            credentials: 'include'
        })
        .then(r => {
            if (r.status === 401) { 
                 showToast("Session expired. Please log in again.", 'error');
                 return Promise.reject('Unauthorized');
            }
            if (!r.ok) {
                return r.json().then(err => {
                    const message = err.error || (err.errors && err.errors.join(', ')) || 'Failed to process booking.';
                    showToast(`Booking Error: ${message}`, 'error', 5000);
                    return Promise.reject(message);
                });
            }
            return r.json();
        })
        .then(data => {
            setClassList(prevClasses => prevClasses.map(cls => {
                if (cls.id === classId) {
                    let newBookingId = null;

                    if (isBooking && data.booking && data.booking.id) {
                        newBookingId = data.booking.id;
                    }
                    
                    return { 
                        ...cls, 
                        booked_count: data.booked_count,
                        spots_remaining: data.spots_remaining,
                        user_booked: isBooking,
                        user_booking_id: newBookingId 
                    };
                }
                return cls;
            }));
            
            const successMessage = data.message || (isBooking ? "Class booked successfully!" : "Booking cancelled successfully.");
            
            // --- UPDATED LOGIC HERE ---
            const toastType = isBooking ? 'success' : 'info'; // Success (green) for booking, Info (blue) for cancellation
            showToast(successMessage, toastType);
            // --------------------------
            
        })
        .catch(err => {
            console.error("Booking failed:", err);
            if (err !== 'Unauthorized') {
                 showToast("An unexpected error occurred during the transaction.", 'error', 4000);
            }
        });
    };

    // --- RENDER LOGIC ---

    if (loading) return <div className="text-center py-20">Loading classes...</div>;
    if (error) return <div className="text-center py-20 text-red-600 font-semibold">{error}</div>;


    return (
        <div id='classes' className='py-20 bg-white'>
            {/* RENDER THE ELITE TOAST COMPONENT */}
            <EliteToast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ message: null, type: 'info' })} 
            />
            {/* END RENDER THE ELITE TOAST COMPONENT */}

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Our Classes</h2>
                    <p className='max-w-2xl mx-auto text-gray-600 text-lg'>
                        From high-intensity workouts to mindful moments, we offer a wide range of classes for all fitness levels
                    </p>
                </div>

                {/* Category Filter Buttons */}
                <div className='flex flex-wrap justify-center gap-4 mb-12'>
                    {classCategories.map((category, index) => (
                        <button key={index}
                            className={`px-6 py-2 rounded-full transition duration-300 ${activeCategory === category ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            onClick={() => setActiveCategory(category)}>
                            {category}
                        </button>
                    ))}
                </div>

                {/* Class Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {filteredClasses.map((cls) => {
                        const isFull = cls.spots_remaining <= 0;
                        const isBooked = cls.user_booked; 

                        return (
                            <div key={cls.id} className='bg-gray-50 rounded-lg overflow-hidden shadow-lg flex flex-col h-full'>
                                
                                <div className='h-56 overflow-hidden'>
                                    <img
                                        src={cls.image}
                                        alt={cls.name}
                                        className='w-full h-full object-cover transition duration-500 hover:scale-110'
                                    />
                                </div>

                                <div className='p-6 flex flex-col flex-grow'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <span className='text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full'>{cls.category}</span>
                                        <span className='text-sm text-gray-600'>Capacity: {cls.capacity}</span>
                                    </div>

                                    <h3 className='text-xl font-semibold mb-2 text-gray-800'>{cls.name}</h3>
                                    
                                    <div className='space-y-1 mb-4 text-sm text-gray-600 flex-grow'>
                                        <p className='flex items-center'><FaUserTie className='h-3 w-3 mr-2 text-red-500'/> Instructor: {cls.instructor}</p>
                                        <p className='flex items-center'><FaClock className='h-3 w-3 mr-2 text-red-500'/> Duration: {cls.duration}</p>
                                        <p className='flex items-center'><FaCalendarAlt className='h-3 w-3 mr-2 text-red-500'/> {cls.time}</p>
                                    </div>
                                    
                                    <div className='pt-3 border-t border-gray-100 mt-auto'>
                                        <p className={`text-sm font-medium mb-3 ${isFull ? 'text-red-500' : 'text-green-600'}`}>
                                            {isFull ? 'Class Full' : `Spots Remaining: ${cls.spots_remaining}`}
                                        </p>

                                        {user ? (
                                            <button 
                                                onClick={() => handleBooking(cls.id, !isBooked, cls.user_booking_id)}
                                                disabled={!isBooked && isFull}
                                                className={`w-full text-center py-2 rounded-md font-medium transition duration-300 ${
                                                    isBooked 
                                                        ? 'bg-red-600 text-white hover:bg-red-700' 
                                                        : isFull 
                                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                                            : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                            >
                                                {isBooked ? 'Cancel Booking' : 'Book Now'}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={onLoginClick}
                                                className='w-full text-center py-2 rounded-md font-medium transition duration-300 bg-red-600 text-white hover:bg-red-700'
                                            >
                                                Login to Book
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className='text-center mt-12'>
                    <a href='#' className='inline-block border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-md font-medium transition duration-300'>
                        View Full Schedule
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Classes;