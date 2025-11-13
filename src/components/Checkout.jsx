import React, { useState } from 'react';
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-gray-400"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CreditCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-gray-400"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-12 w-12 text-green-500 mx-auto"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PayPalIcon = () => (
  <img 
    src="https://www.nopcommerce.com/images/thumbs/0015909_paypal-standard.png" 
    alt="PayPal" 
    className="h-6 w-auto rounded-sm" 
  />
);

const MpesaIcon = () => (
  <img 
    src="https://upload.wikimedia.org/wikipedia/commons/0/0b/M-PESA.png" 
    alt="M-Pesa" 
    className="h-6 w-auto rounded-sm" 
  />
);



function Checkout({ plan, onGoBack }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('card'); 

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nameOnCard: '',
    card: '',
    expiry: '',
    cvc: '',
    mpesaPhone: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsProcessing(true);
    
    let registrationData = {
      plan: plan.name,
      account: {
        name: formState.name,
        email: formState.email,
        password: formState.password,
      },
      payment: {
        method: paymentMethod,
      }
    };

    if (paymentMethod === 'card') {
      registrationData.payment = {
        ...registrationData.payment,
        nameOnCard: formState.nameOnCard,
        card: '...hidden...',
        expiry: formState.expiry,
        cvc: '...hidden...',
      };
    } else if (paymentMethod === 'mpesa') {
      registrationData.payment = {
        ...registrationData.payment,
        mpesaPhone: formState.mpesaPhone,
      };
    }

    // FAKE payment simulation
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      console.log("Registration & Payment Submitted!", registrationData);
    }, 2000); 
  };
  
  const getButtonText = () => {
    switch (paymentMethod) {
      case 'card':
        return `Pay ${plan.price} & Join`;
      case 'paypal':
        return 'Join with PayPal';
      case 'mpesa':
        return 'Join with M-Pesa';
      default:
        return `Pay ${plan.price} & Join`;
    }
  };


  // --- View 1: The "Success" Message ---
  if (isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-white">
        <div className="max-w-md w-full text-center bg-gray-50 p-10 rounded-xl shadow-lg">
          <CheckIcon />
          <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Payment Successful!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to the club, {formState.name}! You are now an official <strong>{plan.name}</strong> member.
          </p>
          <button
            onClick={onGoBack} 
            className="w-full bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition duration-300"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  // --- View 2: The Main Checkout Form ---
  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      
      {/* This style tag defines the fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* --- Minimal Header --- */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-gray-900">
                FIT<span className="text-red-500">ELITE</span>
              </span>
              <div className="ml-2 w-2 h-2 rounded-full animate-pulse bg-red-600"></div>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <LockIcon />
              <span className="ml-2 hidden sm:block">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      
      <div className="flex-1 flex items-center overflow-auto py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            
            <div className="lg:col-span-2">
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                
                
                <form onSubmit={handleSubmit}>
                  
                  <div className="p-8">

                    {/* --- ACCOUNT SECTION --- */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Your Account</h2>
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="name" id="name" required value={formState.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="John M. Doe"/>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" id="email" required value={formState.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="you@example.com"/>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                          <input type="password" name="password" id="password" required value={formState.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="Create a password"/>
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                          <input type="password" name="confirmPassword" id="confirmPassword" required value={formState.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="Confirm password"/>
                        </div>
                      </div>
                    </div>
                    {/* --- END ACCOUNT SECTION --- */}


                    {/* --- PAYMENT SECTION --- */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">2. Payment Method</h2>
                    
                    {/* --- Payment Method Tabs --- */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex justify-center items-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                          paymentMethod === 'card' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <CreditCardIcon />
                        <span className="text-sm sm:text-base">Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`flex justify-center items-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                          paymentMethod === 'paypal' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <PayPalIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`flex justify-center items-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                          paymentMethod === 'mpesa' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <MpesaIcon />
                      </button>
                    </div>
                    {/* --- END: Payment Method Tabs --- */}
                    
                    {/* --- Conditional Form Content --- */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-5 animate-fadeIn">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">We accept:</span>
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-kIqA-9wBxUDDSp5W_P3xPIGxnTJJst3iMA&s" alt="Visa" className="h-6 rounded" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1280px-MasterCard_Logo.svg.png" alt="Mastercard" className="h-6 rounded" />
                        </div>
                        <div>
                          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                          <input type="text" name="nameOnCard" id="nameOnCard" required value={formState.nameOnCard} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="John M. Doe"/>
                        </div>
                        <div>
                          <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <div className="relative">
                            <input type="tel" name="card" id="card" required value={formState.card} onChange={handleChange} className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="0000 0000 0000 0000"/>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><CreditCardIcon /></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expires (MM/YY)</label>
                            <input type="text" name="expiry" id="expiry" required value={formState.expiry} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="MM/YY"/>
                          </div>
                          <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                            <input type="tel" name="cvc" id="cvc" required value={formState.cvc} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="123"/>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'paypal' && (
                      <div className="animate-fadeIn text-center py-8">
                        <div className="flex justify-center"><PayPalIcon /></div>
                        <p className="text-gray-600 mt-4">
                          After clicking "Pay with PayPal", you will be redirected to PayPal to complete your purchase securely.
                        </p>
                      </div>
                    )}
                    
                    {paymentMethod === 'mpesa' && (
                      <div className="animate-fadeIn py-8">
                        <p className="text-gray-600 text-center mb-4">
                          You will receive a pop-up on your phone to complete the payment.
                        </p>
                        <div>
                          <label htmlFor="mpesaPhone" className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
                          <input
                            type="tel"
                            name="mpesaPhone"
                            id="mpesaPhone"
                            required
                            value={formState.mpesaPhone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            placeholder="e.g. 0712345678"
                          />
                        </div>
                      </div>
                    )}
                    {/* --- END: Conditional Form Content --- */}
                  </div>
                
                  {/* --- The footer is INSIDE the form --- */}
                  <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <LockIcon />
                        <span className="ml-2">Secure Payment</span>
                      </div>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="inline-flex justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : getButtonText()}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* --- Column 2: Order Summary --- */}
            <div className="lg:col-span-1">
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Selected Plan:</span>
                    <span className="font-semibold text-gray-900">{plan.name}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-gray-900 text-xl">{plan.price}<span className="text-sm font-normal text-gray-600">/mo</span></span>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-baseline">
                      <span className="text-lg font-bold text-gray-900">Total Due Today</span>
                      <span className="text-2xl font-bold text-red-600">{plan.price}</span>
                    </div>
                  </div>
                  <div className="pt-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Plan Features:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  
                  <div className="pt-6">
                    <button
                      onClick={onGoBack} 
                      className="w-full block text-center px-4 py-2 rounded-md font-medium border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      &larr; Change Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
}
export default Checkout;