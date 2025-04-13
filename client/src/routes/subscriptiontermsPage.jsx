import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const SubscriptionTerms = () => {
  return (
    <div>
      <Navbar />

      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[40px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-2xl md:text-4xl font-bold">Subscription Terms and Conditions</h1>

        <p>
          These Subscription Terms and Conditions (the “Subscription Terms”) govern your purchase and use of any subscription services (the “Subscription(s)”) offered by [Your Company Name] (referred to as “we”, “us”, or “our”) through our website [Your Website URL] (the “Site”). By purchasing a Subscription, you agree to be bound by these Subscription Terms, as well as our general <a href="/terms-and-conditions" className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">Terms and Conditions of Use</a> and our <a href="/privacy-policy" className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">Privacy Policy</a>, all of which are incorporated herein by reference.
        </p>

        <h2 className="text-xl font-semibold">Subscription Plans and Pricing</h2>
        <p>
          We offer various Subscription plans with different features and benefits, as detailed on our Site. The pricing for each Subscription plan is clearly displayed on the Site and may be subject to change. We will provide reasonable notice of any changes to Subscription fees.
        </p>

        <h2 className="text-xl font-semibold">Billing and Payment</h2>
        <p>
          By selecting a Subscription plan, you agree to pay the applicable fees as described on the Site at the time of purchase. Unless otherwise stated, all fees are in [Currency] and are exclusive of any applicable taxes.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Payment will be processed using the payment method you provide during the subscription process. You represent and warrant that you have the legal right to use the payment method you provide.</li>
          <li>For recurring subscriptions, your Subscription will automatically renew at the end of each billing cycle (e.g., monthly, annually) unless you cancel it before the renewal date.</li>
          <li>You authorize us to charge the applicable Subscription fees for each renewal period to your designated payment method.</li>
          <li>If your payment method fails, we may suspend or terminate your Subscription until payment is successfully processed.</li>
          <li>You are responsible for keeping your billing information current and accurate. You can update your payment details through your account settings on the Site.</li>
        </ul>

        <h2 className="text-xl font-semibold">Subscription Term and Renewal</h2>
        <p>
          The term of your Subscription will depend on the plan you choose (e.g., monthly, annually). Unless you cancel your Subscription, it will automatically renew for the same period as your initial term.
        </p>

        <h2 className="text-xl font-semibold">Cancellation</h2>
        <p>
          You can cancel your Subscription at any time through your account settings on the Site. The cancellation will be effective at the end of your current billing cycle. You will continue to have access to the Subscription services until the end of that period.
        </p>
        <p>
          We may also cancel or suspend your Subscription at any time for reasons including, but not limited to, violation of these Subscription Terms or our Terms and Conditions of Use. In such cases, we will make reasonable efforts to notify you.
        </p>

        <h2 className="text-xl font-semibold">Refunds</h2>
        <p>
          Unless explicitly stated in a specific Subscription offer or as required by applicable law, Subscription fees are non-refundable. We do not provide refunds or credits for any partial subscription periods or unused services.
        </p>

        <h2 className="text-xl font-semibold">Changes to Subscription Plans and Pricing</h2>
        <p>
          We reserve the right to modify our Subscription plans, features, and pricing at any time. We will provide you with reasonable advance notice of any material changes. Your continued use of the Subscription services after the effective date of such changes constitutes your acceptance of the modified Subscription Terms and pricing.
        </p>

        <h2 className="text-xl font-semibold">Termination</h2>
        <p>
          We may terminate your Subscription immediately without notice if you breach these Subscription Terms or our Terms and Conditions of Use. Upon termination, your access to the Subscription services will cease.
        </p>

        <h2 className="text-xl font-semibold">Support</h2>
        <p>
          Information about customer support for our Subscriptions can be found on our Site's help or support pages.
        </p>

        <h2 className="text-xl font-semibold">Governing Law</h2>
        <p>
          These Subscription Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in [Your City, Your Country/State] to resolve any disputes arising out of or relating to these Subscription Terms or your Subscription.
        </p>

        <p><strong>Last updated:</strong> [Date]</p>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionTerms;