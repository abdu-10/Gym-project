import React, { useState, useEffect } from 'react'; 

function Testimonials() {
    // 1. REMOVE the hard-coded 'testimonials' const array

    // 2. ADD new state variables
    const [testimonials, setTestimonials] = useState([]); // Will hold data from API
    const [activeIndex, setActiveIndex] = useState(0);   
    const [isLoading, setIsLoading] = useState(true);     // For loading message
    const [error, setError] = useState(null);             // For error message

    // 3. ADD the useEffect hook to fetch data
    useEffect(() => {
        // We use fetch to call  Rails API
        fetch('http://localhost:3000/testimonials')
            .then(response => {
                // If the response is not good (e.g., 404, 500), throw an error
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Convert the response to JSON
            })
            .then(data => {
                setTestimonials(data); // Put the data from the API into our state
            })
            .catch(error => {
                setError(error); // Store any error that happens
            })
            .finally(() => {
                setIsLoading(false); // We're done loading (whether it succeeded or failed)
            });
    }, []); // The empty array [] means "run this only once when the component loads"


    
    // These now work with the 'testimonials' state variable
    const nextTestimonial = () => {
        if (testimonials.length === 0) return; // Safety check
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };
    const prevTestimonial = () => {
        if (testimonials.length === 0) return; // Safety check
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

    // 4. ADD Loading and Error "Guards"
    // These will show a message *before* trying to render your component
    if (isLoading) {
        return (
            <div id='testimonials' className='py-20 bg-gray-50 text-center'>
                <h2 className='text-3xl font-bold text-gray-900'>Loading testimonials...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div id='testimonials' className='py-20 bg-gray-50 text-center'>
                <h2 className='text-3xl font-bold text-red-600'>Error loading testimonials</h2>
                <p className='text-gray-600'>{error.message}</p>
            </div>
        );
    }
    
    // 5. ADD a "No Testimonials" check
    // This prevents a crash if the API returns an empty array
    if (testimonials.length === 0) {
        return (
            <div id='testimonials' className='py-20 bg-gray-50 text-center'>
                <h2 className='text-3xl font-bold text-gray-900'>No testimonials found.</h2>
            </div>
        );
    }

    
    // This part is safe to run now because we know we have data.
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
                                <img src={testimonials[activeIndex].image} alt='' className='w-full h-full object-cover' />
                            </div>
                            <div className='text-center'>
                                <div className='flex justify-center mb-2'>{renderStars(testimonials[activeIndex].rating)}
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
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
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
                            {/* This creates the dots for each testimonial */}
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`w-3 h-3 rounded-full transition duration-300 ${activeIndex === index ? 'bg-red-500' : 'bg-gray-300'}`}
                                >
                                </button>
                            ))}
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