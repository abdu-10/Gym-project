import React from 'react'

function Contact() {
  return (
    <div id='contact' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-6 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                    Contact Us
                </h2>
                <p className='max-w-2xl mx-auto text-gray-600 text-lg '>
                    Have a question or want to learn more? Reach out to our team
                </p>

            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                <div>
                    <div className='bg-gray-50 rounded-xl shadow-md p-8 h-full'>
                        <h3 className='text-2xl font-bold text-gray-800 mb-6'>Get in touch</h3>
                        <div className='space-y-6'>
                            <div className='flex items-start'>
                               <div className='flex-shrink-0 bg-red-100 p-3 rounded-full'>
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" 
                                className="w-6 h-6 text-red-600"
                                >
                                    <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z
                                    "
                                    />
                                    <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                               </div>

                               <div className='ml-4'>
                                <h4 className='text-lg font-semibold text-gray-800'>Address</h4>
                                <p className='text-gray-600 mt-1'>
                                    123 Fitness Lane <br/>
                                    Healthy City, HC 12345
                                    
                                </p>

                               </div>

                            </div>

                            <div className='flex items-start'>
                               <div className='flex-shrink-0 bg-red-100 p-3 rounded-full'>
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" 
                                className="w-6 h-6 text-red-600"
                                >
                                    <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h2.12c.966 0 1.793.647 2.032 1.583l.533 2.132c.172.685-.07 1.398-.62 1.848l-1.21.968a11.042 11.042 0 005.516 5.516l.968-1.21c.45-.55 1.163-.792 1.848-.62l2.132.533A2.25 2.25 0 0119.5 17.63V19.5c0 1.243-1.007 2.25-2.25 2.25h-.75C8.846 21.75 2.25 15.154 2.25 6.75v0z
"
                                    />
                                </svg>
                               </div>

                               <div className='ml-4'>
                                <h4 className='text-lg font-semibold text-gray-800'>Phone</h4>
                                <p className='text-gray-600 mt-1'>
                                    +254 71 293 912 <br/>
                                    Mon-Fri 6:00AM - 10:00PM
                                    
                                </p>

                               </div>

                            </div>

                             <div className='flex items-start'>
                               <div className='flex-shrink-0 bg-red-100 p-3 rounded-full'>
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" 
                                className="w-6 h-6 text-red-600"
                                >
                                    <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615A2.25 2.25 0 012.25 6.993V6.75

"
                                    />
                                </svg>
                               </div>

                               <div className='ml-4'>
                                <h4 className='text-lg font-semibold text-gray-800'>Email</h4>
                                <p className='text-gray-600 mt-1'>
                                    info@elitefitness.com <br/>
                                    support@elitefitness.com
                                    
                                    
                                </p>

                               </div>

                            </div>

                        </div>

                        <div className='mt-8'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Follow Us</h3>
                            <div className='flex space-x-4'>
                                <a href='#' className='bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition duration-300'
                                >
                                    {" "}
                                    <svg
                                     xmlns='http://www.w3.org/2000/svg'
                                     className='h-5 w-5'
                                     fill='currentColor'
                                     viewBox='0 0 24 24'
                                     >
                                        <path d= 'M9 8h-3v4h3v125v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.888c-3.596 0-5.192 1.583-5.192 4.615v3.385v'/>

                                     </svg>
                                </a>
                                
                                  <a href='#' className='bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition duration-300'
                                >
                                    {" "}
                                    <svg
                                     xmlns='http://www.w3.org/2000/svg'
                                     className='h-5 w-5'
                                     fill='currentColor'
                                     viewBox='0 0 24 24'
                                     >
                                        <path d= 'M7.5 2.25h9A5.25 5.25 0 0121.75 7.5v9A5.25 5.25 0 0116.5 22.5h-9A5.25 5.25 0 012.25 17.25v-9A5.25 5.25 0 017.5 2.25zm4.5 5.25a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 1.5a3 3 0 110 6 3 3 0 010-6zm4.125-3.375a.9375.9375 0 11-1.875 0 .9375.9375 0 011.875 0z'
                                        />

                                     </svg>
                                </a>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
      
    </div>
  )
}

export default Contact
