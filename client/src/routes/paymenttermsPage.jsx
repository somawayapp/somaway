import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PaymentTerms = () => {
  return (
    <div>

      
  <div
    style={{ zIndex: 100004 }}
    className="md:px-[5%] bg-[var(--bg)] px-4 sticky top-0 justify-between flex py-4 flex-row text-xs"
  >
    <div className="gap-2 md:gap-6 flex flex-row">
      <p className="text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">Home</p>
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Terms</p>
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">About</p>
    </div>
    <div className="gap-2 md:gap-6 flex flex-row">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Responsible playing</p>
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p>
    </div>
  </div>

      <Navbar />



      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[110px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-2xl md:text-4xl font-bold">Winner Payment Terms and Conditions</h1>
        <p><strong>Effective Date:</strong> June 2025<br /><strong>Last Updated:</strong> June 26, 2025</p>

        <h2 className="text-xl font-semibold">1. Overview</h2>
        <p>
          This document outlines the terms and conditions under which Shilingi will disburse winnings to the selected participant (“Winner”) once a cycle has reached its goal of 1,000,000 KES in total contributions. These terms are part of the overall Terms and Conditions agreed to upon participation in the initiative.
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
          The Winner is entitled to receive <strong>80% of the total pool</strong>, which is 800,000 KES if the full 1,000,000 KES is reached. The payout is fixed and not subject to negotiation.
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
          Failure to complete verification within <strong>7 days</strong> may result in disqualification and a redraw.
        </p>

        <h2 className="text-xl font-semibold">5. Disbursement Method</h2>
        <p>
          Payouts will be made via <strong>M-Pesa to the same number</strong> used during entry. Alternative payment channels will be used if any challenges are faced with the mobile trasanction.
        </p>

        <h2 className="text-xl font-semibold">6. Disbursement Timeline</h2>
        <p>
          Funds will be transferred within <strong>7 days after successful verification</strong>. Weekends and public holidays may cause slight delays, but Shilingi will make reasonable efforts to ensure prompt disbursement.
        </p>

        <h2 className="text-xl font-semibold">7. Taxes and Deductions</h2>
        <p>
          In compliance with Kenyan law, a <strong>withholding tax</strong> may be applied on winnings exceeding the legally
           defined threshold.Taxes, if applicable, are the responsibility of the winner.
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
          By accepting the prize, the Winner consents to their legal name, and last partially hidden digits of their phone number being displayed publicly on the Shilingi website and social media platforms for transparency and promotional purposes.
        </p>

        <h2 className="text-xl font-semibold">10. Disputes</h2>
        <p>
          Any disputes regarding winner selection or payout must first be raised through our internal support system. If unresolved, disputes may be referred to the legal bodies.
        </p>

        <h2 className="text-xl font-semibold">11. No Guarantees or Liabilities</h2>
        <p>
          Shilingi does not guarantee payout in cases of legal prohibition, catastrophic failure, or systemic fraud. In such rare events, efforts will be made to refund verified entries proportionally or rerun the cycle.
        </p>

        <h2 className="text-xl font-semibold">12. Contact</h2>
        <p>For payout-related concerns, contact:</p>
        <ul className="list-disc pl-6">
            <li>Email: shilingi@gmail.com</li>
            <li>Phone: +254 703 394 794</li>
          </ul>


        <p className="text-sm text-gray-500 mt-4">Last updated: June 2025</p>
      </div>
      <Footer />
    </div>
  );
};
export default PaymentTerms;