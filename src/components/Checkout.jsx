import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalButtons } from '@paypal/react-paypal-js';

// --- ICONS ---
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const ChipIcon = () => (
  <svg width="40" height="30" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90 shadow-sm">
    <rect width="45" height="35" rx="6" fill="#fbbf24"/>
    <path d="M0 11H11V24H0" stroke="#b45309" strokeWidth="1.5"/>
    <path d="M34 11H45V24H34" stroke="#b45309" strokeWidth="1.5"/>
    <path d="M11 0V35" stroke="#b45309" strokeWidth="1.5"/>
    <path d="M34 0V35" stroke="#b45309" strokeWidth="1.5"/>
    <rect x="16" y="9" width="13" height="17" rx="3" stroke="#b45309" strokeWidth="1.5"/>
  </svg>
);

const ContactlessIcon = () => (
  <svg className="h-8 w-8 text-white opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008zm-3 3h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008zm1.5 0h.008v.008h-.008v-.008z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PayPalIcon = () => (
  <img src="https://www.nopcommerce.com/images/thumbs/0015909_paypal-standard.png" alt="PayPal" className="h-6 w-auto rounded-sm" />
);

const MpesaIcon = () => (
  <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/M-PESA.png" alt="M-Pesa" className="h-6 w-auto rounded-sm" />
);

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

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-800 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

