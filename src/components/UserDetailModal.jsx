import React, { useState, useEffect } from 'react';

function UserDetailModal({ isOpen, user, onClose }) {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    setLoading(true);
    fetch(`http://localhost:3000/admin_api/users/${user.id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        console.log('Full User detail response:', JSON.stringify(data, null, 2));
        console.log('User object:', data?.user);
        console.log('User object keys:', data?.user ? Object.keys(data.user) : 'null');
        console.log('All image fields:', {
          profile_photo_url: data?.user?.profile_photo_url,
          profile_photo: data?.user?.profile_photo,
          image: data?.user?.image,
          image_url: data?.user?.image_url,
          avatar: data?.user?.avatar,
          photo: data?.user?.photo,
          profile_picture: data?.user?.profile_picture
        });
        setUserDetail(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching user detail:', err);
        setLoading(false);
      });
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const getPackageStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'exhausted': return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/20';
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/20';
    }
  };

  const getBookingStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '📅';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/30">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur border-b border-white/5 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {(userDetail?.user?.profile_photo || user?.profile_photo) ? (
              <img 
                src={`http://localhost:3000${userDetail?.user?.profile_photo || user?.profile_photo}`} 
                alt={userDetail?.user?.name || user.name}
                className="w-16 h-16 rounded-xl object-cover border border-white/10"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-2xl ${(userDetail?.user?.profile_photo || user?.profile_photo) ? 'hidden' : ''}`}>
              {(userDetail?.user?.name || user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{userDetail?.user?.name || user.name}</h2>
              <p className="text-sm text-zinc-400">{userDetail?.user?.email || user.email}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {userDetail?.user?.joined_at} • {userDetail?.user?.role || 'member'}
              </p>
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
            <div className="text-center py-12 text-zinc-400">Loading user details...</div>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Visits</p>
                  <p className="text-2xl font-bold text-white mt-2">
                    {userDetail?.stats?.total_attended_gym || userDetail?.gym_attendance?.total_visits || 0}
                  </p>
                </div>
                <div className="bg-black/40 border border-emerald-500/10 rounded-2xl p-4">
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Total Spent</p>
                  <p className="text-lg font-bold text-emerald-300 mt-2">
                    ${((userDetail?.spending_summary?.total_trainer_packages || 0) + 
                       (userDetail?.spending_summary?.total_gym_membership || 0)).toFixed(2)}
                  </p>
                </div>
                <div className="bg-black/40 border border-blue-500/10 rounded-2xl p-4">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Sessions Remaining</p>
                  <p className="text-2xl font-bold text-blue-300 mt-2">
                    {(() => {
                      const remaining = userDetail?.stats?.sessions_remaining ?? 
                        (Array.isArray(userDetail?.trainer_packages) ? 
                          userDetail.trainer_packages.reduce((sum, pkg) => sum + (pkg.sessions_remaining || 0), 0) : 0);
                      const purchased = userDetail?.stats?.sessions_purchased ?? 
                        (Array.isArray(userDetail?.trainer_packages) ? 
                          userDetail.trainer_packages.reduce((sum, pkg) => sum + (pkg.sessions_purchased || 0), 0) : 0);
                      return `${remaining}/${purchased}`;
                    })()}
                  </p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Membership</p>
                  <div className="mt-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      userDetail?.membership?.is_active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/20 text-red-400 border border-red-500/20'
                    }`}>
                      {userDetail?.membership?.is_active ? 'ACTIVE' : 'EXPIRED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Membership & Last Visit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userDetail?.membership && (
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-4">
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-3">💳 Gym Membership</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-zinc-500 text-xs">Plan</p>
                        <p className="text-white font-bold">{userDetail.membership.plan_name}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-zinc-500 text-xs">Price</p>
                          <p className="text-white font-bold">{userDetail.membership.plan_price}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs">Expires</p>
                          <p className="text-white font-bold">{userDetail.membership.expires_at}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs">Days Left</p>
                          <p className={`font-bold ${
                            userDetail.membership.days_remaining > 30 
                              ? 'text-emerald-400' 
                              : userDetail.membership.days_remaining > 0 
                              ? 'text-yellow-400' 
                              : 'text-red-400'
                          }`}>
                            {userDetail.membership.days_remaining > 0 
                              ? `${userDetail.membership.days_remaining}d`
                              : 'Expired'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {userDetail?.last_gym_visit && (
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-4">
                    <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-3">🏃 Last Gym Visit</p>
                    <div className="space-y-2">
                      <p className="text-white font-bold text-lg">{userDetail.last_gym_visit.date}</p>
                      <p className="text-zinc-400 text-sm">{userDetail.last_gym_visit.days_ago}</p>
                      {userDetail.last_gym_visit.time && (
                        <p className="text-zinc-500 text-xs">⏰ {userDetail.last_gym_visit.time}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics Grid */}
              {userDetail?.stats && (
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-4">📊 Statistics</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{userDetail.stats.total_bookings}</p>
                      <p className="text-xs text-zinc-500 mt-1">Trainer Bookings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-400">{userDetail.stats.completed_bookings}</p>
                      <p className="text-xs text-zinc-500 mt-1">Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">{userDetail.stats.confirmed_bookings}</p>
                      <p className="text-xs text-zinc-500 mt-1">Confirmed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">{userDetail.stats.disputed_bookings}</p>
                      <p className="text-xs text-zinc-500 mt-1">Disputed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{userDetail.stats.classes_attended}</p>
                      <p className="text-xs text-zinc-500 mt-1">Classes</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Trainer Packages */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🏋️ Trainer Packages</span>
                  <span className="text-sm font-normal text-zinc-500">({userDetail?.trainer_packages?.length || 0})</span>
                </h3>
                
                {!userDetail?.trainer_packages || !Array.isArray(userDetail.trainer_packages) || userDetail.trainer_packages.length === 0 ? (
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center text-zinc-500">
                    No trainer packages
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userDetail.trainer_packages.map((pkg) => (
                      <div key={pkg.id} className="bg-black/40 border border-white/5 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {pkg.trainer_image ? (
                              <img 
                                src={pkg.trainer_image} 
                                alt={pkg.trainer_name}
                                className="w-10 h-10 rounded-lg object-cover border border-white/10"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                                {(pkg.trainer_name || 'T').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-bold text-white">{pkg.trainer_name}</p>
                              <p className="text-xs text-zinc-500">{pkg.package_name || pkg.package_type || `${pkg.sessions_purchased} Sessions`}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getPackageStatusColor(pkg.status)}`}>
                            {pkg.status?.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <p className="text-zinc-500">Sessions</p>
                            <p className="text-white font-bold">{pkg.sessions_remaining}/{pkg.sessions_purchased}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500">Cost</p>
                            <p className="text-white font-bold">${(pkg.total_cost || pkg.cost || 0).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500">Expires</p>
                            <p className="text-white font-bold">{pkg.expires_at || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trainer Bookings */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>📅 Trainer Bookings</span>
                  <span className="text-sm font-normal text-zinc-500">({userDetail?.bookings?.length || 0})</span>
                </h3>
                
                {!userDetail?.bookings || !Array.isArray(userDetail.bookings) || userDetail.bookings.length === 0 ? (
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center text-zinc-500">
                    No trainer bookings
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {userDetail.bookings.slice(0, 20).map((booking) => (
                      <div key={booking.id} className="bg-black/40 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">{booking.trainer_name}</p>
                          <p className="text-xs text-zinc-500">📅 {booking.date} • ⏰ {booking.time}</p>
                          {booking.goals && <p className="text-xs text-zinc-400 mt-1">💪 {booking.goals}</p>}
                        </div>
                        <span className="text-sm">{getBookingStatusIcon(booking.status)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Class Bookings */}
              {userDetail?.class_bookings && Array.isArray(userDetail.class_bookings) && userDetail.class_bookings.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>🎯 Class Bookings</span>
                    <span className="text-sm font-normal text-zinc-500">({userDetail.class_bookings.length})</span>
                  </h3>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {userDetail.class_bookings.slice(0, 20).map((cls, idx) => (
                      <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">{cls.class_name}</p>
                          <p className="text-xs text-zinc-500">{cls.category || 'Group Class'} • 📅 {cls.date}</p>
                        </div>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          {cls.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gym Attendance */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎟️ Gym Visits</span>
                  <span className="text-sm font-normal text-zinc-500">({userDetail?.gym_attendance?.recent_visits?.length || 0})</span>
                </h3>

                {!userDetail?.gym_attendance?.recent_visits || !Array.isArray(userDetail.gym_attendance.recent_visits) || userDetail.gym_attendance.recent_visits.length === 0 ? (
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center text-zinc-500">
                    No visit history
                  </div>
                ) : (
                  <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/5 bg-black/20">
                            <th className="text-left py-2 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                            <th className="text-left py-2 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Check-In</th>
                            <th className="text-left py-2 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Check-Out</th>
                            <th className="text-right py-2 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {userDetail.gym_attendance.recent_visits.slice(0, 20).map((visit, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-2 px-4 text-xs text-white font-medium">{visit.date}</td>
                              <td className="py-2 px-4 text-xs text-zinc-400">{visit.check_in_time}</td>
                              <td className="py-2 px-4 text-xs text-zinc-400">{visit.check_out_time || '—'}</td>
                              <td className="py-2 px-4 text-right text-xs text-emerald-400 font-bold">
                                {visit.duration_minutes || '—'} min
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>💳 Payment History</span>
                  <span className="text-sm font-normal text-zinc-500">({userDetail?.payment_history?.length || 0})</span>
                </h3>

                {!userDetail?.payment_history || !Array.isArray(userDetail.payment_history) || userDetail.payment_history.length === 0 ? (
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center text-zinc-500">
                    No payment history
                  </div>
                ) : (
                  <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/5 bg-black/20">
                            <th className="text-left py-2 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                            <th className="text-left py-2 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Method</th>
                            <th className="text-left py-2 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Transaction</th>
                            <th className="text-right py-2 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {userDetail.payment_history.slice(0, 30).map((payment, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-2 px-4 text-xs text-zinc-400">{payment.created_at}</td>
                              <td className="py-2 px-4">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  payment.payment_method === 'stripe' 
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {payment.payment_method === 'stripe' ? 'Stripe' : 'Card'}
                                </span>
                              </td>
                              <td className="py-2 px-4 text-xs text-white font-mono">{payment.transaction_id}</td>
                              <td className="py-2 px-4 text-right text-xs font-bold text-emerald-400">
                                ${parseFloat(payment.amount || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetailModal;
