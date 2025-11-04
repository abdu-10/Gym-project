import React from 'react'

function Testimonials() {
  return (
    <div id='testimonials' className='py-20 bg-gray-50'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>What Our Member Say</h2>
                <p className='max-w-2xl mx-auto text-gray-600 text-lg '>
                    Don't just take our word for it - hear from our satisfied members about their fitness journey with FitLife.
                </p>

            </div>
            <div className='relative'>
                <div className='flex flex-cols md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden'>
                    <div className='w-full md:w-1/3'>
                    <div className='aspect-square rounded-full overflow-hidden w-32 h-32 mx-auto mb-6 border-4 border-red-100'>
                        <img src='' alt='' className='w-full h-full object-cover'/>

                    </div>
                    <div className='text-center'>
                        <div className='flex justify-center mb-2'>Rating</div>
                        <h4 className='text-xl font-semibold text-gray-900 mb-1'>Author</h4>
                        <p className='text-gray-500'>Role</p>

                    </div>

                    </div>

                    <div className='w-full md:w2/3 bg-gradient-to-r from-red-50 to-gray-50 p-8 md:p-12'>
                    <svg
                    className='h-12 w-12 text-red-200 mb-6'
                    fill='CurrentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    >
                        <path d="M464 256h-88v-64c0-35.3 28.7-64-64h8c13.3 0 24-10.7 24-24V36c0-13.3-10.7-24-24-24h-8c-88.4 0-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21-48-48-48z"/>

                    </svg>
                    <p className='text-xl md:text-2xl text-gray-700 italic mb-8'>
                       Quote 
                    </p>

                    </div>

                </div>

                <div className='flex justify-center mt-8 space-x-4'>
                    <button className='p-2 rounded-full bg-white shadow hover:shadow-md transition duration-300'>
                        

                        
                    </button>

                </div>

            </div>

        </div>
    </div>
  )
}

export default Testimonials
