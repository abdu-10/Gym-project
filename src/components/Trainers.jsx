import React, { useState, useEffect, useCallback } from "react";
import TrainerBookingModal from "./TrainerBookingModal";
import PaymentModal from "./PaymentModal";
import Toast from "./Toast";
import { FaShoppingCart } from 'react-icons/fa';

function Trainers({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trainerAvailability, setTrainerAvailability] = useState({});
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [selectedTrainerForPackage, setSelectedTrainerForPackage] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [toast, setToast] = useState(null);

    // Fetch trainers
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const response = await fetch('http://localhost:3000/trainers');
                if (!response.ok) {
                    throw new Error('Failed to fetch trainers');
                }
                const data = await response.json();
                setTrainers(data);
            } catch (err) {
                console.error('Error fetching trainers:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainers();
    }, []);

    // Fetch availability for each trainer when user logs in
    const fetchAvailability = useCallback(async () => {
        if (!user || trainers.length === 0) return;

        const availabilityData = {};

        for (const trainer of trainers) {
            try {
                const response = await fetch(
                    `http://localhost:3000/trainers/${trainer.trainer_id}/available_for/${user.id}`,
                    { credentials: 'include' }
                );
                if (response.ok) {
                    const data = await response.json();
                    availabilityData[trainer.trainer_id] = data;
                }
            } catch (err) {
                console.error(`Error checking availability for trainer ${trainer.trainer_id}:`, err);
            }
        }

        setTrainerAvailability(availabilityData);
    }, [user, trainers]);

    useEffect(() => {
        if (!user || trainers.length === 0) return;
        fetchAvailability();
    }, [user, trainers, fetchAvailability]);

    // Get badge info for trainer
    const getBadgeInfo = (trainerId) => {
        const availability = trainerAvailability[trainerId];
        if (!availability) return null;

        if (availability.reason === 'first_free_session') {
            return { text: '🎉 FREE SESSION', color: 'bg-green-500', textColor: 'text-white' };
        } else if (availability.reason === 'has_package') {
            return { 
                text: `${availability.sessions_remaining}/${availability.sessions_purchased} LEFT`, 
                color: 'bg-blue-500', 
                textColor: 'text-white' 
            };
        } else if (availability.reason === 'no_sessions') {
            return { text: '🔒 NO SESSIONS', color: 'bg-gray-500', textColor: 'text-white' };
        } else if (availability.reason === 'package_expired') {
            return { text: '⏰ EXPIRED', color: 'bg-orange-500', textColor: 'text-white' };
        }
        return null;
    };

    const handleTrainerClick = (trainer) => {
        if (!user) {
            alert('Please log in to book a training session');
            return;
        }

        const availability = trainerAvailability[trainer.trainer_id];
        
        // If can't book, show package modal
        if (availability && !availability.can_book) {
            setSelectedTrainerForPackage(trainer);
            setIsPackageModalOpen(true);
        } else {
            // Can book - show booking modal
            setSelectedTrainer(trainer);
            setIsModalOpen(true);
        }
    };

    const handlePackageSelect = (sessions, price) => {
        setSelectedPackage({ sessions, price });
        setIsPackageModalOpen(false);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async () => {
        // Refresh availability for this trainer
        if (selectedTrainerForPackage && user) {
            try {
                const response = await fetch(
                    `http://localhost:3000/trainers/${selectedTrainerForPackage.trainer_id}/available_for/${user.id}`,
                    { credentials: 'include' }
                );
                if (response.ok) {
                    const data = await response.json();
                    setTrainerAvailability(prev => ({
                        ...prev,
                        [selectedTrainerForPackage.trainer_id]: data
                    }));
                }
            } catch (err) {
                console.error('Error refreshing availability:', err);
            }
        }
        
        // Show success message and open booking modal
        setToast({ 
            message: `🎉 Package purchased! You can now book sessions with ${selectedTrainerForPackage?.name}`, 
            type: 'success' 
        });
        setIsPaymentModalOpen(false);
        setSelectedPackage(null);
        setSelectedTrainer(selectedTrainerForPackage);
        setSelectedTrainerForPackage(null);
        setIsModalOpen(true);
    };
  return (
    <div id="trainers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Expert Trainers
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg ">
            {" "}
            Our certified professionals are here to help you achieve your
            fitness goals
          </p>
        </div>

        {loading && <div className="text-center py-12"><p className="text-gray-600">Loading trainers...</p></div>}
        {error && <div className="text-center py-12"><p className="text-red-600">Error: {error}</p></div>}
        
        {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* map method */}
          {trainers.map((trainer, index) => {
            const availability = trainerAvailability[trainer.trainer_id];
            const badge = user ? getBadgeInfo(trainer.trainer_id) : null;
            const canBook = !availability || availability.can_book;
            const isGreyedOut = user && !canBook;

            return (
                <div 
                  key={index} 
                  className={`bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative ${
                    isGreyedOut ? 'opacity-60 cursor-pointer' : ''
                  }`}
                  onClick={() => isGreyedOut && handleTrainerClick(trainer)}
                >
            {/* Badge Overlay */}
            {badge && (
              <div className={`absolute top-4 right-4 z-10 ${badge.color} ${badge.textColor} px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg`}>
                {badge.text}
              </div>
            )}

            <div className="h-72 overflow-hidden">
              <img
                src={trainer.image}
                alt={trainer.name}
                className={`w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110 ${
                  isGreyedOut ? 'filter grayscale' : ''
                }`}
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-1 text-gray-800">
                {trainer.name}
              </h3>
              <div className="text-red-600 font-medium mb-2">{trainer.role}</div>
              <p className="text-gray-600 mb-4">{trainer.bio}</p>
              <div className="flex justify-center space-x-4 mb-4">
                <a
                  href=""
                  className="text-gray-400 hover:text-red-600 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-instagram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </a>
                <a
                  href=""
                  className="text-gray-400 hover:text-red-600 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-facebook"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                  </svg>
                </a>

                <a
                  href=""
                  className="text-gray-400 hover:text-red-600 transition duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-twitter-x"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>
                </a>
              </div>
              <div className="text-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrainerClick(trainer);
                  }}
                  disabled={!user}
                  className={`${
                    !user
                      ? 'inline-block border-2 text-gray-400 border-gray-400 cursor-not-allowed opacity-50'
                      : isGreyedOut
                      ? 'inline-flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white cursor-pointer'
                      : 'inline-block border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer'
                  } px-6 py-3 rounded-md font-medium transition duration-300`}
                >
                  {!user 
                    ? 'Log in to Book' 
                    : isGreyedOut 
                    ? <><FaShoppingCart className="w-4 h-4" /> <span>Buy Package</span></>
                    : availability?.reason === 'first_free_session'
                    ? '🎉 Book FREE Session'
                    : 'Book Training Session'
                  }
                </button>
              </div>
            </div>
          </div>
              );
            })}
        </div>
        )}
      </div>

      {/* Booking Modal */}
      <TrainerBookingModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrainer(null);
          // Refresh availability when booking modal closes
          fetchAvailability();
        }}
        trainer={selectedTrainer}
        currentUser={user}
      />

      {/* Package Purchase Modal */}
      {isPackageModalOpen && selectedTrainerForPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/30">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl transform animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-block mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-red-500 shadow-lg mx-auto">
                  <img 
                    src={selectedTrainerForPackage.image} 
                    alt={selectedTrainerForPackage.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Continue Training with<br />
                <span className="text-red-600">{selectedTrainerForPackage.name}</span>
              </h2>
              <p className="text-gray-600">
                Choose a package to unlock more sessions 💪
              </p>
            </div>
            
            {/* Package Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* 6 Sessions */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4 hover:from-blue-100 hover:to-blue-200 hover:border-blue-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-black px-2 py-1 rounded-full">
                  STARTER
                </div>
                <div className="text-center pt-4">
                  <p className="text-4xl font-black text-blue-600 mb-1">6</p>
                  <p className="text-sm font-bold text-gray-700 mb-3">Sessions</p>
                  <div className="mb-3">
                    <p className="text-3xl font-black text-gray-900">$80</p>
                    <p className="text-xs text-gray-600 mt-1">$13.33 per session</p>
                  </div>
                  <button 
                    onClick={() => handlePackageSelect(6, 80)}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md"
                  >
                    Select
                  </button>
                </div>
              </div>

              {/* 9 Sessions - POPULAR */}
              <div className="group relative bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-500 rounded-xl p-4 hover:from-red-100 hover:to-red-200 hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <div className="bg-red-600 text-white text-xs font-black px-4 py-1 rounded-full shadow-lg">
                    ⭐ POPULAR
                  </div>
                </div>
                <div className="text-center pt-5">
                  <p className="text-4xl font-black text-red-600 mb-1">9</p>
                  <p className="text-sm font-bold text-gray-700 mb-3">Sessions</p>
                  <div className="mb-3">
                    <p className="text-3xl font-black text-gray-900">$120</p>
                    <p className="text-xs text-gray-600 mt-1">$13.33 per session</p>
                  </div>
                  <button 
                    onClick={() => handlePackageSelect(9, 120)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg"
                  >
                    Select
                  </button>
                </div>
              </div>

              {/* 12 Sessions - BEST VALUE */}
              <div className="group relative bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4 hover:from-green-100 hover:to-green-200 hover:border-green-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-black px-2 py-1 rounded-full">
                  BEST VALUE
                </div>
                <div className="text-center pt-4">
                  <p className="text-4xl font-black text-green-600 mb-1">12</p>
                  <p className="text-sm font-bold text-gray-700 mb-3">Sessions</p>
                  <div className="mb-3">
                    <p className="text-3xl font-black text-gray-900">$180</p>
                    <p className="text-xs text-gray-600 mt-1">$15 per session</p>
                  </div>
                  <button 
                    onClick={() => handlePackageSelect(12, 180)}
                    className="w-full px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-all shadow-md"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setIsPackageModalOpen(false);
                setSelectedTrainerForPackage(null);
              }}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPackage(null);
          setSelectedTrainerForPackage(null);
        }}
        trainer={selectedTrainerForPackage}
        packageData={selectedPackage}
        userId={user?.id}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Trainers;
