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
                                <p className='text-gray-600'>Years of Experience</p>

                            </div>
                            
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-red-600'>15+
                                <p className='text-gray-600'>Expert Trainers</p>

                            </div>
                            
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-red-600'>50+
                                <p className='text-gray-600'>Weekly Classes</p>

                            </div>
                            
                        </div>
                        <div>
                            <div className='text-3xl font-bold text-red-600'>5000+
                                <p className='text-gray-600'>Happy Members</p>

                            </div>
                            
                        </div>

                    </div>
                    <a href='#contact'
                    className='inline-flex bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition duration-300'>
                        Learn More
                    </a>

                </div>
                <div className='order-1 lg:order-2'>
                    <div className='relative'>
                        <img 
                        src='https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWJvdXQlMjB1c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600' 
                        alt='' 
                        className='w-full rounded-lg shadow-xl h-[500px] object-cover' />
                        <div className='absolute -bottom-6 -left-6 bg-red-600 text-white p-6 rounded-lg shadow-lg hidden md:block'>
                            <div className='text-2xl font-bold'>Premium Facilities</div>
                            <p>15000 sq ft of workout space</p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
        </div>
  )
}

export default About