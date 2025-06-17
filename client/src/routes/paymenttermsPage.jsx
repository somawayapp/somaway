import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PaymentTerms = () => {
  return (
    <div>
      <Navbar />
      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[40px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-2xl md:text-4xl font-bold">Winner Payment Terms and Conditions</h1>
        <p><strong>Effective Date:</strong> June 2025<br /><strong>Last Updated:</strong> June 16, 2025</p>

        <h2 className="text-xl font-semibold">1. Overview</h2>
        <p>
          This document outlines the terms and conditions under which Shilingi Ltd will disburse winnings to the selected participant (“Winner”) once a Game cycle has reached its goal of 1,000,000 KES in total contributions. These terms are part of the overall Terms and Conditions agreed to upon participation in the Game.
        </p>

        <h2 className="text-xl font-semibold">2. Eligibility for Payment</h2>
        <p>
          Only participants who:
        </p>
        <ul className="list-disc pl-6">
          <li>Made a valid 1 KES contribution via M-Pesa</li>
          <li>Were selected through the automated and randomized draw process</li>
          <li>Pass identity and eligibility verification checks</li>
        </ul>
        <p>...shall be considered the “Winner” and eligible for payout.</p>

        <h2 className="text-xl font-semibold">3. Payment Amount</h2>
        <p>
          The Winner is entitled to receive <strong>80% of the total Game pool</strong>, which is 800,000 KES if the full 1,000,000 KES is reached. The payout is fixed and not subject to negotiation.
        </p>

        <h2 className="text-xl font-semibold">4. Verification Requirements</h2>
        <p>
          Prior to payment, the Winner must complete a verification process. This may include:
        </p>
        <ul className="list-disc pl-6">
          <li>Presenting a valid national ID or passport</li>
          <li>Verifying ownership of the M-Pesa number used to participate</li>
          <li>Completing a short winner declaration form</li>
        </ul>
        <p>
          Failure to complete verification within <strong>72 hours</strong> may result in disqualification and a redraw.
        </p>

        <h2 className="text-xl font-semibold">5. Disbursement Method</h2>
        <p>
          Payouts will be made via <strong>M-Pesa to the same number</strong> used during entry. No alternative payment channels will be used unless the original number is permanently inactive and verified as such.
        </p>

        <h2 className="text-xl font-semibold">6. Disbursement Timeline</h2>
        <p>
          Funds will be transferred within <strong>72 hours after successful verification</strong>. Weekends and public holidays may cause slight delays, but Shilingi Ltd will make reasonable efforts to ensure prompt disbursement.
        </p>

        <h2 className="text-xl font-semibold">7. Taxes and Deductions</h2>
        <p>
          In compliance with Kenyan law, a <strong>15% withholding tax</strong> may be applied on winnings exceeding the legally defined threshold. Shilingi Ltd is responsible for remitting such taxes to the Kenya Revenue Authority (KRA).
        </p>

        <h2 className="text-xl font-semibold">8. Disqualification of Winner</h2>
        <p>
          A selected winner may be disqualified if:
        </p>
        <ul className="list-disc pl-6">
          <li>They cannot prove ownership of the phone number used</li>
          <li>They fail to complete verification within the timeline</li>
          <li>Fraud, automation, or tampering is detected</li>
        </ul>
        <p>In such cases, a redraw will occur and a new winner will be selected.</p>

        <h2 className="text-xl font-semibold">9. Public Acknowledgement</h2>
        <p>
          By accepting the prize, the Winner consents to their first name, county, and last three digits of their phone number being displayed publicly on the Shilingi website and social media platforms for transparency and promotional purposes.
        </p>

        <h2 className="text-xl font-semibold">10. Disputes</h2>
        <p>
          Any disputes regarding winner selection or payout must first be raised through our internal support system. If unresolved, disputes may be referred to the Betting Control and Licensing Board (BCLB) or adjudicated by a Kenyan court.
        </p>

        <h2 className="text-xl font-semibold">11. No Guarantees or Liabilities</h2>
        <p>
          Shilingi Ltd does not guarantee payout in cases of legal prohibition, catastrophic failure, or systemic fraud. In such rare events, efforts will be made to refund verified entries proportionally or rerun the Game cycle.
        </p>

        <h2 className="text-xl font-semibold">12. Contact</h2>
        <p>For payout-related concerns, contact:</p>
        <ul className="list-disc pl-6">
          <li>Email: winnings@shilingi.co.ke</li>
          <li>Phone: +254 700 000 000</li>
        </ul>

        <p className="text-sm text-gray-500 mt-4">Last updated: June 2025</p>
      </div>
      <Footer />
    </div>
  );
};
export default PaymentTerms;