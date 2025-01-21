import React, { useRef, useEffect } from 'react';

const Paypal = ({ price, planType }) => { // Add planType prop to capture subscription type
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
              console.log('Order captured:', order);

              // Send subscription details to backend
              await fetch('/api/users/subscription', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  plan: planType, // Subscription type (e.g., "monthly", "annual")
                  price: price,    // Price of the subscription
                  orderId: order.id, // PayPal order ID for reference
                }),
              });

              alert('Payment successful! Subscription updated.');
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
  }, [price, planType]); // Ensure planType is included in the dependency array

  return <div ref={paypal}></div>;
};

export default Paypal;
