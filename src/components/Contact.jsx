import React, { useState, useEffect } from 'react'

function Contact() {

  const [formData, setFormData] = useState({
      name:"",
      email:"",
      phone:"",
      subject:"",
      message:"",
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  // We add state to track loading and errors, just like with Testimonials
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>  {
      const {name, value} = e.target;
      setFormData((prevState)=>({
        ...prevState, [name]: value,
      }))
  }

  
  // This is the new function that sends data to your Rails API
  const handleSubmit = (e) =>{
    e.preventDefault(); // Stop the form from reloading the page
    
    // 1. We are starting the "submission" process
    setIsLoading(true);
    setError(null); // Clear any old errors

    // 2. We MUST format our data to match what Rails expects.
    // Our Rails 'contact_params' requires a 'contact' key.
    const postData = {
      contact: formData
    };

    // 3. We use 'fetch' to send a POST request
    fetch('http://localhost:3000/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 4. We send our formatted 'postData' as a JSON string
      body: JSON.stringify(postData),
    })
    .then(response => {
      // 5. Check if the server responded with an error
      if (!response.ok) {
        // If it's a 422 or 500, we throw an error to be 'caught' below
        throw new Error('Something went wrong. Please try again.');
      }
      // If it's OK, we parse the JSON response (e.g., {"message": "Success!"})
      return response.json();
    })
    .then(data => {
      // 6. SUCCESS!
      console.log("Success:", data);
      setIsSubmitted(true); // Show the "Thank you" message
      
      // Reset the form just like you did before
      setFormData({
        name:"",
        email:"",
        phone:"",
        subject:"",
        message:"",
      });
    })
    .catch(error => {
      // 7. FAILURE!
      console.error('Error:', error);
      setError(error.message); // Save the error message to show the user
    })
    .finally(() => {
      // 8. ALL DONE (Success or Failure)
      setIsLoading(false); // We are no longer loading
    });
  }

  // This useEffect is perfect, no changes needed.
  useEffect(() => {
    if (!isSubmitted) return;
    const t = setTimeout(() => {
        setIsSubmitted(false);
    }, 5000);
    return () => clearTimeout(t);
  }, [isSubmitted]);

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
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" 
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
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" 
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
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" 
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
                             <a href='#' className='bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition duration-300'>
                                 {" "}
                                 <svg
                                   xmlns='http://www.w3.org/2000/svg'
                                   className='h-5 w-5'
                                   fill='currentColor'
                                   viewBox='0 0 24 24'
                                   >
                                     <path d= 'M9 8H6v4h3v12h5V12h3.642l.358-4H14V6.333C14 5.378 14.192 5 15.115 5h2.885V0h-3.597C13.403 0 9 1.583 9 4.615V8z '/>
                                  </svg>
                             </a>
                             <a href='#' className='bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition duration-300'>
                                 {" "}
                                 <svg
                                   xmlns='http://www.w3.org/2000/svg'
                                   className='h-5 w-5'
                                   fill='currentColor'
                                   viewBox='0 0 24 24'
                                   >
                                     <path d= 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z'
                                     />
                                  </svg>
                             </a>
                             <a href='#' className='bg-red-100 p-3 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition duration-300'>
                                 {" "}
                                 <svg
                                   xmlns='http://www.w3.org/2000/svg'
                                   className='h-5 w-5'
                                   fill='currentColor'
                                   viewBox='0 0 24 24'
                                   >
                                     <path d= 'M23,9.71a8.5,8.5,0,0,0-.91-4.13,2.92,2.92,0,0,0-1.72-1A78.36,78.36,0,0,0,12,4.27a78.45,78.45,0,0,0-8.34.3,2.87,2.87,0,0,0-1.46.74c-.9.83-1,2.25-1.1,3.45a48.29,48.29,0,0,0,0,6.48,9.55,9.55,0,0,0,.3,2,3.14,3.14,0,0,0,.71,1.36,2.86,2.86,0,0,0,1.49.78,45.18,45.18,0,0,0,6.5.33c3.5.05,6.57,0,10.2-.28a2.88,2.88,0,0,0,1.53-.78,2.49,2.49,0,0,0,.61-1,10.58,10.58,0,0,0,.52-3.4C23,13.69,23,10.31,23,9.71ZM9.74,14.85V8.66l5.92,3.11C14,12.69,11.81,13.73,9.74,14.85Z'
                                     />
                                  </svg>
                             </a>
                         </div>
                      </div>
                  </div>
                </div>

                <div>
                    <div className='bg-white rounded-xl shadow-sm p-8'>
                        <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                            Send Us a message
                        </h3>
                        {/* conditional rendering */}
                        {isSubmitted ? 
                          <div className='bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg'>
                              <div className='flex'>
                                  <svg
                                    className='h-5 w-5 text-green-500 mr-2'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                  >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                  </svg>
                                  <span>
                                      Thank you for your message! we'll get back to you soon.
                                  </span>
                              </div>
                          </div>
                        :
                          <form className='space-y-6' onSubmit={handleSubmit}>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                  <div>
                                      <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                                          Your Name
                                      </label>
                                      <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} required className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500'/>
                                  </div>
                                  <div>
                                      <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                                          Email Address
                                      </label>
                                      <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500'/>
                                  </div>
                              </div>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 '>
                                  <div>
                                      <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
                                          Phone Number
                                      </label>
                                      <input type='tel' id='phone' name='phone' value={formData.phone} onChange={handleChange} required className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500'/>
                                  </div>
                                  <div>
                                      <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-1'>
                                          Subject
                                      </label>
                                      <input type='text' id='subject' name='subject' value={formData.subject} onChange={handleChange} required className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500'/>
                                  </div>
                              </div>
                              <div>
                                  <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
                                      Your Message
                                  </label>
                                  <textarea id='message' name='message' rows={5}  value={formData.message} onChange={handleChange} required className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500'/>
                              </div>
                              <div>
                                  {/* --- NEW: Button is now disabled and changes text --- */}
                                  <button 
                                    type='submit' 
                                    className='w-full bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition duration-300 disabled:bg-gray-400'
                                    disabled={isLoading}
                                  >
                                    {isLoading ? 'Sending...' : 'Send Message'}
                                  </button>
                              </div>

                              {/* --- NEW: Error message container --- */}
                              {error && (
                                <div className='text-center text-red-600'>
                                  {error}
                                </div>
                              )}
                          </form> 
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Contact