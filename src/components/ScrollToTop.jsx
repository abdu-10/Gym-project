import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

function ScrollToTop() {

const [isVisible,setIsVisible] = useState(false);

useEffect(()=>{
    const toggleVisiblity = () => {
        if (window.pageYOffset > 500){
            setIsVisible(true);         
        } else {
            setIsVisible(false);
        }
    };

    window.addEventListener("scroll", toggleVisiblity)

    return () => window.removeEventListener("scroll", toggleVisiblity)

}, []);

const scrolToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}

  return (
    <>
    {/* conditional rendering */}
    {isVisible && (
          <button className='fixed bottom-6 right-6 p-3 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all duration-300 z-50'onClick={scrolToTop}>
        {" "}
        <svg
        className='w-5 h-5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
        >
            <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
            >

            </path>
        </svg>
    </button>
    )}

    </>
  )
}

export default ScrollToTop