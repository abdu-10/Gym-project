import React, { useState, useEffect } from 'react';

// --- NEW CLEAN ICONS ---
// A bold, solid arrow that looks perfect at small sizes
const InstallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mb-1 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mb-1 bg-gray-700 rounded-md text-white p-0.5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return; 
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setIsVisible(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        setTimeout(() => {
            setIsVisible(true);
            setShowIOSPrompt(true);
        }, 2000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 flex justify-center pointer-events-none">
        
        <style>{`
            @keyframes slideUpFade {
                from { transform: translateY(100%) scale(0.95); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
            }
            .animate-premium-slide {
                animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
        `}</style>

      {/* THE CARD CONTAINER */}
      <div className="w-full max-w-md bg-black/85 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl animate-premium-slide pointer-events-auto relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-red-600/30 rounded-full blur-[60px] pointer-events-none"></div>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-4">
                
                {/* --- LOGO BOX (UPDATED) --- */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 shrink-0 overflow-hidden bg-black/50">
                    <img 
                        src="/vite.png" 
                        alt="App Logo" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                {/* -------------------------- */}

                <div>
                    <h3 className="text-white font-bold text-lg leading-tight tracking-tight">FitElite Access</h3>
                    <p className="text-gray-400 text-xs font-medium mt-0.5 tracking-wide">Official App</p>
                </div>
            </div>
            
            <button 
                onClick={() => setIsVisible(false)} 
                className="text-gray-500 hover:text-white transition-colors p-2 -mr-2 rounded-full hover:bg-white/10"
            >
                <CloseIcon />
            </button>
        </div>

        {/* ANDROID / CHROME ACTION */}
        {!showIOSPrompt && (
            <div className="space-y-4 relative z-10">
                <p className="text-sm text-gray-300 leading-relaxed">
                    Install for instant access to your <span className="text-white font-semibold">Digital ID</span> and faster entry.
                </p>
                <button 
                    onClick={handleInstallClick}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 active:scale-95 transition-all shadow-xl tracking-wide"
                >
                    <InstallIcon />
                    Install Now
                </button>
            </div>
        )}

        {/* IOS INSTRUCTIONS */}
        {showIOSPrompt && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 relative z-10">
                <p className="font-bold text-white text-sm mb-3">Install on iPhone:</p>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="flex-shrink-0 bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border border-gray-600">1</span>
                        <span>Tap the <ShareIcon /> <strong className="text-white">Share</strong> button.</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <span className="flex-shrink-0 bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border border-gray-600">2</span>
                        <span>Scroll down & tap <PlusIcon /> <strong className="text-white">Add to Home Screen</strong>.</span>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

export default InstallPrompt;