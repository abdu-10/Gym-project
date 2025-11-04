import React from 'react'
import { useState } from 'react';   

function Testimonials() {
    const testimonials = [
        {
            quote: "Joining FitLife has completely transformed my fitness journey. The trainers are exceptional, and the community is so supportive!",
            author: "Sarah Johnson",
            role: "Member for 2 years",
            image:"https://plus.unsplash.com/premium_photo-1691784781482-9af9bce05096?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGFzc3BvcnQlMjBwaG90b3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
            rating: 5,
        },
        {   
            quote: "The variety of classes and state-of-the-art equipment keep me motivated. I've never felt stronger or more confident!",
            author: "Mike Chen",
            role: "Member for 1 year",
            image: "https://images.unsplash.com/photo-1666852327656-5e9fd213209b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
            rating: 5,
        },
        {
            quote: "FitLife's personalized training programs helped me achieve my fitness goals faster than I ever imagined possible.",
            author: "Emma Rodriguez",
            role: "Member for 3 years",
            image: "https://plus.unsplash.com/premium_photo-1668485968660-67a0f563d59a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
            rating: 5,
            
        },
        {
            quote: "The nutrition counseling and fitness classes at FitLife have helped me develop a healthy lifestyle that I can maintain for life.",
            author: "David Thompson",
            role: "Member for 6 months",
            image: "https://plus.unsplash.com/premium_photo-1693258698597-1b2b1bf943cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=600",
            rating: 5,
        },
        {
            quote: "The flexible scheduling and variety of classes at FitLife make it easy to stay consistent with my workouts.",
            author: "Jessica Lee",
            role: "Member for 8 months",
            image: "https://plus.unsplash.com/premium_photo-1682096446235-897adc1a189b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600",
            rating: 4,
        },
        
        
    ];

    const [activeIndex , setActiveIndex] = useState(0);
    

    const nextTestimonial = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };
    const prevTestimonial = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <svg
                key={index}
                className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"

            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />

        </svg>
    ));
};

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
                        <img src={testimonials[activeIndex].image} alt='' className='w-full h-full object-cover'/>

                    </div>
                    <div className='text-center'>
                        <div className='flex justify-center mb-2'>{renderStars(testimonials[activeIndex].rating )}
                            </div>
                        <h4 className='text-xl font-semibold text-gray-900 mb-1'>{testimonials[activeIndex].author}</h4>
                        <p className='text-gray-500'>{testimonials[activeIndex].role}</p>

                    </div>

                    </div>

                    <div className='w-full md:w2/3 bg-gradient-to-r from-red-50 to-gray-50 p-8 md:p-12'>
                    <svg
                    className="h-12 w-12 text-red-200 mb-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    <p className='text-xl md:text-2xl text-gray-700 italic mb-8'>
                     "{testimonials[activeIndex].quote}"
                    </p>

                    </div>

                </div>

                <div className='flex justify-center mt-8 space-x-4'>
                    <button className='p-2 rounded-full bg-white shadow hover:shadow-md transition duration-300' onClick={prevTestimonial}>
                        <svg
                        className='h-6 w-6 text-gray-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            
                          
                        </svg>
                        

                 
                    </button>

                    <div className='flex space-x-2 items-center'>
                        <button className={'w-3 h-3 rounded-full transition duration-300'}>

                        </button>

                    </div>
                    <button className='p-2 rounded-full bg-white shadow hover:shadow-md transition duration-300' onClick={nextTestimonial}>
                    {" "}
                    <svg
                    className='h-6 w-6 text-gray-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        
                      
                    </svg>
                    
                    </button>

                </div>

            </div>

        </div>
    </div>
  )
}

export default Testimonials
