import React, { useState, useEffect } from 'react';
import PackageDetailModal from './PackageDetailModal';
import BookingDetailModal from './BookingDetailModal';

function TrainerDetailModal({ isOpen, trainer, onClose }) {
  const [trainerDetail, setTrainerDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [profileImageError, setProfileImageError] = useState(false);

  useEffect(() => {
    if (!isOpen || !trainer) return;

    setProfileImageError(false);
    setLoading(true);
    fetch(`http://localhost:3000/admin/trainers/${trainer.trainer_id || trainer.id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setTrainerDetail(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching trainer detail:', err);
        setLoading(false);
      });
  }, [isOpen, trainer]);

  if (!isOpen || !trainer) return null;

  const trainerProfile = trainerDetail?.trainer || trainerDetail?.profile || trainerDetail || {};
  const trainerName = trainerProfile?.trainer_name || trainerProfile?.name || trainer?.trainer_name || trainer?.name || 'Trainer';
  const trainerEmail = trainerProfile?.email || trainerProfile?.trainer_email || trainer?.email || trainer?.trainer_email || 'No email';
  const trainerPhone = trainerProfile?.phone || trainerProfile?.phone_number || trainerProfile?.mobile || trainer?.phone || trainer?.phone_number || 'No phone';
  const trainerSpecialty = trainerProfile?.specialty || trainerProfile?.category || trainer?.specialty || 'General Training';
  const trainerBio = trainerProfile?.bio || trainerProfile?.description || trainerProfile?.about || null;
  const trainerStatus = trainerProfile?.status || (trainerProfile?.active === false ? 'inactive' : 'active');
  const profilePhoto =
    trainerProfile?.profile_photo ||
    trainerProfile?.profile_photo_url ||
    trainerProfile?.image ||
    trainerProfile?.image_url ||
    trainerProfile?.avatar ||
    trainerProfile?.photo ||
    trainerProfile?.profile_picture ||
    trainerProfile?.trainer_image ||
    trainerProfile?.user?.profile_photo ||
    trainerProfile?.user?.profile_photo_url ||
    trainer?.profile_photo ||
    trainer?.profile_photo_url ||
    trainer?.image ||
    trainer?.image_url ||
    trainer?.avatar ||
    trainer?.photo ||
    trainer?.profile_picture ||
    trainer?.trainer_image ||
    trainer?.user?.profile_photo ||
    trainer?.user?.profile_photo_url ||
    null;

  const normalizeImageUrl = (path) => {
    if (!path || typeof path !== 'string') return null;
    if (
      path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('blob:') ||
      path.startsWith('data:')
    ) return path;
    return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const profilePhotoUrl = typeof profilePhoto === 'string'
    ? normalizeImageUrl(profilePhoto)
    : null;

  const normalizedPhone = typeof trainerPhone === 'string'
    ? trainerPhone.split('').filter((ch) => ((ch >= '0' && ch <= '9') || ch === '+')).join('')
    : '';
  const whatsappPhone = typeof trainerPhone === 'string'
    ? trainerPhone.split('').filter((ch) => (ch >= '0' && ch <= '9')).join('')
    : '';
  const hasEmail = trainerEmail && trainerEmail !== 'No email';
  const hasPhone = trainerPhone && trainerPhone !== 'No phone';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/30">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur border-b border-white/5 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {profilePhotoUrl && !profileImageError ? (
              <img
                src={profilePhotoUrl}
                alt={trainerName}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
                onError={() => setProfileImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-lg">
                {(trainerName || 'T').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-black text-white">{trainerName}</h2>
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
              {/* Full Profile */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Trainer Profile</h3>
                    <p className="text-xs text-zinc-500 mt-1">Complete contact and profile details</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${String(trainerStatus).toLowerCase() === 'active' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30'}`}>
                    {String(trainerStatus).toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 bg-zinc-950/60 border border-white/5 rounded-xl p-4 flex items-center gap-4">
                    {profilePhotoUrl && !profileImageError ? (
                      <img
                        src={profilePhotoUrl}
                        alt={trainerName}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10"
                        onError={() => setProfileImageError(true)}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-2xl">
                        {(trainerName || 'T').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{trainerName}</p>
                      <p className="text-xs text-zinc-500 mt-1">{trainerSpecialty}</p>
                    </div>
                  </div>

                  <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Email</p>
                    <p className="text-sm text-zinc-200 mt-1 break-all">{trainerEmail}</p>
                  </div>
                  <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Phone</p>
                    <p className="text-sm text-zinc-200 mt-1">{trainerPhone}</p>
                  </div>
                  <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3 md:col-span-2">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Specialty</p>
                    <p className="text-sm text-zinc-200 mt-1">{trainerSpecialty}</p>
                  </div>
                  <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3 md:col-span-2">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Quick Actions</p>
                    <div className="flex flex-wrap gap-2">
                      {hasEmail && (
                        <a
                          href={`mailto:${trainerEmail}`}
                          className="px-3 py-1.5 text-[10px] font-bold rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20"
                        >
                          Email
                        </a>
                      )}
                      {hasPhone && (
                        <a
                          href={`tel:${normalizedPhone}`}
                          className="px-3 py-1.5 text-[10px] font-bold rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20"
                        >
                          Call
                        </a>
                      )}
                      {hasPhone && whatsappPhone && (
                        <a
                          href={`https://wa.me/${whatsappPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 text-[10px] font-bold rounded bg-green-500/10 border border-green-500/20 text-green-300 hover:bg-green-500/20"
                        >
                          WhatsApp
                        </a>
                      )}
                      {!hasEmail && !hasPhone && (
                        <span className="text-[10px] text-zinc-500">No contact methods available</span>
                      )}
                    </div>
                  </div>
                  {trainerBio && (
                    <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3 md:col-span-2">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Bio</p>
                      <p className="text-sm text-zinc-300 mt-1 leading-relaxed">{trainerBio}</p>
                    </div>
                  )}
                </div>
              </div>

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
