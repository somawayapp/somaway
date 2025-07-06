import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";


const PrivacyPolicy = () => {
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
        <h1 className="text-2xl md:text-4xl font-bold">Privacy Policy</h1>

        <p>
          This Privacy Policy describes how Shilingi  ("we", "us", or "our") collects, uses,
          shares, and protects your information when you access or use our services through the
          website <a href="https://www.shilingi.co.ke" className="text-blue-500 underline hover:text-blue-700">www.shilingi.co.ke</a>
          ("Site"). By using our Site and participating in the Shilingi initiative cycle  ("initiative, cycle "), you consent to
          the practices described in this Policy.
        </p>

        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <ul className="list-disc pl-6">
          <li>Personal Information 1: User name and mobile phone number, M-Pesa transaction ID for all participants.</li>
          <li>Personal Information 2: Full name, mobile phone number, M-Pesa transaction ID, county of residence for all winner participants.</li>
          <li>Technical Information: IP address, device ID, browser type, operating system, and usage patterns.</li>
          <li>Usage Data: Interactions with the Site, frequency of visits, entry history, and draw participation logs.</li>
          <li>Communications: Emails, support queries, or feedback provided by you.</li>
        </ul>

        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6">
          <li>To verify participant identity and eligibility.</li>
          <li>To process your contributions and facilitate participation in the initiative.</li>
          <li>To display anonymized participation data (e.g., partial names and phone digits) publicly.</li>
          <li>To detect and prevent fraud, abuse, and security issues.</li>
          <li>To improve user experience and platform functionality.</li>
          <li>To communicate with you regarding cycle results, updates, and support.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Information Sharing and Disclosure</h2>
        <p>
          We do not sell your personal data. We may share limited information under the following circumstances:
        </p>
        <ul className="list-disc pl-6">
          <li>With third-party service providers who help operate and maintain the platform (e.g., payment processors).</li>
          <li>With legal and regulatory authorities upon valid request or as required by law.</li>
          <li>With auditors, for the purpose of verifying the fairness and transparency of the draw process.</li>
          <li>During a business transfer, merger, or acquisition, where your data may be part of transferred assets.</li>
        </ul>

        <h2 className="text-xl font-semibold">4. Data Retention</h2>
        <p>
          We retain your data only as long as necessary for the purposes outlined in this policy or as required by
          applicable laws. Upon expiration, we securely delete or anonymize the data.
        </p>

        <h2 className="text-xl font-semibold">5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6">
          <li>Access the data we hold about you.</li>
          <li>Request correction of inaccurate or incomplete data.</li>
          <li>Request deletion of your data, subject to legal and operational considerations.</li>
          <li>Withdraw your consent to data processing (where applicable).</li>
          <li>Object to the use of your data for marketing or analytics purposes.</li>
        </ul>

        <h2 className="text-xl font-semibold">6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to collect analytics, remember your preferences, and enhance
          your user experience. You may modify your browser settings to control cookies, though some site
          functions may be limited.
        </p>

        <h2 className="text-xl font-semibold">7. Data Security</h2>
        <p>
          We employ technical and organizational measures such as encryption, secure access control, and firewalls
          to protect your data from unauthorized access, disclosure, or loss. However, no method of transmission
          over the Internet is 100% secure.
        </p>

        <h2 className="text-xl font-semibold">8. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under 18 years of age. We do not knowingly collect
          personal information from minors. If we discover such data has been collected, we will promptly
          delete it.
        </p>

        <h2 className="text-xl font-semibold">9. International Transfers</h2>
        <p>
          Although our services are intended for use in Kenya, some of our third-party service providers may be
          located outside the country. In such cases, your data may be transferred to, stored, and processed in
          a jurisdiction with different data protection laws.
        </p>

        <h2 className="text-xl font-semibold">10. Legal Basis for Processing</h2>
        <p>
          We process your personal data based on your consent, contractual necessity, compliance with legal
          obligations, or our legitimate interests in running the platform.
        </p>

        <h2 className="text-xl font-semibold">11. Automated Decision-Making</h2>
        <p>
          Winner selection in the cycle is based on automated systems using randomization algorithms. These
          systems are designed to be fair, transparent, and free of human bias.
        </p>

        <h2 className="text-xl font-semibold">12. Third-Party Links</h2>
        <p>
          Our Site may contain links to third-party websites. We are not responsible for their privacy practices.
          We encourage you to review their privacy policies before submitting any data.
        </p>

        <h2 className="text-xl font-semibold">13. Marketing Communications</h2>
        <p>
          We may contact you with updates or promotional messages. You can opt-out by following the unsubscribe
          instructions in the communication or by contacting us directly.
        </p>

        <h2 className="text-xl font-semibold">14. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. The latest version will always be available on our
          Site. Continued use of the Site after updates constitutes acceptance of the revised Policy.
        </p>

        <h2 className="text-xl font-semibold">15. Contact Us</h2>
        <p>
          For questions or concerns regarding your data, contact us at:
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

export default PrivacyPolicy;
