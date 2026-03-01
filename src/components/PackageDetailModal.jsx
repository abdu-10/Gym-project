import React, { useState, useEffect } from 'react';

function PackageDetailModal({ isOpen, pkg, trainer, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !pkg) return;

    setLoading(true);
    fetch(`http://localhost:3000/trainer_packages/${pkg.id}/messages`, {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching messages:', err);
        setMessages([]);
        setLoading(false);
      });
  }, [isOpen, pkg]);

  if (!isOpen || !pkg) return null;

  const expiresDate = new Date(pkg.expires_at);
  const isExpired = expiresDate < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/30">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur border-b border-white/5 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">{pkg.user_name}</h2>
            <p className="text-sm text-zinc-400 mt-1">{pkg.user_email}</p>
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
          {/* Package Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Sessions</p>
              <p className="text-2xl font-bold text-emerald-400 mt-2">
                {pkg.sessions_remaining}/{pkg.sessions_purchased}
              </p>
              <p className="text-xs text-zinc-400 mt-1">remaining</p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Cost</p>
              <p className="text-2xl font-bold text-white mt-2">
                ${pkg.total_cost?.toFixed(2) || '0.00'}
              </p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Package Type</p>
              <p className="text-2xl font-bold text-white mt-2">{pkg.sessions_purchased} Sessions</p>
            </div>

            <div className={`border rounded-2xl p-4 ${
              isExpired
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-emerald-500/10 border-emerald-500/20'
            }`}>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Expires</p>
              <p className={`text-2xl font-bold mt-2 ${isExpired ? 'text-red-400' : 'text-emerald-400'}`}>
                {expiresDate.toLocaleDateString()}
              </p>
              {isExpired && <p className="text-xs text-red-400 mt-1">❌ Expired</p>}
            </div>
          </div>

          {/* Trainer Info */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">Trainer</p>
            <p className="text-white font-bold">{trainer?.trainer_name || trainer?.name}</p>
            <p className="text-xs text-zinc-500 mt-1">ID: {trainer?.trainer_id || trainer?.id}</p>
          </div>

          {/* Messages */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>💬 Messages</span>
              <span className="text-sm font-normal text-zinc-500">({messages.length})</span>
            </h3>

            {loading ? (
              <div className="text-center py-8 text-zinc-400">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 text-center text-zinc-500">
                No messages yet
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border ${
                      msg.sender_type === 'trainer'
                        ? 'bg-blue-500/10 border-blue-500/20 ml-4'
                        : 'bg-purple-500/10 border-purple-500/20 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-xs font-bold ${
                        msg.sender_type === 'trainer' ? 'text-blue-400' : 'text-purple-400'
                      }`}>
                        {msg.sender_name || (msg.sender_type === 'trainer' ? 'Trainer' : 'User')}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-white">{msg.message_content || msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackageDetailModal;
