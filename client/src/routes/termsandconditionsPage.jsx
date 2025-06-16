import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const TermsAndConditions = () => {
  return (
             <div>      
            <Navbar/>

            <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6   max-w-[1100px] mx-auto mt-8 md:mt-[40px]  mb-8 md:mb-[40px] px-4 md:px-[80px]"><h1 className="text-2xl md:text-4xl font-bold">Terms and Conditions of Use (the “Terms”)</h1>
<p>
  Please read these Terms carefully before accessing or using the services made available,
  accessed, published or otherwise offered through 
  <a href="https://www.shilingi.co.ke" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700"> www.shilingi.co.ke </a>
  (the "Site"). By accessing or using the Site or participating in the Shilingi game ("Game"), you agree to be bound by these Terms and our 
  <a href="https://www.shilingi.co.ke/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700"> Privacy Policy </a>.
</p>

<h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
<p>
  Shilingi is a community-based micro-contribution platform operated by Shilingi Ltd, registered in Kenya. Our platform allows individuals to contribute exactly 1 KES via mobile money (e.g., M-Pesa) for a chance to be randomly selected as a winner when the collective pool reaches 1,000,000 KES. 80% of the total pool is awarded to the winner, and 20% supports the platform and community operations.
</p>

<h2 className="text-xl font-semibold mt-6">2. Eligibility</h2>
<p>
  Participation is open to Kenyan residents aged 18 years and above, possessing a valid Safaricom number with active M-Pesa services. Each mobile number is eligible for only one entry per Game cycle. Multiple entries from the same number or use of automation/sim spoofing will lead to disqualification.
</p>

<h2 className="text-xl font-semibold mt-6">3. How to Participate</h2>
<ul className="list-disc pl-6">
  <li>Send exactly 1 KES via the provided STK Push link or mobile prompt.</li>
  <li>Your mobile number will be logged as one entry for the current Game.</li>
  <li>Once the contribution pool reaches 1,000,000 KES, no further entries will be accepted.</li>
</ul>

<h2 className="text-xl font-semibold mt-6">4. Transparency and Public Display</h2>
<p>
  For accountability, Shilingi displays a public leaderboard showing the first name, county, and last three digits of the participant’s phone number. Real-time updates of the total pool, number of participants, and estimated time to draw are also displayed.
</p>

<h2 className="text-xl font-semibold mt-6">5. Draw and Winner Selection</h2>
<p>
  The draw is automated, randomized, and auditable. A hash-based function using participant data and a blockchain or timestamp-based seed may be used to ensure fairness. One participant will be selected randomly and notified through the phone number used.
</p>
<p>
  The winner receives 80% of the total pool (800,000 KES). Payment is made to the winning number within 72 hours, subject to identity verification.
</p>

<h2 className="text-xl font-semibold mt-6">6. Platform Fee</h2>
<p>
  The remaining 20% of the pool (200,000 KES) is retained by Shilingi Ltd to cover operations, development, support services, audits, community initiatives, and promotional activities.
</p>

<h2 className="text-xl font-semibold mt-6">7. Privacy and Data</h2>
<p>
  By participating, you consent to Shilingi collecting and processing personal data such as your mobile number, name, location, and transaction ID. This data is used to verify participants, prevent fraud, and display transparency metrics. Your data is stored securely and may be shared with third-party verification or audit services.
</p>

<h2 className="text-xl font-semibold mt-6">8. Refunds and Cancellation</h2>
<p>
  Contributions are non-refundable except where a technical error, double billing, or verified fraud has occurred. Shilingi Ltd reserves the right to cancel a Game if irregularities are detected or legal conditions require it. In such cases, valid participants may receive refunds.
</p>

<h2 className="text-xl font-semibold mt-6">9. Disqualification</h2>
<p>
  You may be disqualified for:
</p>
<ul className="list-disc pl-6">
  <li>Submitting more than one entry using the same number.</li>
  <li>Using SIM swap techniques or multiple registrations.</li>
  <li>Attempting to hack, exploit, or reverse-engineer the system.</li>
  <li>Engaging in fraud or misrepresentation.</li>
</ul>

<h2 className="text-xl font-semibold mt-6">10. Intellectual Property</h2>
<p>
  All platform designs, logos, backend logic, and systems are the intellectual property of Shilingi Ltd. Reproduction or repurposing of these elements is prohibited without written consent.
</p>

<h2 className="text-xl font-semibold mt-6">11. Limitation of Liability</h2>
<p>
  Shilingi Ltd shall not be held liable for indirect, incidental, or consequential damages, nor for system delays or failures beyond its control (including M-Pesa failures, internet outages, or legal prohibitions).
</p>

<h2 className="text-xl font-semibold mt-6">12. Dispute Resolution</h2>
<p>
  In the event of a dispute, parties agree to first attempt resolution through Shilingi’s internal complaints system. If unresolved, disputes may be escalated to BCLB (Betting Control and Licensing Board) or Kenyan courts.
</p>

<h2 className="text-xl font-semibold mt-6">13. Modification of Terms</h2>
<p>
  Shilingi Ltd reserves the right to modify these Terms at any time. Changes will be communicated via the Site. Your continued use of the Site or Game after updates constitutes agreement to the revised Terms.
</p>

<h2 className="text-xl font-semibold mt-6">14. Governing Law</h2>
<p>
  These Terms are governed by the laws of Kenya. Any disputes shall be handled by competent courts in the Republic of Kenya.
</p>

<h2 className="text-xl font-semibold mt-6">15. Contact Information</h2>
<p>
  For any support or queries, contact us at:
</p>
<ul className="list-disc pl-6">
  <li>Email: help@shilingi.co.ke</li>
  <li>Phone: +254 700 000 000</li>
  <li>Website: <a href="https://www.shilingi.co.ke" className="text-blue-500 underline hover:text-blue-700">www.shilingi.co.ke</a></li>
</ul>

<p className="text-sm text-gray-500 mt-4">Last updated: June 2025</p>
</div>
          <Footer/>

          </div>

        );
      
      
  
};

export default TermsAndConditions;
