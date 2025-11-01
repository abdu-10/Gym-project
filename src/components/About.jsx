import React from 'react'

function About() {
  return (
    <div id='about' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                <div className='order-2 lg:order-1'>
                    <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                        About FitLife

                    </h2>
                    <p className='text-lg text-gray-600 mb-6'>
                        Founded in 2020, FitLife is dedicated to providing a premium fitness experience for our members. Our state-of-the-art facilities, expert trainers, and diverse class offerings are designed to help you achieve your health and wellness goals.
                    </p>
                     <p className='text-lg text-gray-600 mb-6'>
                        we believe in a holistic approach to fitness that encompasses physical health, mental well-being, and community support. Join us and become part of the FitLife family!
                    </p>
                    <div className='grid grid-cols-2 gap-6 mb-6'>
                        <div>
                            <div className='text-3xl font-bold text-red-600'>10+
                                <p>Year</p>

                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </div>
        </div>
  )
}

export default About