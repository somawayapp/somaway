import React, { useEffect, useRef } from 'react';

const Paypal = ({ price, planType, token }) => {
  const paypal = useRef();

  useEffect(() => {
    const initializePayPalButtons = () => {
      window.paypal
        .Buttons({
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  description: 'Subscription Plan',
                  amount: { currency_code: 'USD', value: price || '0.00' },
                },
              ],
            }),
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            try {
              const response = await fetch(
                `${import.meta.env.VITE_API_URL}/subscriptions/update-from-payment`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ plan: planType, price }),
                }
              );

              if (response.ok) {
                alert('Payment successful! Subscription updated.');
              } else {
                alert('Failed to update subscription.');
              }
            } catch {
              alert('Error processing subscription update.');
            }
          },
          onError: () => alert("Error loading PayPal button."),
        })
        .render(paypal.current);
    };

    const loadPayPalScript = () => {
      const script = document.createElement('script');
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AdquOIVKN9I4lW_QVdLYyPZ7On9-KwEvDk32IyE772orS4WudPfW1pVCXKHnSGFyVYzN_QdDDgDmAZcC&currency=USD";
      script.async = true;
      script.onload = initializePayPalButtons;
      script.onerror = () => alert("PayPal failed to load.");
      document.body.appendChild(script);
    };

    if (!window.paypal) loadPayPalScript();
    else initializePayPalButtons();
  }, [price, planType, token]);

  return <div ref={paypal}></div>;
};

export default Paypal;
