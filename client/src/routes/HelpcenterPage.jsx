import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";


const HelpCenter = () => {
  return (
    <div>
      
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



      <div className="bg-[var(--bg)] text-[var(--softTextColor)] max-w-[1100px] mx-auto px-4 md:px-[50px] py-12 space-y-10">
        <h1 className="text-3xl md:text-5xl font-bold">Help Center</h1>
        <p className="text-lg">
          Welcome to the Shilingi Help Center. Below are answers to common questions and a quick guide to help you participate with confidence.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mt-8">🚀 How to Join</h2>
          <ol className="list-decimal pl-6 mt-4 space-y-2">
            <li>Visit <a href="https://www.shilingi.co.ke" className="text-blue-500 underline hover:text-blue-700">shilingi.co.ke</a></li>
            <li>Click on the “Join with 1 KES” or Join Now” button</li>
            <li>Enter your Safaricom phone number starting with 07... and confirm the M-Pesa prompt (STK Push)</li>
            <li>You’ll receive confirmation once your 1 KES is accepted</li>
            <li>Your entry is recorded and publicly listed with your entred name, and last 3 digits of your phone partially hidden</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8">💬 Frequently Asked Questions</h2>

          <div className="space-y-6 mt-4">

            <div>
              <h3 className="text-lg font-semibold">Q: Can I send more than 1 KES to increase my chances?</h3>
              <p className="ml-4 text-base">No. To keep the participantion fair and equal for everyone, only one entry per phone number per cycle is allowed. Multiple entries will be disqualified.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Q: What happens to the money?</h3>
              <p className="ml-4 text-base">When the pool reaches 1,000,000 KES, 80% (800,000 KES) goes to one randomly selected winner. The remaining 20% is used to run and sustain the platform.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Q: How is the winner chosen?</h3>
              <p className="ml-4 text-base">The winner is selected by an automated and transparent random draw system. We use hashing and timestamp seeds to ensure fairness and auditability.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Q: When and how will the winner be paid?</h3>
              <p className="ml-4 text-base">The winner is contacted through the phone number used. After identity verification, payment is sent via M-Pesa within 7 days.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Q: What details of participants are visible?</h3>
              <p className="ml-4 text-base">Only your first name, and your partially hidden phone number are displayed publicly to maintain transparency and trust.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Q: Can I get a refund?</h3>
              <p className="ml-4 text-base">All entries are final and non-refundable, unless there's a confirmed technical error or fraud. Contact our support team if you believe there’s a valid issue.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Q: Is this a betting or lottery app?</h3>
              <p className="ml-4 text-base">No. Shilingi is a micro-contribution and reward platform. It operates transparently and is structured to empower micro-contributions for fun and community reward.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Q: What if I didn’t receive the STK push?</h3>
              <p className="ml-4 text-base">Ensure your M-Pesa line is active and has enough balance. Make sure to enter the correct number starting with 07... Try again after a few minutes, or contact support.</p>
            </div>

          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8">📞 Need More Help?</h2>
          <p className="mt-2">
            If your question isn't answered here, feel free to reach out to our support team.
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email: shilingi@gmail.com</li>
            <li>Phone: +254 703 394 794</li>
          </ul>
        </section>


              <Footer />

      </div>
    </div>
  );
};



export default HelpCenter;

