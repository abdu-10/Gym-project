import React from 'react'
import { useState } from 'react'

function Classes() {
    const classCategories = [
        "All",
        "Cardio",
        "Strength",
        "Flexibility",
        "Mind & Body",
    ];

    const [activeCategory, setActiveCategory] = useState("All");

    const classList = [
        {
            name: "HIIT Challenge",
            category: "Cardio",
            image: "https://images.unsplash.com/photo-1536922246289-88c42f957773?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SElJVHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
            duration: "45 mins",
            instructor: "Alex Johnson",
            time: "Mon & Wed, Fri 6:00 AM",
        },
        {
            name: "Powerlifting",
            category: "Strength",
            image: "https://images.unsplash.com/photo-1534368270820-9de3d8053204?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG93ZXJsaWZ0aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
            duration: "60 mins",
            instructor: "Sarah Lee",
            time: "Tue & Thu 5:30 PM",
        },
        {
            name: "CrossFit",
            category: "Strength",
            image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3Jvc3NmaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
            duration: "60 mins",
            instructor: "Mike Brown",
            time: "Mon & Wed 7:00 PM",
        },
        {
            name: "Pilates",
            category: "Flexibility",
            image: "https://images.unsplash.com/photo-1717500251833-d807c5753ded?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fHBpbGF0ZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
            duration: "50 mins",
            instructor: "Emily Davis",
            time: "Sat 9:00 AM",
        },
        {
            name: "Zumba",
            category: "Cardio",
            image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8enVtYmF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
            duration: "55 mins",
            instructor: "Sophia Wilson",
            time: "Sun 10:00 AM",
        },
        {
            name: "Yoga Flow",
            category: "Mind & Body",
            image: "https://plus.unsplash.com/premium_photo-1661371363253-e99d4212ae7f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHlvZ2ElMjBjbGFzc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
            duration: "60 mins",
            instructor: "Olivia Martinez",
            time: "Daily 8:00 AM",
        },
        {
            name: "Meditation & Mindfulness",
            category: "Mind & Body",
            image: "https://plus.unsplash.com/premium_photo-1710467003556-0c3576801d86?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWVkaXRhdGlvbiUyMGNsYXNzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
            duration: "30 mins",
            instructor: "James Smith",
            time: "Daily 7:00 AM",

        },
        {
            name: "Boxing Basics",
            category: "Strength",
            image: "https://plus.unsplash.com/premium_photo-1663134170454-ebca105ee9ab?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym94aW5nJTIwY2xhc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
            duration: "45 mins",
            instructor: "Alex Johnson",
            time: "Mon & Wed, Fri 6:00 AM",
        }
    ];

    const filteredClasses = activeCategory === "All"
        ? classList
        : classList.filter((cls) => cls.category === activeCategory);

  return (
    <div id='classes' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
                <h2 className='text-3xl md"text-4xl font-bold text-gray-900 mb-4'>Our Classes</h2>
                <p className='max-w-2xl mx-auto text-gray-600 text-lg'>
                    {" "}
                    From high-intensity workouts to mindful moments, we offer a wide range of classes for all fitness levels
                </p>

            </div>

            <div className='flex flex-wrap justify-center gap-4 mb-12'>

                {/* i will use logic */}
               { classCategories.map((category,index) =>{
                return (
                     <button className={`px-6 py-2 rounded-full transition duration-300 ${activeCategory === category ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      onClick={() => setActiveCategory(category)}>
                    {category}

                </button>
               )})}

            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                {/* will use logic */}
                {filteredClasses.map((cls, index) => {
                    return (
                         <div className='bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300'>
                    <div className='h-56 overflow-hidden'>
                        <img
                        src={cls.image}
                        alt={cls.name}
                        className='w-full h-full object-cover transition duration-500 hover:scale-110'
                        />

                    </div>

                    <div className='p-6'>
                        <div className='flex items-center justify-between mb-2'>
                            <span className='text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full'>{cls.category}</span>
                            <span className='text-sm text-gray-600'>{cls.duration}</span>

                        </div>

                        <h3 className='text-xl font-semibold mb-2 text-gray-800'>{cls.name}</h3>
                        <p className='text-gray-600 mb-4'>Instructor: {cls.instructor}</p>
                        <div className='flex items-center text-gray-500 text-sm'>
                            <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 mr-1'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                            >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                            />
                            </svg>
                          { cls.time }

                        </div>

                    </div>

                </div>
                    )
                })}

            </div>

            <div className='text-center mt-12'>
                <a href='#' className='inline-block border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-md font-medium transition duration-300'>
                    View Full Schedule
                </a>

            </div>

        </div>
      
    </div>
  )
}

export default Classes