function Checkout({ plan, onGoBack, onLogin }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card'); 

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
    nameOnCard: '',
    mpesaPhone: '', 
  });

  // --- STYLE HELPER: UPDATED FOR GOLD ELITE CARD ---
  const getCardStyle = (planName) => {
    // ELITE: Rich Gold Gradient + Gold Shadow
    if (planName === 'Elite') {
        return 'bg-gradient-to-br from-yellow-700 via-yellow-600 to-amber-800 border-yellow-500 shadow-2xl shadow-yellow-600/30';
    }
    // PREMIUM: Red
    if (planName === 'Premium') {
        return 'bg-gradient-to-br from-red-700 via-red-600 to-red-900 border-red-500 shadow-2xl';
    }
    // STANDARD: Blue
    return 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 border-blue-500 shadow-2xl';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormState(prevState => ({ 
        ...prevState, 
        profilePhoto: e.target.files[0] 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      setApiError("Passwords do not match!");
      return;
    }

    setIsProcessing(true);
    setApiError(null);

    try {
      let stripeTokenId = null;

      if (paymentMethod === 'card') {
        if (!stripe || !elements) throw new Error("Stripe not loaded");
        const cardElement = elements.getElement(CardElement);
        const { error: tokenError, token } = await stripe.createToken(cardElement, {
          name: formState.nameOnCard,
        });
        if (tokenError) throw new Error(tokenError.message);
        stripeTokenId = token.id;
      }

      const formData = new FormData();
      formData.append('registration[plan]', plan.name);
      formData.append('registration[account][name]', formState.name);
      formData.append('registration[account][email]', formState.email);
      formData.append('registration[account][password]', formState.password);
      formData.append('registration[account][password_confirmation]', formState.confirmPassword);
      
      if (formState.profilePhoto) {
        formData.append('registration[account][profile_photo]', formState.profilePhoto);
      }

      formData.append('registration[payment][method]', paymentMethod);
      formData.append('registration[payment][nameOnCard]', formState.nameOnCard);
      formData.append('registration[payment][mpesaPhone]', formState.mpesaPhone);
      
      if (stripeTokenId) {
        formData.append('registration[payment][stripe_token]', stripeTokenId);
      }

      const response = await fetch('http://localhost:3000/registrations', {
        method: 'POST',
        credentials: 'include',
        body: formData, 
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.errors ? data.errors.join(', ') : data.error;
        throw new Error(errorMessage || 'An unknown error occurred.');
      }

      console.log("SUCCESS:", data);
      setIsProcessing(false);
      setIsComplete(true);
      
      // Auto-login: If the backend returns user data, log the user in
      if (onLogin && data.user) {
        onLogin(data.user);
      } 

    } catch (error) {
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

  // --- PAYPAL: Create Order ---
  const createPayPalOrder = (data, actions) => {
    // Extract numeric price from plan.price (e.g., "$49" -> "49.00")
    const priceValue = plan.price.replace(/[^0-9.]/g, '');
    
    return actions.order.create({
      purchase_units: [
        {
          description: `FITELITE - ${plan.name} Membership`,
          amount: {
            currency_code: "USD",
            value: priceValue,
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  // --- PAYPAL: On Approve (User approved payment) ---
  const onPayPalApprove = async (data) => {
    // Validate form fields before processing
    if (!formState.name || !formState.email || !formState.password || !formState.confirmPassword) {
      setApiError("Please fill in all account fields before completing payment.");
      return;
    }
    
    if (formState.password !== formState.confirmPassword) {
      setApiError("Passwords do not match!");
      return;
    }

    setIsProcessing(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append('registration[plan]', plan.name);
      formData.append('registration[account][name]', formState.name);
      formData.append('registration[account][email]', formState.email);
      formData.append('registration[account][password]', formState.password);
      formData.append('registration[account][password_confirmation]', formState.confirmPassword);
      
      if (formState.profilePhoto) {
        formData.append('registration[account][profile_photo]', formState.profilePhoto);
      }

      formData.append('registration[payment][method]', 'paypal');
      formData.append('registration[payment][paypal_order_id]', data.orderID);

      const response = await fetch('http://localhost:3000/registrations', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.errors ? responseData.errors.join(', ') : responseData.error;
        throw new Error(errorMessage || 'An unknown error occurred.');
      }

      console.log("SUCCESS:", responseData);
      setIsProcessing(false);
      setIsComplete(true);
      
      // Auto-login: If the backend returns user data, log the user in
      if (onLogin && responseData.user) {
        onLogin(responseData.user);
      }

    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
      setApiError(error.message);
    }
  };

  // --- PAYPAL: On Error ---
  const onPayPalError = (err) => {
    console.error("PayPal Error:", err);
    setApiError("PayPal encountered an error. Please try again.");
  };

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
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .StripeElement { padding: 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background-color: white; }
        .StripeElement--focus { border-color: #ef4444; box-shadow: 0 0 0 1px #ef4444; }
        .StripeElement--invalid { border-color: #ef4444; }
      `}</style>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-extrabold text-gray-900">FIT<span className="text-red-500">ELITE</span></span>
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <div className="p-8 flex-1">

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Create Your Digital ID</h2>
                    
                    {/* --- THE CARD & UPLOAD SECTION --- */}
                    <div className="mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center md:justify-start">
                            
                            {/* --- THE LEGIT CARD PREVIEW (Fixed Width 320px) --- */}
                            <div className="flex-shrink-0 relative">
                                {/* This div locks the size to exactly 320px wide */}
                                <div className={`w-[320px] h-[200px] rounded-xl p-5 relative overflow-hidden transition-all duration-500 shadow-xl ${getCardStyle(plan.name)}`}>
                                    
                                    {/* Glossy Overlay/Effects */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>

                                    <div className="relative z-10 h-full flex flex-col justify-between text-white">
                                        
                                        {/* Row 1: Logo & Contactless */}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-extrabold tracking-tight italic">
                                                    FIT<span className="text-red-500">ELITE</span>
                                                </h3>
                                                <p className="text-[8px] opacity-80 uppercase tracking-[0.25em] mt-0.5 ml-0.5">
                                                    {plan.name} PASS
                                                </p>
                                            </div>
                                            <ContactlessIcon />
                                        </div>

                                        {/* Row 2: Chip */}
                                        <div className="flex items-center pl-1">
                                            <ChipIcon />
                                        </div>

                                        {/* Row 3: Details & Photo */}
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-0.5">
                                                <p className="text-[7px] uppercase tracking-widest opacity-60">Cardholder</p>
                                                <p className="font-medium text-xs tracking-wide shadow-black drop-shadow-md uppercase truncate max-w-[120px]">
                                                    {formState.name || "YOUR NAME"}
                                                </p>
                                                <p className="text-[9px] font-mono opacity-80 tracking-wider">
                                                    xxxx-xxxx-xxxx-0001
                                                </p>
                                            </div>
                                            
                                            {/* Photo Box: Portrait Aspect Ratio */}
                                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-0.5 rounded-md h-[70px] w-[55px] flex items-center justify-center overflow-hidden">
                                                {formState.profilePhoto ? (
                                                    <img 
                                                        src={URL.createObjectURL(formState.profilePhoto)} 
                                                        alt="ID Face" 
                                                        className="h-full w-full object-cover rounded-[3px]" 
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-300/50 flex flex-col items-center justify-center rounded-[3px]">
                                                        <svg className="h-6 w-6 text-white/70" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center text-[10px] text-gray-400 mt-2 uppercase tracking-wide">Digital Access Card Preview</p>
                            </div>

                            {/* --- THE INPUTS & SERIOUS WARNING --- */}
                            <div className="flex-1 w-full max-w-xs">
                                
                                {/* --- SERIOUS WARNING BOX --- 
                                  Red background, bold text, "NO REFUNDS" warning.
                                */}
                                <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-5 rounded-r-md">
                                    <div className="flex gap-3">
                                        <AlertIcon />
                                        <div>
                                            <h4 className="text-xs font-bold text-red-800 uppercase mb-1">
                                                Facial Recognition Required
                                            </h4>
                                            <p className="text-[11px] text-red-700 leading-tight">
                                                You must upload a <strong>real, clear selfie</strong>. Our system uses facial recognition for entry. 
                                            </p>
                                            <p className="text-[11px] font-bold text-red-800 mt-2 underline">
                                                Fake photos or avatars will result in denied entry and NO REFUNDS.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                            Take Selfie / Upload Photo
                                        </label>
                                        
                                        {/* capture="user" forces the selfie camera on mobile.
                                          accept="image/*" ensures only images are selected.
                                        */}
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            capture="user" 
                                            onChange={handleFileChange}
                                            className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer border border-gray-300 rounded-md bg-white"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            *Mobile: Opens front camera automatically.
                                        </p>
                                    </div>
                                    <div>
                                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                            Name on Card
                                         </label>
                                         <input type="text" name="name" required value={formState.name} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500" placeholder="e.g. John Doe"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ------------------------------------------- */}

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Account Credentials</h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" required value={formState.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="you@example.com"/>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                          <input type="password" name="password" required value={formState.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"/>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                          <input type="password" name="confirmPassword" required value={formState.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"/>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-10">3. Payment Method</h2>
                    
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <button type="button" onClick={() => setPaymentMethod('card')} className={`flex justify-center items-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium ${paymentMethod === 'card' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}><CreditCardIcon /><span className="text-sm sm:text-base">Card</span></button>
                      <button type="button" onClick={() => setPaymentMethod('paypal')} className={`flex justify-center items-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium ${paymentMethod === 'paypal' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}><PayPalIcon /></button>
                      <button type="button" onClick={() => setPaymentMethod('mpesa')} className={`flex justify-center items-center space-x-2 px-4 py-3 rounded-lg border-2 font-medium ${paymentMethod === 'mpesa' ? 'border-red-600 text-red-600 bg-red-50' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}><MpesaIcon /></button>
                    </div>
                    
                    {paymentMethod === 'card' && (
                      <div className="space-y-5 animate-fadeIn">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                          <input type="text" name="nameOnCard" required={paymentMethod === 'card'} value={formState.nameOnCard} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="John M. Doe"/>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Card Details</label>
                          <CardElement 
                            className="StripeElement" 
                            options={{
                              style: {
                                base: { fontSize: '16px', color: '#111827', '::placeholder': { color: '#9ca3af' } },
                                invalid: { color: '#ef4444' }
                              },
                              hidePostalCode: true
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'paypal' && (
                      <div className="animate-fadeIn py-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-center mb-4">
                            <PayPalIcon />
                            <span className="ml-2 text-gray-700 font-medium">Pay securely with PayPal</span>
                          </div>
                          <p className="text-sm text-gray-500 text-center mb-4">
                            Complete your account details above, then click the PayPal button to finish your purchase.
                          </p>
                          <PayPalButtons
                            style={{
                              layout: "vertical",
                              color: "blue",
                              shape: "rect",
                              label: "pay",
                            }}
                            createOrder={createPayPalOrder}
                            onApprove={onPayPalApprove}
                            onError={onPayPalError}
                            disabled={isProcessing}
                          />
                          {isProcessing && (
                            <div className="mt-4 text-center">
                              <p className="text-gray-600">Processing your payment...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'mpesa' && (
                      <div className="animate-fadeIn py-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
                          <input type="tel" name="mpesaPhone" required={paymentMethod === 'mpesa'} value={formState.mpesaPhone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" placeholder="e.g. 0712345678"/>
                        </div>
                      </div>
                    )}
                    
                  </div>
                
                  <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <LockIcon />
                        <span className="ml-2">Secure Payment</span>
                      </div>
                      <button
                        type="submit"
                        disabled={isProcessing || (paymentMethod === 'card' && (!stripe || !elements))}
                        className="inline-flex justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : getButtonText()}
                      </button>
                    </div>
                    {apiError && <div className="mt-4 text-center text-sm text-red-600">{apiError}</div>}
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-center"><span className="text-gray-600">Selected Plan:</span><span className="font-semibold text-gray-900">{plan.name}</span></div>
                  <div className="flex justify-between items-baseline"><span className="text-gray-600">Price:</span><span className="font-semibold text-gray-900 text-xl">{plan.price}<span className="text-sm font-normal text-gray-600">/mo</span></span></div>
                  <div className="pt-4 border-t border-gray-200"><div className="flex justify-between items-baseline"><span className="text-lg font-bold text-gray-900">Total Due Today</span><span className="text-2xl font-bold text-red-600">{plan.price}</span></div></div>
                  <div className="pt-6"><h4 className="text-sm font-semibold text-gray-800 mb-3">Plan Features:</h4><ul className="space-y-2">{plan.features.map((feature, idx) => ( <li key={idx} className="flex items-start text-sm"><svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-gray-600">{feature}</span></li> ))}</ul></div>
                  <div className="pt-6 mt-auto"><a href='#pricing' onClick={onGoBack} className="w-full block text-center px-4 py-2 rounded-md font-medium border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">&larr; Change Plan</a></div>
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
