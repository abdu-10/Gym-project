import React from 'react'

const plans = [
    {
        name: 'Basic',
        price: '$29',
        period: 'per month',
        features: [
            'Gym Access (6 AM - 10 PM)',
            'Basic fitness equipment',
            'Locker room access',
            '2 group classes per week',
            'Free fitness assessment',
        ],
        popular: false,
        btnText: 'Choose Basic',
        btnClass: "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"

    },
    {
        name: 'Premium',
        price: '$59',
        period: 'per month',
        features: [
            '24/7 Gym Access',
            'Full equipment access',
            'unlimited group classes',
            '1 free PT session per month',
            'Nutrition consultation',
            'Access to sauna and spa',
        ],
        popular: true,
        btnText: 'Choose Premium',
        btnClass: "bg-red-600 text-white hover:bg-red-700"
    },
    {
        name: 'Elite',
        price: '$99',
        period: 'per month',
        features: [
            '24/7 gym access',
            'Full equipment access',
            'Unlimited group classes',
            '4 PT sessions per month',
            'Monthly body composition analysis',
            'Personalized nutrition plan',
            'Access to all amenities',
        ],
        popular: false,
        btnText: 'Choose Elite',
        btnClass: " border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"

    },
];


function Pricing({ onSelectPlan }) {

  return (
    <div id="pricing" className='py-20 bg-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-16'>
                <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                    Membership Plans
                </h2>
                <p className='max-w-2xl mx-auto text-gray-600 text-lg'>
                    {" "}
                    Choose the plan that fits your fitness goals and start your journey with FitLife today!
                </p>

            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {/* map method */}
                {plans.map((plan,index) =>{
                    return(
                        <div className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col ${plan.popular ? 'border-2 border-red-600 relative' : ''}`} key={index}>
                            {/* conditional rendering */}
                            { plan.popular && (
                                <div className='absolute top-0 right-0 bg-red-600 text-white py-1 px-4 rounded-bl-lg font-medium'>
                                    Most Popular
                                </div>
                            )}

                            
                            <div className='p-8 flex-grow'> 
                                <h3 className='text-2xl font-bold mb-2 text-gray-800'>
                                    {plan.name}
                                </h3>

                                <div className='flex items-end mb-6'>
                                    <span className='text-4xl font-bold text-gray-900'>{plan.price}</span>
                                    <span className='text-gray-600 ml-2'>{plan.period}</span>
                                </div>

                                <ul className='mb-8 space-y-3'>
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className='flex items-start'>
                                            <svg
                                                className='h-5 w-5 text-green-500 mr-2 mt-0.5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M5 13l4 4L19 7'
                                                />
                                            </svg>
                                            <span className='text-gray-600'>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                           
                            <div className='p-8 pt-0'>
                             
                              <button 
                                onClick={() => onSelectPlan(plan)} 
                                className={`w-full block text-center px-6 py-3 rounded-md font-medium transition duration-300 ${plan.btnClass}`}
                              >
                                {plan.btnText}
                              </button>
                            </div>
                        </div>
                    )
                })}

            </div>
            <div className='mt-16 p-8 bg-white rounded-lg shadow-sm text-center'>
            <h3 className='text-2xl font-semibold mb-4 text-gray-800'>Need Something Special?</h3>
            <p className='text-gray-600 mb-6'>
                Contact Us for custom corporate packages or special membership requiremnets
            </p>
            <a href='#contact' className='inline-block bg-gray-800 text-white hover:bg-gray-700 px-6 py-3 rounded-md font-medium transition-all duration-300'>
                Contact Us
            </a>
        </div>

        </div>

        
    </div>

  )
}

export default Pricing