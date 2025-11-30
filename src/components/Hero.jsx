import React, { useEffect, useState } from "react";

// Move heroBackgrounds outside the component to prevent recreation on every render
// This fixes the useEffect dependency issue that caused unnecessary interval recreation
const heroBackgrounds = [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    "https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA0fHxneW18ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
];

function Hero() {
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length);
        }, 7000);

        return () => clearInterval(interval);
    }, []); // Empty dependency array since heroBackgrounds is now a stable reference
    
  return (
    <div id="home" className="relative h-screen overflow-hidden md:h-100vh">
      {/* background image slider with overlay */}
      <div className="absolute inset-0 z-0">
        {/* modern gradient overlay*/}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/40 z-10"></div>
        {/* image slider with key burns effect */}
        {heroBackgrounds.map((bg, index) => {
    return(
        <div key={index} className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${index === currentBgIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} style={{ backgroundImage: `url(${bg})` }}></div>
    );
    })}
        
        {/* subtitle Grid overlay */}
        <div className="absolute inset-0 z-10 bg-grid-pattern opacity-10"></div>
        {/* content */}
        <div className="relative z-20 flex items-center justify-center h-full pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div
                className={"max-w-2xl transition-all duration-1000 transform"}
              >
                <h1 className="text-6xl font-bold text-white mb-8 leading-tight">
                  <span className="block">Transform</span>
                  <span className="block">
                    Your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">
                      Body
                    </span>
                    <span className="block">
                      Transform Your {" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">
                        Life
                      </span>
                    </span>
                  </span>
                </h1>
                <p className="text-sm md:text-xl text-gray-300 mb-10 max-w-xl ">
                  Join FitElite today and embark on a transformative fitness
                  journey. Our expert trainers, state-of-the-art facilities, and
                  supportive community are here to help you achieve your health
                  and wellness goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <a
                    href="#classes"
                    className="group relative overflow-hidden rounded-full bg-red-600 px-8 py-4 text-white font-medium text-lg inline-flex items-center justify-center transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
                  >
                    <span className="relative z-10">Explore Classes</span>
                    <div className="absolute inset-0  bg-gradient-to-r from-red-700 to-red-500 transform duration-300  scale-x-0 group-hover:scale-100 transition-all origin-left"></div>
                  </a>
                  <a
                    href="#pricing"
                    className="group relative overflow-hidden rounded-full border-2 border-white px-8 py-4 text-white font-medium text-lg inline-flex items-center justify-center transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
                  >
                    <span className="relative z-10">View Membership</span>
                    <div className="absolute inset-0  bg-gradient-to-r from-red-700 to-red-500 transform duration-300  scale-x-0 group-hover:scale-100 transition-all origin-left"></div>
                  </a>
                </div>
                <div className="mt-16 flex items-center space-x-8">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden ring-2 ring-red-500/20 shadow-lg">
                        <img
                          src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${i + 20}.jpg`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-white font-bold text-lg">
                    1,000+ Members
                  </div>
                  <div className="text-red-300 text-sm">
                    Join our Fitness community today!
                  </div>
                </div>
              </div>

 {/* Animated Stats card */}
            <div
              className={
                "w-full max-w-md transition-all duration-100 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}"
              }
            >
              <div className="bg/black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden hidden lg:block">
                {/* decorate elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-60/20 rounded-full blur-2xl transform translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-400/20 rounded-full blur-2xl transform -translate-x-16 translate-y-16"></div>
                {/*content */}
                <div className="relative z-10"></div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className=" text-2xl font-bold text-white">
                    Why Choose Us
                  </h3>
                  <div className="flex space-x-1">
                    <span className="h-2 w-2 rounded-full bg-red-400"></span>
                    <span className="h-2 w-2 rounded-full bg-white/50"></span>
                    <span className="h-2 w-2 rounded-full bg-white/50"></span>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Premium Equipment
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">
                        Access to the latest fitness technology and high quality
                        equipment{" "}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Expert Trainers
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">
                        Certified Professionals to guide your Fitness journey
                      </p>
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Flexible Hours
                      </h3>
                      <p className="text-gray-300 text-sm mt-1">
                       Open 24/7 to fit your busy schedule
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                <a href="#features" className="inline-flex items-center text-red-400 font-medium group">Discover all Features
                    <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                    </svg>
                </a>
                </div>
              </div>
            </div>

            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
