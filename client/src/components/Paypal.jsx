import React, { useRef, useEffect } from 'react';

const Paypal = ({ price }) => {
  const paypal = useRef();

  useEffect(() => {
    const loadPayPalScript = () => {
      if (!window.paypal) {
        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=AdquOIVKN9I4lW_QVdLYyPZ7On9-KwEvDk32IyE772orS4WudPfW1pVCXKHnSGFyVYzN_QdDDgDmAZcC&currency=USD";
        script.async = true;

        script.onload = () => {
          if (window.paypal) {
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
                          value: price,
                        },
                      },
                    ],
                  });
                },
                onApprove: async (data, actions) => {
                  try {
                    const order = await actions.order.capture();
                    console.log('Order captured:', order);
                    alert('Payment successful! Thank you for your purchase.');
                  } catch (err) {
                    console.error('Error capturing order:', err);
                    alert('There was an issue capturing the payment.');
                  }
                },
                onError: (err) => {
                  console.error('PayPal button error:', err);
                  alert('There was an issue loading the PayPal button.');
                },
              })
              .render(paypal.current);
          }
        };

        script.onerror = () => {
          console.error('Error loading PayPal script');
          alert('Failed to load PayPal. Please refresh the page and try again.');
        };

        document.body.appendChild(script);
      }
    };

    loadPayPalScript();
  }, [price]);

  return <div ref={paypal}></div>;
};

export default Paypal;
