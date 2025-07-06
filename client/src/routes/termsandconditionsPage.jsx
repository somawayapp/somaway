import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { Helmet } from "react-helmet";



const TermsAndConditions = () => {
  return (
    <div>

      <Helmet>
  <title>Shilingi: Every Shilling Counts - Bringing Back the Value of a Shilling</title>

  <meta
    name="description"
    content="Shilingi is a fun and trusted micro-contribution and reward platform. Toss in your little bit to make a big difference, empower communities, and stand a chance to change lives. Built on transparency and teamwork."
  />

  <meta
    name="keywords"
    content="micro-contribution, community empowerment, reward platform, shilingi, crowdfunding, social giving, collective impact, small contributions, big difference, trust, transparency, teamwork, fun contributions, life-changing, community building, digital giving, peer-to-peer giving, grassroots funding, shared prosperity, collective action, social impact, online community, mutual support, participation, financial inclusion, digital rewards, community fund, easy giving, secure contributions, positive change"
  />
</Helmet>
      
<div
  style={{ zIndex: 100004 }}
  className="md:px-[5%] bg-[var(--bg)] px-4 sticky top-0 justify-between flex py-4 flex-row text-xs"
>
  <div className="gap-2 md:gap-6 flex flex-row">
    <Link href="/">
      <p className="text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">Home</p>
    </Link>
    <Link href="/terms">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Terms</p>
    </Link>
    <Link href="/about">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">About</p>
    </Link>
  </div>
  <div className="gap-2 md:gap-6 flex flex-row">
   <Link href="/help">
       <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Participate </p>
     </Link>
    <Link href="/help">
      <p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p>
    </Link>
  </div>
</div>

      <Navbar />

      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[50px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-2xl md:text-4xl font-bold">Terms and Conditions of Use (the “Terms”)</h1>
        <p>
          Please read these Terms carefully before accessing or using the services made available,
          accessed, published or otherwise offered through
          <a href="https://www.shilingi.co.ke" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700"> www.shilingi.co.ke</a>
          (the "Site"). By accessing or using the Site or participating in the Shilingi contribution cycle ("cycle, initiative"),
          you agree to be bound by these Terms and our
          <a href="https://www.shilingi.co.ke/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700"> Privacy Policy</a>.
        </p>

        <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
        <p>
          Shilingi is a micro-contribution and reward platform operated by Shilingi community, in Kenya.
          Participants contribute a nominal amount of 1 Kenyan Shilling (KES) via mobile money (M-Pesa) to enter a pool.
          When the collective pool reaches 1,000,000 KES, a random winner is selected to receive 800,000 KES (80%), while
          200,000 KES (20%) is allocated to the platform for operational, audit, and community development purposes.
        </p>

        <h2 className="text-xl font-semibold mt-6">2. Eligibility</h2>
        <p>
          Participation is limited to individuals who:
        </p>
        <ul className="list-disc pl-6">
          <li>Are at least 18 years of age at the time of entry.</li>
          <li>Are residents of Kenya with a valid national ID or passport.</li>
          <li>Possess an active Safaricom mobile number with M-Pesa enabled.</li>
        </ul>
        <p>
          We reserves the right to request verification documents and may disqualify any individual who fails
          to meet eligibility criteria or violates these Terms.
        </p>

        <h2 className="text-xl font-semibold mt-6">3. Entry Requirements</h2>
        <p>To participate:</p>
        <ul className="list-disc pl-6">
          <li>Use the STK Push feature provided on the Site to send exactly 1 KES.</li>
          <li>Confirm your entry through the SMS prompt sent by Safaricom.</li>
          <li>Only one entry per mobile number is permitted for each contribution cycle.</li>
        </ul>
        <p>
          Any attempt to circumvent the one-entry rule, including use of multiple SIM cards, automation, or other
          technological manipulation, will result in disqualification.
        </p>

        <h2 className="text-xl font-semibold mt-6">4. Contribution Pool Management</h2>
        <p>
          The total contribution pool is publicly visible and updated in real-time on the Site. Shilingi  uses
          automated scripts and backend systems to ensure real-time integrity of the data displayed. We are not
          liable for temporary inaccuracies caused by server downtimes or mobile API delays.
        </p>

        <h2 className="text-xl font-semibold mt-6">5. Winner Selection Process</h2>
        <p>
          Once the pool reaches 1,000,000 KES, the cycle closes and an automated selection process begins. The process
          involves the use of hash functions based on publicly auditable data, including:
        </p>
        <ul className="list-disc pl-6">
          <li>Transaction IDs</li>
          <li>Timestamp at closing</li>
          <li>Aggregated participant data</li>
        </ul>
        <p>
          The winning phone number is announced on the Site and notified by SMS. The reward is transferred to the
          winning number after identity verification. If a winner cannot be verified within 7 days, a redraw may occur.
        </p>

        <h2 className="text-xl font-semibold mt-6">6. Payout Terms</h2>
        <p>
          The payout to the winner is 800,000 KES, sent directly to their M-Pesa number or another
           agreed upon method incase or mobile transaction challenges. Taxes, if applicable, are the
          responsibility of the winner. The platform will retain 20% (200,000 KES) to fund audits, legal compliance,
          platform development, salaries, support, and community outreach.
        </p>

        <h2 className="text-xl font-semibold mt-6">7. Privacy and Data Handling</h2>
        <p>
          By participating, you consent to the collection and storage of:
        </p>
        <ul className="list-disc pl-6">
          <li>Your mobile number</li>
          <li>First name and location if applicable (for public display)</li>
          <li>Transaction timestamp and ID</li>
          <li>Device metadata (e.g., IP, browser)</li>
        </ul>
        <p>
          Shilingi will not sell or share your data with third parties except for fraud prevention or legal
          obligations. All data is encrypted and stored on secure servers in compliance with Kenya’s Data Protection Act.
        </p>

        <h2 className="text-xl font-semibold mt-6">8. Community Ethics and Transparency</h2>
        <p>
          All valid contributions are displayed in a publicly accessible leaderboard. Your name, and partially hidden  digits of
           your mobile number will appear.
           This fosters public trust, prevents duplicate participation,
          and builds transparency.
        </p>

        <h2 className="text-xl font-semibold mt-6">9. Refunds and Cancellation Policy</h2>
        <p>
          All entries are final. Refunds are only issued in the event of:
        </p>
        <ul className="list-disc pl-6">
          <li>System malfunction or double billing</li>
          <li>Fraud or identity theft confirmed by M-Pesa</li>
          <li>Cycle cancellation by Shilingi  due to legal or technical reasons</li>
        </ul>
        <p>
          In such cases, refunds are processed within 14 business days. Refunds will be issued only to the originating
          number.
        </p>

        <h2 className="text-xl font-semibold mt-6">10. Disqualification and Penalties</h2>
        <p>
          Users may be disqualified for:
        </p>
        <ul className="list-disc pl-6">
          <li>Submitting multiple entries</li>
          <li>Using stolen or fake identities</li>
          <li>Disrupting backend systems or frontend display</li>
          <li>Abusive language or conduct on the platform</li>
        </ul>
        <p>
          Disqualified users forfeit any winnings and may be reported to authorities.
        </p>

        <h2 className="text-xl font-semibold mt-6">11. Technical Support and Availability</h2>
        <p>
          While we strive for 99.9% uptime, the Site may be unavailable due to maintenance or unforeseen technical
          issues. Users can report issues via the provided email or help form.
        </p>

        <h2 className="text-xl font-semibold mt-6">12. Legal and Compliance</h2>
        <p>
          Shilingi complies with relevant Kenyan laws and regulations including but not limited to:
        </p>
        <ul className="list-disc pl-6">
          <li>Data Protection Act</li>
          <li>Consumer Protection Act</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">13. Limitation of Liability</h2>
        <p>
          Shilingi shall not be liable for indirect damages, losses, or delays caused by force majeure, M-Pesa outages,
          fraud, or misuse of the platform.
        </p>

        <h2 className="text-xl font-semibold mt-6">14. Dispute Resolution</h2>
        <p>
          Disputes should first be reported to Shilingi’s internal support. If unresolved within 14 days, disputes may be
          escalated to the relative legal bodies.
        </p>i

        <h2 className="text-xl font-semibold mt-6">15. Termination of Use</h2>
        <p>
          Shilingi reserves the right to terminate or suspend access to the Site for any user suspected of malicious
          behavior, rule violations, or legal infractions.
        </p>

        <h2 className="text-xl font-semibold mt-6">16. Updates and Notifications</h2>
        <p>
          These Terms may be updated periodically. Notification of changes will be sent via email (if provided) and
          posted on the Site. Continued use of the platform constitutes acceptance of the revised terms.
        </p>

        <h2 className="text-xl font-semibold mt-6">17. Contact Information</h2>
        <p>
          For any questions, feedback, or dispute resolution, contact us:
        </p>
        <ul className="list-disc pl-6">
         <li>Email: shilingi@gmail.com</li>
            <li>Phone: +254 703 394 794</li>
          </ul>

        <p className="text-sm text-gray-500 mt-4">Last updated: June 2025</p>

              <Footer />

      </div>
    </div>
  );
};

export default TermsAndConditions;
