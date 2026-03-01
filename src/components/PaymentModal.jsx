import React, { useState } from 'react';
import { FaCreditCard, FaMobileAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { SiPaypal } from 'react-icons/si';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalButtons } from '@paypal/react-paypal-js';

function PaymentModal({ isOpen, onClose, trainer, packageData, userId, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showResultModal, setShowResultModal] = useState(null); // 'success' or 'error'
  const [resultMessage, setResultMessage] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [nameOnCard, setNameOnCard] = useState('');

  const [mpesaData, setMpesaData] = useState({
    phoneNumber: ''
  });

  if (!isOpen) return null;

  const validateForm = () => {
    if (!selectedMethod) {
      setResultMessage('Please select a payment method');
      setShowResultModal('error');
      return false;
    }

    if (selectedMethod === 'stripe') {
      if (!stripe || !elements) {
        setResultMessage('Stripe is still loading. Please try again.');
        setShowResultModal('error');
        return false;
      }
      if (!nameOnCard.trim()) {
        setResultMessage('Please enter the name on the card');
        setShowResultModal('error');
        return false;
      }
      if (!cardComplete) {
        setResultMessage('Please complete your card details');
        setShowResultModal('error');
        return false;
      }
    }

    if (selectedMethod === 'paypal') {
      return true;
    }

    if (selectedMethod === 'mpesa') {
      if (!mpesaData.phoneNumber) {
        setResultMessage('Please enter your M-Pesa phone number');
        setShowResultModal('error');
        return false;
      }
    }

    return true;
  };

  const createPaymentAndPackage = async ({ method, transactionId, metadata = {} }) => {
    const rawPrice = packageData?.price;
    const normalizedPrice = typeof rawPrice === 'string'
      ? Number(rawPrice.replace(/[^0-9.]/g, ''))
      : Number(rawPrice);
    const amountCents = Math.round(normalizedPrice * 100);

    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      console.error('Invalid amount_cents computed from price:', rawPrice, amountCents);
      throw new Error('Invalid amount. Please reselect your package and try again.');
    }
    const paymentPayload = {
      amount: normalizedPrice,
      amount_cents: amountCents,
      method,
      payment_method: method,
      status: 'completed',
      currency: 'USD',
      transaction_id: transactionId,
      metadata
    };

    const paymentResponse = await fetch('http://localhost:3000/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...paymentPayload,
        payment: paymentPayload
      })
    });

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json().catch(() => ({}));
      console.error('Payment API Error:', paymentResponse.status, errorData);
      const apiMessage = Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.error;
      throw new Error(apiMessage || 'Payment failed. Please try again.');
    }

    const payment = await paymentResponse.json();
    console.log('Payment created:', payment);
    const paymentId = payment?.id ?? payment?.payment?.id ?? payment?.data?.id;

    if (!paymentId) {
      console.error('Payment response missing id:', payment);
      throw new Error('payment_id is required');
    }

    if (!userId) {
      throw new Error('User must exist');
    }

    const packageResponse = await fetch('http://localhost:3000/trainer_packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        user_id: userId,
        trainer_id: trainer.trainer_id,
        package_type: packageData.sessions.toString(),
        sessions_purchased: packageData.sessions,
        total_cost: packageData.price,
        payment_id: paymentId
      })
    });

    if (!packageResponse.ok) {
      const errorData = await packageResponse.json().catch(() => ({}));
      console.error('Package API Error:', packageResponse.status, errorData);
      const apiMessage = Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.error;
      throw new Error(apiMessage || 'Failed to create package. Please contact support.');
    }

    await packageResponse.json();
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setProcessing(true);

    try {
      if (selectedMethod === 'stripe') {
        const cardElement = elements.getElement(CardElement);
        const { error: tokenError, token } = await stripe.createToken(cardElement, {
          name: nameOnCard
        });

        if (tokenError) {
          throw new Error(tokenError.message);
        }

        await createPaymentAndPackage({
          method: 'stripe',
          transactionId: token.id,
          metadata: { stripe_token: token.id }
        });
      }

      if (selectedMethod === 'mpesa') {
        await createPaymentAndPackage({
          method: 'mpesa',
          transactionId: `mpesa-${Date.now()}`,
          metadata: { phone_number: mpesaData.phoneNumber }
        });
      }

      setProcessing(false);
      setResultMessage(`Payment successful! You've purchased ${packageData.sessions} sessions with ${trainer.name}.`);
      setShowResultModal('success');
    } catch (error) {
      console.error('Payment error:', error);
      setResultMessage(error.message || 'Payment failed. Please try again.');
      setShowResultModal('error');
      setProcessing(false);
    }
  };

  const createPayPalOrder = (data, actions) => {
    const priceValue = Number(packageData.price).toFixed(2);
    return actions.order.create({
      purchase_units: [
        {
          description: `FITELITE - Trainer Package (${packageData.sessions} sessions)`,
          amount: {
            currency_code: 'USD',
            value: priceValue
          }
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    });
  };

  const onPayPalApprove = async (data) => {
    setProcessing(true);
    try {
      await createPaymentAndPackage({
        method: 'paypal',
        transactionId: data.orderID,
        metadata: { paypal_order_id: data.orderID }
      });

      setProcessing(false);
      setResultMessage(`Payment successful! You've purchased ${packageData.sessions} sessions with ${trainer.name}.`);
      setShowResultModal('success');
    } catch (error) {
      console.error('PayPal error:', error);
      setResultMessage(error.message || 'PayPal payment failed. Please try again.');
      setShowResultModal('error');
      setProcessing(false);
    }
  };

  const onPayPalError = (err) => {
    console.error('PayPal Error:', err);
    setResultMessage('PayPal encountered an error. Please try again.');
    setShowResultModal('error');
  };

  const handleResultClose = () => {
    setShowResultModal(null);
    if (showResultModal === 'success') {
      onPaymentSuccess();
      onClose();
    }
  };

  return (
    <>
      {/* Main Payment Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-md bg-black/40">
        <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scale-in">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-block mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <FaCreditCard className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              Complete Your Purchase
            </h2>
            <p className="text-gray-600 text-sm">
              {packageData.sessions} sessions with {trainer.name}
            </p>
          </div>

          {/* Package Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-semibold">Package:</span>
              <span className="text-gray-900 font-black">{packageData.sessions} Sessions</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-semibold">Price per session:</span>
              <span className="text-gray-900 font-bold">${(packageData.price / packageData.sessions).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-black text-lg">Total:</span>
              <span className="text-red-600 font-black text-2xl">${packageData.price}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <p className="text-gray-700 font-bold mb-3 text-sm uppercase tracking-wide">Select Payment Method</p>
            
            {/* Stripe */}
            <div
              onClick={() => setSelectedMethod('stripe')}
              className={`flex items-center gap-4 p-4 rounded-xl mb-3 cursor-pointer transition-all ${
                selectedMethod === 'stripe'
                  ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaCreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-black text-gray-900">Credit / Debit Card</p>
                <p className="text-xs text-gray-500">Powered by Stripe</p>
              </div>
              {selectedMethod === 'stripe' && (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Stripe Form */}
            {selectedMethod === 'stripe' && (
              <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4 mb-3 animate-scale-in">
                <div className="mb-3">
                  <label className="block text-gray-700 font-bold mb-2 text-sm">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    placeholder="John M. Doe"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">
                    Card Details
                  </label>
                  <CardElement
                    className="StripeElement"
                    onChange={(event) => setCardComplete(event.complete)}
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#111827',
                          '::placeholder': { color: '#9ca3af' }
                        },
                        invalid: { color: '#ef4444' }
                      },
                      hidePostalCode: true
                    }}
                  />
                </div>
              </div>
            )}

            {/* M-Pesa */}
            <div
              onClick={() => setSelectedMethod('mpesa')}
              className={`flex items-center gap-4 p-4 rounded-xl mb-3 cursor-pointer transition-all ${
                selectedMethod === 'mpesa'
                  ? 'bg-green-50 border-2 border-green-500 shadow-md'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <FaMobileAlt className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-black text-gray-900">M-Pesa</p>
                <p className="text-xs text-gray-500">Mobile Money</p>
              </div>
              {selectedMethod === 'mpesa' && (
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* M-Pesa Form */}
            {selectedMethod === 'mpesa' && (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 mb-3 animate-scale-in">
                <div>
                  <label className="block text-gray-700 font-bold mb-2 text-sm">
                    M-Pesa Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+254 712 345 678"
                    value={mpesaData.phoneNumber}
                    onChange={(e) => setMpesaData({ ...mpesaData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none font-semibold"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    You'll receive a payment prompt on your phone
                  </p>
                </div>
              </div>
            )}

            {/* PayPal */}
            <div
              onClick={() => setSelectedMethod('paypal')}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                selectedMethod === 'paypal'
                  ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <SiPaypal className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-black text-gray-900">PayPal</p>
                <p className="text-xs text-gray-500">Fast & Secure</p>
              </div>
              {selectedMethod === 'paypal' && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* PayPal Form */}
            {selectedMethod === 'paypal' && (
              <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4 mb-3 animate-scale-in">
                <div className="mb-4 text-center text-sm text-gray-600">
                  Click the PayPal button below to complete your payment securely.
                </div>
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'pay'
                  }}
                  createOrder={createPayPalOrder}
                  onApprove={onPayPalApprove}
                  onError={onPayPalError}
                  disabled={processing}
                />
                {processing && (
                  <div className="mt-4 text-center text-sm text-gray-600">
                    Processing your payment...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!selectedMethod || processing || selectedMethod === 'paypal'}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? '⏳ Processing...' : selectedMethod === 'paypal' ? 'Use PayPal button below' : `Pay $${packageData.price}`}
            </button>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-scaleIn">
            {/* Header */}
            <div className={`px-6 py-5 ${
              showResultModal === 'success' 
                ? 'bg-gradient-to-r from-green-600 via-green-500 to-green-600' 
                : 'bg-gradient-to-r from-red-600 via-red-500 to-red-600'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {showResultModal === 'success' ? (
                    <FaCheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <FaTimesCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wide">
                  {showResultModal === 'success' ? 'Payment Successful' : 'Payment Failed'}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-8">
              <p className="text-gray-700 text-base leading-relaxed font-semibold">
                {resultMessage}
              </p>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={handleResultClose}
                className={`px-6 py-3 text-white font-bold rounded-xl transition-all hover:scale-105 transform shadow-lg hover:shadow-xl ${
                  showResultModal === 'success'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                }`}
              >
                {showResultModal === 'success' ? 'Continue' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .StripeElement {
          padding: 0.9rem 1rem;
          border: 2px solid #d1d5db;
          border-radius: 0.75rem;
          background-color: white;
          font-weight: 600;
        }

        .StripeElement--focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb;
        }

        .StripeElement--invalid {
          border-color: #ef4444;
        }
      `}</style>
    </>
  );
}

export default PaymentModal;
