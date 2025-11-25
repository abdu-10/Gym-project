import React, { useState } from 'react';

// --- NEW STRIPE IMPORTS ---
import { 
  CardElement,      // This is the special, secure Stripe input
  useStripe,        // This is the hook to use Stripe (e.g., create a token)
  useElements       // This is the hook to get the <CardElement> data
} from '@stripe/react-stripe-js';
// --- END NEW STRIPE IMPORTS ---


// --- SVG Icons ---
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// We keep CreditCardIcon for the M-Pesa/PayPal tabs
const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const CheckIcon = () => (
  <svg className="h-12 w-12 text-green-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- Your Image Icons ---
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
// --- End of Icons ---


function Checkout({ plan, onGoBack }) {
  // --- NEW: Initialize Stripe Hooks ---
  const stripe = useStripe();
  const elements = useElements();
  // --- END NEW STRIPE HOOKS ---

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); 

  // --- UPDATED: 'card', 'expiry', 'cvc' are GONE
  const [formState, setFormState] = useState({
    name: '',            // For Account
    email: '',           // For Account
    password: '',        // For Account
    confirmPassword: '', // For Account
    nameOnCard: '',      // For Card Payment (for Stripe)
    mpesaPhone: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  
  // --- THIS IS THE FULLY UPDATED SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      setApiError("Passwords do not match!");
      return;
    }

    setIsProcessing(true);
    setApiError(null);

    // Use a try/catch block to handle all errors
    try {
      
      let stripeTokenId = null; // This will hold our safe token

      // --- 1. STRIPE TOKENIZATION STEP ---
      if (paymentMethod === 'card') {
        if (!stripe || !elements) {
          throw new Error("Stripe.js has not loaded yet. Please try again.");
        }
        const cardElement = elements.getElement(CardElement);

        const { error: tokenError, token } = await stripe.createToken(cardElement, {
          name: formState.nameOnCard,
        });

        if (tokenError) {
          throw new Error(tokenError.message);
        }
        stripeTokenId = token.id;
      }
      
      // (If method is PayPal or M-Pesa, we skip the token step)

      // --- 2. FORMAT DATA FOR RAILS ---
      const postData = {
        registration: { 
          plan: plan.name,
          account: {
            name: formState.name,
            email: formState.email,
            password: formState.password,
            password_confirmation: formState.confirmPassword,
          },
          payment: {
            method: paymentMethod,
            nameOnCard: formState.nameOnCard,
            mpesaPhone: formState.mpesaPhone,
            stripe_token: stripeTokenId, // <-- HERE IS THE TOKEN
          }
        }
      };

      // --- 3. SEND DATA TO *OUR* RAILS SERVER ---
      const response = await fetch('http://localhost:3000/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      // --- 4. ROBUST ERROR HANDLING ---
      if (!response.ok) {
        // This will now handle "Email taken" OR "Stripe token missing"
        const errorMessage = data.errors ? data.errors.join(', ') : data.error;
        throw new Error(errorMessage || 'An unknown error occurred.');
      }

      // --- 5. FINAL SUCCESS! ---
      console.log("SUCCESS:", data);
      setIsProcessing(false);
      setIsComplete(true); 

    } catch (error) {
      // --- 6. FAILURE! (From Stripe OR Rails) ---
      console.error("Error:", error);
      setIsProcessing(false);
      setApiError(error.message);
    }
  };
  
  const getButtonText = () => {
    switch (paymentMethod) {
      case 'card': return `Pay ${plan.price} & Join`;
      case 'paypal': return 'Join with PayPal';
      case 'mpesa': return 'Join with M-Pesa';
      default: return `Pay ${plan.price} & Join`;
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
            Back to Home
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
        /* --- NEW: Style for the Stripe Element --- */
        .StripeElement {
          padding: 1rem;
          border: 1px solid #d1d5db; /* border-gray-300 */
          border-radius: 0.5rem; /* rounded-lg */
          background-color: white;
        }
        .StripeElement--focus {
          border-color: #ef4444; /* border-red-500 */
          box-shadow: 0 0 0 1px #ef4444; /* ring-red-500 */
        }
        .StripeElement--invalid {
          border-color: #ef4444; /* border-red-500 */
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

      {/* --- Main Content Area (Fixed Scrollbar) --- */}
      <div className="flex-1 flex items-center overflow-auto py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* --- Column 1: Payment Form --- */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="p-8 flex-1">

                    {/* --- ACCOUNT SECTION (Unchanged) --- */}
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


                    {/* --- PAYMENT SECTION (Updated) --- */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">2. Payment Method</h2>
                    
                    {/* --- Payment Method Tabs (Unchanged) --- */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <button type="button" onClick={() => setPaymentMethod('card')} className={`flex justify-center items-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium ${paymentMethod === 'card' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}><CreditCardIcon /><span className="text-sm sm:text-base">Card</span></button>
                      <button type="button" onClick={() => setPaymentMethod('paypal')} className={`flex justify-center items-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium ${paymentMethod === 'paypal' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}><PayPalIcon /></button>
                      <button type="button" onClick={() => setPaymentMethod('mpesa')} className={`flex justify-center items-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium ${paymentMethod === 'mpesa' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}><MpesaIcon /></button>
                    </div>
                    
                    {/* --- Conditional Form Content --- */}
                    
                    {/* --- Card Form (THIS IS THE BIG CHANGE) --- */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-5 animate-fadeIn">
                        <div>
                          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                          <input type="text" name="nameOnCard" id="nameOnCard" required={paymentMethod === 'card'} value={formState.nameOnCard} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="John M. Doe"/>
                        </div>
                        
                        {/* --- THIS IS THE NEW SECURE ELEMENT --- */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Card Details
                          </label>
                          {/* This is a single component for Card Number, Expiry, and CVC */}
                          <CardElement 
                            className="StripeElement" // We use our custom styles from the <style> tag
                            options={{
                              style: {
                                base: {
                                  fontSize: '16px',
                                  color: '#111827',
                                  '::placeholder': {
                                    color: '#9ca3af',
                                  },
                                },
                                invalid: {
                                  color: '#ef4444',
                                }
                              },
                              hidePostalCode: true
                            }}
                          />
                        </div>
                        {/* --- THE OLD DUMB INPUTS (card, expiry, cvc) ARE GONE --- */}
                      </div>
                    )}
                    
                    {/* --- PayPal Form (Unchanged) --- */}
                    {paymentMethod === 'paypal' && (
                      <div className="animate-fadeIn text-center py-8">
                        <div className="flex justify-center"><PayPalIcon /></div>
                        <p className="text-gray-600 mt-4">
                          After clicking "Pay with PayPal", you will be redirected to PayPal to complete your purchase securely.
                        </p>
                      </div>
                    )}
                    
                    {/* --- M-Pesa Form (Unchanged) --- */}
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
                            required={paymentMethod === 'mpesa'}
                            value={formState.mpesaPhone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            placeholder="e.g. 0712345678"
                          />
                        </div>
                      </div>
                    )}
                    
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
                        // --- UPDATED: Disable if Stripe hasn't loaded
                        disabled={isProcessing || (paymentMethod === 'card' && (!stripe || !elements))}
                        className="inline-flex justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : getButtonText()}
                      </button>
                    </div>
                    
                    {/* --- This is where ALL errors will appear --- */}
                    {apiError && (
                      <div className="mt-4 text-center text-sm text-red-600">
                        {apiError}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* --- Column 2: Order Summary (Unchanged) --- */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-center"><span className="text-gray-600">Selected Plan:</span><span className="font-semibold text-gray-900">{plan.name}</span></div>
                  <div className="flex justify-between items-baseline"><span className="text-gray-600">Price:</span><span className="font-semibold text-gray-900 text-xl">{plan.price}<span className="text-sm font-normal text-gray-600">/mo</span></span></div>
                  <div className="pt-4 border-t border-gray-200"><div className="flex justify-between items-baseline"><span className="text-lg font-bold text-gray-900">Total Due Today</span><span className="text-2xl font-bold text-red-600">{plan.price}</span></div></div>
                  <div className="pt-6"><h4 className="text-sm font-semibold text-gray-800 mb-3">Plan Features:</h4><ul className="space-y-2">{plan.features.map((feature, idx) => ( <li key={idx} className="flex items-start text-sm"><svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-600">{feature}</span></li> ))}</ul></div>
                  <div className="pt-6 mt-auto">
                    <a href='#pricing' onClick={onGoBack} className="w-full block text-center px-4 py-2 rounded-md font-medium border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">&larr; Change Plan</a></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

    </div>
  );
}

// NOTE: This default export is here for you to test.
// We will remove it when we combine it into App.jsx
export default Checkout;