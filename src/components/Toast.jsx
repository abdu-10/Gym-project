import React, { useEffect } from 'react';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-gradient-to-r from-green-500 to-green-600 border-green-400',
    error: 'bg-gradient-to-r from-red-500 to-red-600 border-red-400',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slideInRight">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-2xl shadow-2xl border-2 min-w-[320px] max-w-md backdrop-blur-sm`}>
        <div className="flex items-start gap-4">
          <div className="text-3xl animate-bounce">{icons[type]}</div>
          <div className="flex-1">
            <p className="font-bold text-base leading-tight">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors ml-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white/80 rounded-full animate-shrink" style={{ animation: 'shrink 4s linear forwards' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}

export default Toast;
