import React from 'react'

function Footer({ onOpenScanner }) {
  return (
    <footer className='bg-gray-900 text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                <div>
                    <h2 className='text-2xl font-bold text-red-500 mb-4'>FitLife</h2>
                    <p className='text-gray-400 mb-6'>
                        {" "}
                        Transforming lives through fitness, health and wellness since 2020. Join our community today and start your journey to a better you.
                    </p>
                    <div className='flex space-x-4'>
                        <a href='' className='text-gray-400 hover:text-white transition duration-300'
                        >
                            <svg
                                     xmlns='http://www.w3.org/2000/svg'
                                     className='h-6 w-6'
                                     fill='currentColor'
                                     viewBox='0 0 24 24'
                                     >
                                        <path d= 'M9 8H6v4h3v12h5V12h3.642l.358-4H14V6.333C14 5.378 14.192 5 15.115 5h2.885V0h-3.597C13.403 0 9 1.583 9 4.615V8z '/>

                                     </svg>
                        </a>
                        <a href='' className='text-gray-400 hover:text-white transition duration-300'
                        >
                            <svg
                                     xmlns='http://www.w3.org/2000/svg'
                                     className='h-6 w-6'
                                     fill='currentColor'
                                     viewBox='0 0 24 24'
                                     >
                                        <path d= 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z'/>

                                     </svg>
                        </a>

                        <a href='' className='text-gray-400 hover:text-white transition duration-300'
                        >
                            <svg
                                     xmlns='http://www.w3.org/2000/svg'
                                     className='h-6 w-6'
                                     fill='currentColor'
                                     viewBox='0 0 24 24'
                                     >
                                        <path d= 'M23,9.71a8.5,8.5,0,0,0-.91-4.13,2.92,2.92,0,0,0-1.72-1A78.36,78.36,0,0,0,12,4.27a78.45,78.45,0,0,0-8.34.3,2.87,2.87,0,0,0-1.46.74c-.9.83-1,2.25-1.1,3.45a48.29,48.29,0,0,0,0,6.48,9.55,9.55,0,0,0,.3,2,3.14,3.14,0,0,0,.71,1.36,2.86,2.86,0,0,0,1.49.78,45.18,45.18,0,0,0,6.5.33c3.5.05,6.57,0,10.2-.28a2.88,2.88,0,0,0,1.53-.78,2.49,2.49,0,0,0,.61-1,10.58,10.58,0,0,0,.52-3.4C23,13.69,23,10.31,23,9.71ZM9.74,14.85V8.66l5.92,3.11C14,12.69,11.81,13.73,9.74,14.85Z'/>

                                     </svg>
                        </a>
                        <a href='' className='text-gray-400 hover:text-white transition duration-300'
                        >
                            <svg
                                     xmlns='http://www.w3.org/2000/svg'
                                     className='h-6 w-6'
                                     fill='currentColor'
                                     viewBox='0 0 24 24'
                                     >
                                        <path d= 'M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z'/>

                                     </svg>
                        </a>


                    </div>
                </div>

                <div>
                    <h3 className='text-lg font-semibold text-white mb-4'>Quick Links</h3>
                    <ul>
                        <li><a href= "#home" className='text-gray-400 hover:text-white transition duration-300'>
                            Home
                            </a>
                            </li>
                            <li><a href= "#about" className='text-gray-400 hover:text-white transition duration-300'>
                            About
                            </a>
                            </li>
                            <li><a href= "#classes" className='text-gray-400 hover:text-white transition duration-300'>
                            Classes
                            </a>
                            </li>
                            <li><a href= "#trainers" className='text-gray-400 hover:text-white transition duration-300'>
                            Trainers
                            </a>
                            </li>
                            <li><a href= "#testimonials" className='text-gray-400 hover:text-white transition duration-300'>
                            Testimonials
                            </a>
                            </li>
                            <li><a href= "#contact" className='text-gray-400 hover:text-white transition duration-300'>
                            Contact
                            </a>
                            </li>
                    </ul>
                </div>
                <div>
                    <h3 className='text-lg font-semibold text-white mb-4'>Working Hours</h3>
                    <ul>
                        <li className='text-gray-400'>
                            Monday - Friday: 5:00 AM - 11:00 PM
                        </li>
                        <li className='text-gray-400'>Saturday: 6:00 AM - 10:00 PM</li>
                        <li className='text-gray-400'>Sunday: 7:00 AM - 9:00 PM</li>
                        <li className='text-gray-400'>Holidays: 8:00 AM - 8:00 PM</li>
                    </ul>
                    <div className='mt-6'>
                        <a href='#'className='inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition duration-300'
                        >
                            Book a Session
                            </a>

                    </div>
                </div>

                <div>
                    <h3 className='text-lg font-semibold text-white mb-4'>Newsletter</h3>
                    <p className='text-gray-400 mb-4'>
                       Subscribe to our newsletter for fitness tips, special offers, and updates. 
                    </p>
                    <form className='space-y-4'>
                        <div>
                            <input type="email" placeholder="Your email address" className='w-full px-4 py-2 bg-gray-800 border-gray-7-- rounded-md text-white focus:ring-red-500 focus:border-red-500'
                            required />
                        </div>
                        <button type='submit' className='w-full bg-red-600 hover"bg-red-700 text-white px-4 py-2 rounded-md text-sm transition duration-300'>Subscribe</button>

                    </form>
                </div>

            </div>
            <div onClick={onOpenScanner} className='py-6 border-t border-gray-800 text-center'>
                <p className='text-gray-400 text-sm'>
                    &copy;{new Date().getFullYear()} FitLife Fitness Center. All rights reserved
                </p>
            </div>


        </div>
      
    </footer>
  )
}

export default Footer
