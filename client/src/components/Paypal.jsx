import React, { useRef, useEffect } from 'react';

const Paypal = ({ price, planType, token }) => {
  const paypal = useRef();

  useEffect(() => {
    const loadPayPalScript = () => {
      if (!document.querySelector('script[src*="paypal.com"]')) {
        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=AdquOIVKN9I4lW_QVdLYyPZ7On9-KwEvDk32IyE772orS4WudPfW1pVCXKHnSGFyVYzN_QdDDgDmAZcC&currency=USD";
        script.async = true;

        script.onload = () => {
          if (window.paypal) {
            initializePayPalButtons();
          }
        };

        script.onerror = () => {
          console.error('Failed to load PayPal script');
          alert('PayPal failed to load. Please refresh the page.');
        };

        document.body.appendChild(script);
      } else if (window.paypal) {
        initializePayPalButtons();
      }
    };

    const initializePayPalButtons = () => {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  description: 'Subscription Plan',
                  amount: {
                    currency_code: 'USD',
                    value: price || '0.00',
                  },
                },
              ],
            });
          },

          onApprove: async (data, actions) => {
            try {
              const order = await actions.order.capture();

              const response = await fetch(`${import.meta.env.VITE_API_URL}/subscriptions/update-from-payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                  plan: planType,
                  price: price,
                }),
              });

              const result = await response.json();

              if (response.ok) {
                alert('Payment successful! Subscription updated.');
              } else {
                console.error('Failed to update subscription:', result);
                alert('Failed to update subscription.');
              }
            } catch (err) {
              console.error('Error capturing order:', err);
              alert('Payment capture failed.');
            }
          },

          onError: (err) => {
            console.error('PayPal button error:', err);
            alert('Error loading PayPal button.');
          },
        })
        .render(paypal.current);
    };

    loadPayPalScript();
  }, [price, planType, token]);

  return <div ref={paypal}></div>;
};

export default Paypal;
