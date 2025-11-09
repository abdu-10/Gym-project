import React from 'react'
import { useState } from 'react';

function Features() {
    const [activeFeature, setActiveFeature] = useState(null);
    const features = [
        {
            id:1,
            icon: (
                <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                >
                <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 10V3L4 14h7v7l9-11h-7z'
                />
                </svg>
            ),
            title: 'Cutting-Edge Equipment',
            description: 'Experience fitness with our state-of-art equipment featuring the latest technology, ergonomic designs, and premium quality for optimal performance and results.',
            image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGd5bXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
        },
        {
            id:2,
            icon: (
                <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                >
                <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                </svg>
            ),
            title: '24/7 Access',
            description: 'Enjoy the flexibility of our 24/7 gym access, allowing you to work out at your convenience, whether early morning or late at night.',
            image: 'https://images.unsplash.com/photo-1596357395217-80de13130e92?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE4fHxneW18ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
        },
        {
            id:3,
            icon: (
                <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                >
                <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
                </svg>
            ),
            title: 'Elite Personal Training',
            description: 'Achieve your fitness goals with our elite personal training services, tailored to your individual needs and designed to maximize your results.',
            image: 'https://images.unsplash.com/photo-1723117418183-2422c62a5a75?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQ2fHxneW18ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
        },
        {
            id:4,
            icon: (
                <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                >
                <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                />
                </svg>
            ),
            title: 'Luxurious Amenities',
            description: 'Indulge in our luxurious amenities, including spa services, sauna, and relaxation lounges, designed to enhance your overall fitness experience.',
            image: 'https://images.unsplash.com/photo-1637666133087-23b7138ea721?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTc0fHxneW18ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
        },
        {
            id:5,
            icon: (
                <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                >
                <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                />
                </svg>
            ),
            title: 'Customized Programs',
            description: 'Experience personalized fitness programs tailored to your individual goals and preferences, ensuring optimal results and satisfaction.',
            image: 'https://images.unsplash.com/photo-1584863231364-2edc166de576?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIyfHxneW18ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
        },
        {
            id:6,
            icon: (
                <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                >
                <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'

                />
                </svg>
            ),
            title: 'Fitness App Integration',
            description: 'Stay connected and track your progress with our seamless fitness app integration, providing real-time updates and personalized insights.',
            image: 'https://plus.unsplash.com/premium_photo-1712761996875-3057cee4f6af?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zml0bmVzcyUyMGFwcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
        },
    ];

  return (
    <div id='features' className='py-24 bg-gray-50 overflow-hidden'>
<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <div className='text-center mb-16'>
        <div className='flex items-center justify-center mb-4'>
            <div className='h-0.5 w-16 bg-red-600 mr-3'></div>
            <span className='text-red-600 font-semibold'>Premium Experience</span>
            <div className='h-0.5 w-16 bg-red-600 ml-3'></div>

            </div>
        <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>Why Choose <span className='text-red-600'>FITELITE</span>?</h2>
        <p className='max-w-2xl mx-auto text-gray-600 text-lg'>We combine luxury amenities with professional training to provide the best fitness experience.</p>


        </div>
        <div className='relative mt-20'>
            {/* features showcase interactive */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 gap-10'>
                <div className='lg:col-span-1'>
                    <div className='sticky top-32 space-y-1'>
                        {/* i will map method here */}
                       {features.map((feature) => {
                
                        return (
                             <div className={`group relative p-5 rounded-xl transition-all duration-300 cursor-pointer ${activeFeature === feature.id ? "bg-white shadow-xl border-l-4 border-red-600" : "hover:bg-white/70 "}`}
                             onMouseEnter={()=> setActiveFeature(feature.id)}
                             onClick={()=> setActiveFeature(feature.id)}
                             >
                            <div className='flex items-start'>
                                <div className={`p-3 rounded-lg transition-all duration-300 ${activeFeature === feature.id ? "text-red-600" : "text-gray-900"}`}>
                                    {feature.icon}

                                </div>
                                <div className='ml-4'>
                                    <h3 className='text-lg font-semibold transition-all duration-300'>{feature.title}</h3>
                                    <p className='text-gray-600 text-sm mt-1 line-clamp-2'>{feature.description}</p>
                                    </div>

                            </div>

                        </div>
                        );
                          })}
                            
                       

                    </div>
                </div>

                <div className='lg:col-span-2 relative h-[500px] lg:h-auto'>
                    <div className='w-full h-full rounded-2xl overflow-hidden shadow-2xl'>
                        {/* i will use map method here */}
                        
                        {features.map((feature) =>{
                            return (
                                <div className={`absolute inset-0 transition-all duration-700 transform ${activeFeature === feature.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
                            <div className='absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10'></div>
                            <img src={feature.image} alt='' className='w-full h-full object-cover'/>
                            <div className='absolute bottom-0 left-0 right-0 p-8 z-20'>
                                <h3 className='text-2xl font-bold text-white mb-2'>{feature.title}</h3>
                                <p className='text-gray-200'>{feature.description}</p>
                            </div>

                        </div>
                        );
                        })}
                        {/* Default Image if nothing is selected */}
                        {!activeFeature && (
                            <div className='absolute inset-0'>
                            <div className='absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10'>
                            <img src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb.4.0.3&ixid=M3wMjA3fDB8MHxwaG90by1wYwslfH8fGVufHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80' alt='' className='w-full h-full object-cover'/>

                            <div className='absolute bottom-0 left-0 right-0 p-8 z-20'>
                                <h3 className='text-2xl font-bold text-white mb-2'>Discover Our Premium Features</h3>
                                <p className='text-gray-200'>
                                    {" "}
                                    Hover Over any Feature to learn more about what makes FITELITE special
                                </p>

                            </div>

                            </div>

                        </div>

                        )}
                    </div>

                </div>

                

            </div>
            {/* stats sections */}
                <div className='mt-24 grid grid-cols-2 md:grid-cols-4 gap-8'>
                    <div className='p-6 bg-white rounded-xl shadow-sm text-center'>
                        <div className='text-red-600 text-4xl font-bold mb-2'>50+ </div>
                        <p className='text-gray-600'>Fitness Classes</p>

                    </div>
                    <div className='p-6 bg-white rounded-xl shadow-sm text-center'>
                        <div className='text-red-600 text-4xl font-bold mb-2'>24/7</div>
                        <p className='text-gray-600'>Access</p>

                    </div>
                    <div className='p-6 bg-white rounded-xl shadow-sm text-center'>
                        <div className='text-red-600 text-4xl font-bold mb-2'>15+</div>
                        <p className='text-gray-600'>Expert Trainers</p>

                    </div>
                    <div className='p-6 bg-white rounded-xl shadow-sm text-center'>
                        <div className='text-red-600 text-4xl font-bold mb-2'>1000+</div>
                        <p className='text-gray-600'>Happy Members</p>

                    </div>

                </div>

                {/* call to action section */}
                <div className='mt-20 text-center'>
                    <a href='#pricing' className='inline-flex items-center justify-center bg-red-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-red-700 transition-all duration-300 transform hover:scale-105'>
                        Explore Membership Plans
                        <svg
                        className='w-5 h-5 ml-2'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        >
                            <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M14 5l7 7m0 0l-7 7m7-7H3'
                            />
                        </svg>
                    </a>

                </div>

        </div>
        </div>

</div>
  )
}

export default Features
