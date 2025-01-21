import React, { useEffect, useRef, useCallback } from 'react';

const Paypal = ({ price = '0.00', planType, token }) => {
  const paypal = useRef(null);
  const isPayPalScriptLoaded = useRef(false);

  const initializePayPalButtons = useCallback(() => {
    if (!window.paypal) return;

    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Subscription Plan',
                amount: { currency_code: 'USD', value: price },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          try {
            const order = await actions.order.capture();
            console.log('Order captured:', order);

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
              const error = await response.json();
              alert(`Failed to update subscription: ${error.message || 'Unknown error'}`);
            }
          } catch (error) {
            console.error('Error processing subscription update:', error);
            alert('Error processing subscription update.');
          }
        },
        onError: (err) => {
          console.error('PayPal button error:', err);
          alert('Error loading PayPal button.');
        },
      })
      .render(paypal.current);
  }, [price, planType, token]);

  const loadPayPalScript = useCallback(() => {
    if (isPayPalScriptLoaded.current) {
      initializePayPalButtons();
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://www.paypal.com/sdk/js?client-id=AdquOIVKN9I4lW_QVdLYyPZ7On9-KwEvDk32IyE772orS4WudPfW1pVCXKHnSGFyVYzN_QdDDgDmAZcC&currency=USD';
    script.async = true;

    script.onload = () => {
      isPayPalScriptLoaded.current = true;
      initializePayPalButtons();
    };

    script.onerror = () => {
      console.error('PayPal script failed to load.');
      alert('PayPal failed to load.');
    };

    document.body.appendChild(script);
  }, [initializePayPalButtons]);

  useEffect(() => {
    if (window.paypal) {
      initializePayPalButtons();
    } else {
      loadPayPalScript();
    }
  }, [initializePayPalButtons, loadPayPalScript]);

  return <div ref={paypal}></div>;
};

export default Paypal;
