import React, { useState, useEffect, useCallback } from 'react';
import { FaClock, FaCalendarAlt, FaUserTie, FaCheckCircle, FaExclamationCircle, FaTimes, FaInfoCircle } from 'react-icons/fa'; 

// --- 1. ELITE TOAST NOTIFICATION COMPONENT ---

const EliteToast = ({ message, type, onClose }) => {
    let colorClasses = '';
    let Icon = FaCheckCircle; 

    switch (type) {
        case 'success':
            colorClasses = 'bg-green-600';
            Icon = FaCheckCircle;
            break;
        case 'error':
            colorClasses = 'bg-red-600';
            Icon = FaExclamationCircle;
            break;
        case 'info':
        default:
            colorClasses = 'bg-blue-600';
            Icon = FaInfoCircle;
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

// --- 2. SESSION BOOKING MODAL ---

const SessionBookingModal = ({ isOpen, classData, onClose, user, onBook, showToast }) => {
    if (!isOpen || !classData) return null;

    const sessions = classData.sessions || [];

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl animate-[fadeIn_0.3s_ease-out]">
                <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white">{classData.name}</h2>
                        <p className="text-red-100 text-sm mt-1">{sessions.length} sessions available</p>
                    </div>
                    <button onClick={onClose} className="text-red-100 hover:text-white hover:bg-red-800 p-2 rounded-lg transition">
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto" style={{maxHeight: 'calc(80vh - 100px)'}}>
                    <p className="text-gray-700 mb-6 font-medium">Select a session to book:</p>
                    
                    {sessions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No sessions available</p>
                    ) : (
                        <div className="space-y-3">
                            {sessions.map((session) => {
                                const isBooked = session.user_booking_id !== null && session.user_booking_id !== undefined;
                                const isFull = session.is_full;

                                return (
                                    <div key={session.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-red-400 hover:shadow-md transition-all cursor-pointer">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-grow">
                                                <p className="font-bold text-gray-900 text-lg">{session.formatted_date}</p>
                                                <p className="text-sm text-gray-600 mt-2 flex items-center">
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                    {session.spots_remaining}/{session.capacity} spots available
                                                </p>
                                            </div>
                                            
                                            <button
                                                onClick={() => onBook(session)}
                                                disabled={isFull && !isBooked}
                                                className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ml-3 ${
                                                    isBooked
                                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                                                        : isFull
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-green-600/50'
                                                }`}
                                            >
                                                {isBooked ? 'Cancel Booking' : isFull ? 'Full' : 'Book'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 3. MAIN CLASSES COMPONENT ---

function Classes({ user, onLoginClick }) {
    const classCategories = [
        "All", "Cardio", "Strength", "Flexibility", "Mind & Body",
    ];

    const [activeCategory, setActiveCategory] = useState("All");
    const [classList, setClassList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [sessionModal, setSessionModal] = useState({ isOpen: false, classData: null });
    const [bookingInProgress, setBookingInProgress] = useState(false);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast({ message: null, type: 'info' });
        }, duration);
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:3000/classes', { credentials: 'include' })
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch classes.');
                return r.json();
            })
            .then(data => {
                setClassList(data);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setError("Could not load classes. Please try again.");
                showToast("Failed to load classes. Please check the API server.", 'error', 5000);
            })
            .finally(() => setLoading(false));
    }, [user, showToast]);

    const filteredClasses = activeCategory === "All"
        ? classList
        : classList.filter((cls) => cls.category === activeCategory);

    const openSessionModal = (classData) => {
        if (!user) {
            showToast("You must be logged in to book a class.", 'info');
            onLoginClick();
            return;
        }
        setSessionModal({ isOpen: true, classData });
    };

    const closeSessionModal = () => {
        setSessionModal({ isOpen: false, classData: null });
    };

    const handleSessionBooking = (session) => {
        const isBooked = session.user_booking_id !== null && session.user_booking_id !== undefined;
        const method = isBooked ? 'DELETE' : 'POST';
        const endpoint = isBooked ? `/bookings/${session.user_booking_id}` : '/bookings';
        const requestBody = !isBooked ? JSON.stringify({ class_session_id: session.id }) : undefined;

        setBookingInProgress(true);

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
                    if (cls.sessions) {
                        return {
                            ...cls,
                            sessions: cls.sessions.map(sess => {
                                if (sess.id === session.id) {
                                    return {
                                        ...sess,
                                        booked_count: data.booked_count || sess.booked_count,
                                        spots_remaining: data.spots_remaining || sess.spots_remaining,
                                        is_full: (data.is_full !== undefined) ? data.is_full : sess.is_full,
                                        user_booking_id: !isBooked ? data.booking.id : null
                                    };
                                }
                                return sess;
                            })
                        };
                    }
                    return cls;
                }));

                const successMessage = data.message || (isBooked ? "Booking cancelled successfully." : "Session booked successfully!");
                const toastType = isBooked ? 'info' : 'success';
                showToast(successMessage, toastType);
                closeSessionModal();
            })
            .catch(err => {
                console.error("Booking failed:", err);
                if (err !== 'Unauthorized') {
                    showToast("An unexpected error occurred during the transaction.", 'error', 4000);
                }
            })
            .finally(() => setBookingInProgress(false));
    };

    if (loading) return <div className="text-center py-20">Loading classes...</div>;
    if (error) return <div className="text-center py-20 text-red-600 font-semibold">{error}</div>;

    return (
        <div id='classes' className='py-20 bg-white'>
            <EliteToast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast({ message: null, type: 'info' })} 
            />

            <SessionBookingModal 
                isOpen={sessionModal.isOpen}
                classData={sessionModal.classData}
                onClose={closeSessionModal}
                user={user}
                onBook={handleSessionBooking}
                showToast={showToast}
            />

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>Our Classes</h2>
                    <p className='max-w-2xl mx-auto text-gray-600 text-lg'>
                        From high-intensity workouts to mindful moments, we offer a wide range of classes for all fitness levels
                    </p>
                </div>

                <div className='flex flex-wrap justify-center gap-4 mb-12'>
                    {classCategories.map((category, index) => (
                        <button key={index}
                            className={`px-6 py-2 rounded-full transition duration-300 ${activeCategory === category ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            onClick={() => setActiveCategory(category)}>
                            {category}
                        </button>
                    ))}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {filteredClasses.map((cls) => {
                        const sessions = cls.sessions || [];
                        const hasAvailableSessions = sessions.some(s => !s.is_full);
                        const bookedSessions = sessions.filter(s => s.user_booking_id).length;

                        return (
                            <div key={cls.id} className='bg-gray-50 rounded-lg overflow-hidden shadow-lg flex flex-col h-full'>
                                
                                <div className='h-56 overflow-hidden'>
                                    <img
                                        src={cls.image_url || cls.image}
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
                                        <p className='flex items-center'><FaCalendarAlt className='h-3 w-3 mr-2 text-red-500'/> 
                                            {sessions.length > 0 
                                                ? sessions.map(s => `${s.formatted_day} ${s.formatted_time}`).join(', ')
                                                : 'No schedule'}
                                        </p>
                                    </div>
                                    
                    <div className='pt-3 border-t border-gray-100 mt-auto'>
                                        {user ? (
                                            <button 
                                                onClick={() => openSessionModal(cls)}
                                                disabled={bookingInProgress || sessions.length === 0}
                                                className={`w-full text-center py-2 rounded-md font-medium transition duration-300 ${
                                                    sessions.length === 0
                                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                            >
                                                {sessions.length === 0 ? 'No Sessions' : 'Book Now'}
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