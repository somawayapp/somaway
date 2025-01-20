import React from 'react';
import { useLocation } from 'react-router-dom';
import Paypal from '../components/Paypal';

const SubscriptionPage = () => {
  const location = useLocation();
  const { planPrice, planName } = location.state || {};

  React.useEffect(() => {
    if (planPrice && planName) {
      console.log(`Plan Selected: ${planName}, Price: $${planPrice}`);
    }
  }, [planPrice, planName]);

  if (!planPrice || !planName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 text-lg">No plan selected. Please go back and select a subscription plan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Checkout</h1>
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold text-gray-700">Subscription Plan:</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{planName}</p>
          <p className="text-lg text-gray-500 mt-4">Price:</p>
          <p className="text-2xl font-bold text-green-600">${planPrice}</p>
        </div>
        <div className="mt-6">
          <p className="text-gray-600 text-sm text-center">
            Complete your subscription by securely paying via PayPal.
          </p>
          <div className="mt-4">
            <Paypal price={planPrice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
