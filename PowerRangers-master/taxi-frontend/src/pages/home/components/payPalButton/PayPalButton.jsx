import React, { useEffect } from "react";

const PayPalButton = ({ amount, onSuccess }) => {
  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

    if (!clientId) {
      console.error("PayPal Client ID is missing");
      return;
    }

    const paypalContainer = document.getElementById("paypal-button-container");
    if (!paypalContainer) {
      console.error("PayPal button container not found");
      return;
    }

    // Load the PayPal script only if the container exists
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=CAD&disable-funding=card`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amount,
                    },
                  },
                ],
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then((details) => {
                onSuccess(details);
              });
            },
            onError: (err) => {
              console.error("PayPal payment error:", err);
              alert("An error occurred during payment. Please try again.", err);
            },
          })
          .render("#paypal-button-container");
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [amount, onSuccess]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
