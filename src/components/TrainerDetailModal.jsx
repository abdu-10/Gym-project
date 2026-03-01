import React, { useState, useEffect } from 'react';
import PackageDetailModal from './PackageDetailModal';
import BookingDetailModal from './BookingDetailModal';

function TrainerDetailModal({ isOpen, trainer, onClose }) {
  const [trainerDetail, setTrainerDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (!isOpen || !trainer) return;

    setLoading(true);
    fetch(`http://localhost:3000/admin/trainers/${trainer.trainer_id || trainer.id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log('Full trainer detail:', data);
        console.log('Active packages array:', data?.active_packages);
        if (data?.active_packages && data.active_packages.length > 0) {
          console.log('First package full object:', data.active_packages[0]);
          console.table(data.active_packages);
        }
        setTrainerDetail(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching trainer detail:', err);
        setLoading(false);
      });
  }, [isOpen, trainer]);

  if (!isOpen || !trainer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/30">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur border-b border-white/5 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-lg">
              {(trainer.trainer_name || trainer.name || 'T').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{trainer.trainer_name || trainer.name}</h2>
              <p className="text-sm text-zinc-400">ID: {trainer.trainer_id || trainer.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-zinc-400">Loading trainer details...</div>
          ) : (
            <>
              {/* Earnings Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Gross Revenue</p>
                  <p className="text-2xl font-semibold text-white mt-2">
                    ${(trainerDetail?.earnings_summary?.gross_revenue || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-black/40 border border-emerald-500/10 rounded-2xl p-4">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Trainer Earnings (60%)</p>
                  <p className="text-2xl font-semibold text-emerald-300 mt-2">
                    ${(trainerDetail?.earnings_summary?.trainer_earnings || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-black/40 border border-rose-500/10 rounded-2xl p-4">
                  <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Gym Earnings (40%)</p>
                  <p className="text-2xl font-semibold text-rose-300 mt-2">
                    ${(trainerDetail?.earnings_summary?.gym_earnings || 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Packages Sold</p>
                  <p className="text-2xl font-semibold text-white mt-2">
                    {trainerDetail?.earnings_summary?.packages_sold || 0}
                  </p>
                </div>
              </div>

              {/* Active Packages & Users */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>📦 Active Packages</span>
                  <span className="text-sm font-normal text-zinc-500">({trainerDetail?.active_packages?.length || 0})</span>
                </h3>
                
                {!trainerDetail?.active_packages || trainerDetail.active_packages.length === 0 ? (
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center text-zinc-500">
                    No active packages
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trainerDetail.active_packages.map((pkg) => (
                      <div 
                        key={pkg.id} 
                        onClick={() => setSelectedPackage(pkg)}
                        className="bg-black/40 border border-white/5 rounded-xl p-3 hover:border-white/20 hover:bg-black/50 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">📦</div>
                          <div>
                            <p className="text-sm font-bold text-white">{pkg.user_name}</p>
                            <p className="text-xs text-zinc-500">{pkg.sessions_purchased} Sessions • ${pkg.total_cost?.toFixed(2)}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          pkg.sessions_remaining > 0 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/20'
                        }`}>
                          {pkg.sessions_remaining}/{pkg.sessions_purchased}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Booked Sessions */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>📅 Booked Sessions</span>
                  <span className="text-sm font-normal text-zinc-500">({trainerDetail?.bookings?.length || 0})</span>
                </h3>

                {!trainerDetail?.bookings || trainerDetail.bookings.length === 0 ? (
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center text-zinc-500">
                    No bookings
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trainerDetail.bookings.map((booking) => {
                      const bookingDate = new Date(booking.preferred_date);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      return (
                        <div 
                          key={booking.id} 
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-black/40 border border-white/5 rounded-xl p-3 cursor-pointer transition-all hover:border-white/20 hover:bg-black/50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">👤</div>
                            <div>
                              <p className="text-sm font-bold text-white">{booking.user_name}</p>
                              <p className="text-xs text-zinc-500">📅 {bookingDate.toLocaleDateString()} • ⏰ {booking.preferred_time}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            booking.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                              : booking.status === 'confirmed'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/20'
                              : booking.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                              : 'bg-red-500/20 text-red-400 border-red-500/20'
                          }`}>
                            {booking.status === 'pending' ? '⏳' 
                              : booking.status === 'confirmed' ? '✅'
                              : booking.status === 'completed' ? '🎉'
                              : '❌'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Nested Modals */}
      <PackageDetailModal
        isOpen={!!selectedPackage}
        pkg={selectedPackage}
        trainer={trainer}
        onClose={() => setSelectedPackage(null)}
      />
      <BookingDetailModal
        isOpen={!!selectedBooking}
        booking={selectedBooking}
        trainer={trainer}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
}

export default TrainerDetailModal;
