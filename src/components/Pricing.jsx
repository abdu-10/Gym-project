import React, { useState, useEffect } from 'react'; // --- NEW: Added useEffect ---

// --- DELETED: The hard-coded 'plans' array is gone! ---


function Pricing({ onSelectPlan }) {

  // --- NEW: We create state variables to hold our data ---
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: We use useEffect to fetch data when the component loads ---
  useEffect(() => {
    fetch('http://localhost:3000/plans')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPlans(data); // <-- Save the plans from our API into state
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []); // The empty array [] means "run this only once"


  // --- NEW: Create button class logic ---
  // Since btnClass is no longer in our data, we'll create it here.
  // This is better logic anyway!
  const getButtonClass = (isPopular) => {
    if (isPopular) {
      return "bg-red-600 text-white hover:bg-red-700";
    }
    return "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white";
  };

  // --- NEW: Create button text logic ---
  const getButtonText = (planName) => {
    return `Choose ${planName}`;
  };

  // --- NEW: Loading State ---
  if (isLoading) {
    return (
      <div id="pricing" className='py-20 bg-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Loading Membership Plans...
          </h2>
        </div>
      </div>
    );
  }

  // --- NEW: Error State ---
  if (error) {
    return (
      <div id="pricing" className='py-20 bg-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-red-600 mb-4'>
            Error loading plans
          </h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // --- This is your original JSX, with minor updates ---
  return (
    <div id="pricing" className='py-20 bg-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
            Membership Plans
          </h2>
          <p className='max-w-2xl mx-auto text-gray-600 text-lg'>
            Choose the plan that fits your fitness goals and start your journey with FitLife today!
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* map method now uses our 'plans' state */}
          {plans.map((plan) => { // 'index' is not needed if we use 'plan.id'
            return (
              // --- UPDATED: 'flex-col' and 'flex-grow' make cards equal height ---
              <div 
                className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col ${plan.popular ? 'border-2 border-red-600 relative' : ''}`} 
                key={plan.id} // <-- Use plan.id from the database
              >
                { plan.popular && (
                  <div className='absolute top-0 right-0 bg-red-600 text-white py-1 px-4 rounded-bl-lg font-medium'>
                    Most Popular
                  </div>
                )}

                {/* --- UPDATED: 'flex-grow' makes this section fill space --- */}
                <div className='p-8 flex-grow'> 
                  <h3 className='text-2xl font-bold mb-2 text-gray-800'>
                    {plan.name}
                  </h3>

                  <div className='flex items-end mb-6'>
                    <span className='text-4xl font-bold text-gray-900'>{plan.price}</span>
                    <span className='text-gray-600 ml-2'>{plan.period}</span>
                  </div>

                  <ul className='mb-8 space-y-3'>
                    {/* The 'features' array from our API works perfectly here! */}
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
                  {/* --- UPDATED: Button classes and text are now dynamic --- */}
                  <button 
                    onClick={() => onSelectPlan(plan)} // 'plan' object now comes from our API
                    className={`w-full block text-center px-6 py-3 rounded-md font-medium transition duration-300 ${getButtonClass(plan.popular)}`}
                  >
                    {getButtonText(plan.name)}
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
  );
}

export default Pricing;