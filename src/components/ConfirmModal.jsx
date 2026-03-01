import React from 'react';

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) {
  if (!isOpen) return null;

  const styles = {
    danger: {
      header: 'from-red-600 via-red-500 to-red-600',
      confirmButton: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
      iconBg: 'bg-white/20',
      icon: 'text-white'
    },
    success: {
      header: 'from-emerald-600 via-emerald-500 to-emerald-600',
      confirmButton: 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800',
      iconBg: 'bg-white/20',
      icon: 'text-white'
    },
    info: {
      header: 'from-blue-600 via-blue-500 to-blue-600',
      confirmButton: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      iconBg: 'bg-white/20',
      icon: 'text-white'
    }
  };

  const currentStyle = styles[variant] || styles.danger;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-scaleIn">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentStyle.header} px-6 py-5`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${currentStyle.iconBg} backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse`}>
              {variant === 'success' ? (
                <svg className={`w-6 h-6 ${currentStyle.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className={`w-6 h-6 ${currentStyle.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-wide">{title}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          <p className="text-gray-700 text-base leading-relaxed font-semibold">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all hover:scale-105 transform shadow-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-3 bg-gradient-to-r ${currentStyle.confirmButton} text-white font-bold rounded-xl transition-all hover:scale-105 transform shadow-lg hover:shadow-xl`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}

export default ConfirmModal;
