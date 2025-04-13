import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <div>
      <Navbar />

      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1300px] mx-auto mt-8 md:mt-[40px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-2xl md:text-4xl font-bold">Privacy Policy</h1>

        <p>
          We respect your privacy and are committed to protecting your personal
          information. This privacy policy (“Policy”) applies to your use of{" "}
          <a
            href="https://www.hodii.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            www.hodii.com
          </a>{" "}
          (referred to as the “Site” or “Sites” depending on the context). This
          Policy sets out how we collect, store, guard, share and use any
          personal data that we may collect from you when you use or otherwise
          interact with the Platform or the services offered through our Sites.
          The Policy and our treatment of your personal data complies with the
          Data Protection Act of Kenya 2019 (as otherwise amended or varied from
          time to time).
        </p>

        <p>
          Please review this Policy carefully to understand our practices. This
          Site is not intended for children (i.e. under 18 years) and we do not
          knowingly collect data relating to children.
        </p>

        <h2 className="text-xl font-semibold">Terms</h2>
        <p>
          For ease of reference, the terms below as used in the Policy have the
          following meaning: <br />
          <span className="font-semibold hover-thumb">Account</span> means the
          account you create when registering as a user on the Site. <br />
          <span className="font-semibold hover-thumb">Group</span> means any
          other business of Ringier One Africa Media Ltd operating in Kenya or
          within the Ringier companies worldwide. <br />
          <span className="font-semibold hover-thumb">Personal data</span> means
          information that can identify you as an individual. It does not
          include aggregated or anonymized data. <br />
          <span className="font-semibold hover-thumb">Site</span> means, either
          together or individually, the Hodii platform. <br />
          <span className="font-semibold hover-thumb">Services</span> means such
          services made available, accessed, published or otherwise offered
          through the Site.
        </p>

        <h2 className="text-xl font-semibold">Data Controller</h2>
        <p>
          Hodii Limited is the data controller and responsible for your personal
          data (referred to as “we”, “us” or “our” in this Policy). For any
          queries, please email{" "}
          <a
            href="mailto:privacy@hodii.com"
            className="text-blue-500 underline hover:text-blue-700"
          >
            privacy@hodii.com
          </a>
          .
        </p>

        <p>
          Ringier One Africa Media Ltd is made up of different legal entities.
          This Policy is issued on behalf of Ringier One Africa Media Group
          (“Group”). "Hodii", "we", "us", or "our" refers to the relevant Group
          company responsible for processing your data. We will inform you of
          the entity acting as controller at the point of service. Hodii Limited
          is the controller of this Site. We’ve appointed a data privacy manager
          responsible for policy matters. Please use the contact above for
          related queries or rights requests.
        </p>

        <h2 className="text-xl font-semibold">Data Collected</h2>
        <p>
          We may collect, store, use and transfer the following personal data
          depending on the services used:
          <br />
          - Identity: name, username, marital status, nationality, etc.
          <br />
          - Contact: address, email, phone, location.
          <br />
          - Financial: account and card details, income (for Hodii users).
          <br />
          - Verification: ID/passport, KRA PIN, business permits, certificates.
          <br />
          - Account: username, preferences, feedback.
          <br />
          - Technical: IP, browser data, device info.
          <br />
          - Vehicle: ownership documents.
          <br />
          - Marketing: preferences and subscriptions.
        </p>

        <p>
          This list is not exhaustive. We may also collect anonymized
          statistical data and sensitive personal data (e.g. race, health,
          biometrics, criminal history).
        </p>

        <h2 className="text-xl font-semibold">
          What if I don’t want to provide data?
        </h2>
        <p>
          If required by law or contract and you fail to provide data, we may be
          unable to offer certain products or services and may cancel them with
          notice.
        </p>

        <h2 className="text-xl font-semibold">How Data is Collected</h2>
        <p>
          We collect data:
          <br />
          - Directly from you via the Site, phone or other channels. <br />
          - From other sources. <br />
          - Automatically using cookies, logs, pixels and similar technologies.
        </p>

        <h2 className="text-xl font-semibold">Accuracy of the Data</h2>
        <p>
          You must ensure your data remains accurate and updated. By submitting
          information, you confirm you own or are authorized to share it and
          that it is true, legal and does not breach rights of others.
        </p>

        <h2 className="text-xl font-semibold">Use of Collected Data</h2>
        <p>
          We use your personal data to: <br />
          - Provide services such as property listing and connections. <br />
          - Conduct marketing campaigns (where applicable). <br />
          - Comply with legal obligations. <br />
          - Pursue legitimate interests that do not override your rights.
        </p>

        <p>
          We rely on consent only for third-party direct marketing. You may
          withdraw consent anytime.
        </p>

        <h2 className="text-xl font-semibold">Sharing Your Personal Data</h2>
        <p>
          We may share your data with: <br />
          - Internal parties within the Group. <br />
          - External parties like AWS, Flutterwave, MailChimp, KRA, Facebook.{" "}
          <br />
          - Potential buyers or partners in business mergers. <br />
          Buyers and sellers on Hodii may see each other’s contacts. Third
          parties must process your data lawfully and securely.
        </p>

        <h2 className="text-xl font-semibold">Retention of Data</h2>
        <p>
          Data is retained only as long as needed for service provision and
          compliance, including any legal or dispute purposes.
        </p>

        <h2 className="text-xl font-semibold">Marketing</h2>
        <p>
          You’ll receive marketing if you’ve requested information or purchased
          from us unless you opt out. You can unsubscribe via email links or by
          contacting us.
        </p>

        <h2 className="text-xl font-semibold">Web Analytics</h2>
        <p>
          We use Google Analytics. Data may be collected using cookies and sent
          to U.S. servers. IPs are anonymized. Read more at{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            this opt-out link
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold">Your Legal Rights</h2>
        <p>
          You may have the right to: <br />
          - Be informed, access, correct, erase, restrict, transfer or object to
          data processing. <br />
          - Withdraw consent anytime.
        </p>

        <h2 className="text-xl font-semibold">
          Data Subject Access & Deletion Requests
        </h2>
        <p>
          You may request data or deletion by contacting:{" "}
          <a
            href="mailto:privacy@hodii.com"
            className="text-blue-500 underline hover:text-blue-700"
          >
            privacy@hodii.com
          </a>{" "}
          or{" "}
          <a
            href="mailto:support@hodii.com"
            className="text-blue-500 underline hover:text-blue-700"
          >
            support@hodii.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold">Changes to the Policy</h2>
        <p>
          We review this Policy regularly. Updates will be posted to the Site
          and may be shared with users via their accounts.
        </p>

        <p>
          <strong>Last updated:</strong> 6th May 2024
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

