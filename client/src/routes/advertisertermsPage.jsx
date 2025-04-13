import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const AdvertiserTerms = () => {
  return (
    <div>
      <Navbar />

      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[40px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-2xl md:text-4xl font-bold">Advertiser Terms and Conditions</h1>

        <p>
          These Advertiser Terms and Conditions (the “Advertiser Terms”) govern your use of our platform and services for advertising purposes (the “Advertising Services”) on our website [Your Website URL] (the “Site”). By using our Advertising Services, you (“Advertiser”) agree to be bound by these Advertiser Terms, as well as our general <a href="/terms-and-conditions" className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">Terms and Conditions of Use</a> and our <a href="/privacy-policy" className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">Privacy Policy</a>, all of which are incorporated herein by reference. If you are entering into these Advertiser Terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Advertiser Terms.
        </p>

        <h2 className="text-xl font-semibold">Account Registration and Responsibilities</h2>
        <p>
          To use our Advertising Services, you may be required to register for an advertiser account. You agree to provide accurate, current, and complete information during the registration process and to keep your account information updated.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>You are responsible for maintaining the confidentiality of your account login credentials and for all activities that occur under your account.</li>
          <li>You agree not to share your login credentials with any third party.</li>
          <li>You are solely responsible for the content, accuracy, and legality of your advertisements (“Ads”).</li>
          <li>You warrant that your Ads comply with all applicable laws, regulations, and industry standards, including but not limited to advertising guidelines, consumer protection laws, and data protection regulations.</li>
          <li>You agree not to create Ads that are false, misleading, deceptive, discriminatory, or that infringe upon the intellectual property rights of others.</li>
        </ul>

        <h2 className="text-xl font-semibold">Ad Submission and Approval</h2>
        <p>
          You will submit your Ads to us through our designated platform. We reserve the right to review and approve or reject any Ad at our sole discretion.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Our approval of an Ad does not constitute an endorsement of the advertised product, service, or content, nor does it guarantee compliance with all applicable laws and regulations. You remain solely responsible for ensuring such compliance.</li>
          <li>We may reject Ads that we deem to be in violation of these Advertiser Terms, our Terms and Conditions of Use, our advertising guidelines (which may be provided separately and updated from time to time), or for any other reason at our sole discretion.</li>
          <li>We are not obligated to provide reasons for rejecting an Ad.</li>
          <li>You are responsible for ensuring that all necessary disclosures and disclaimers are included in your Ads.</li>
        </ul>

        <h2 className="text-xl font-semibold">Ad Placement and Display</h2>
        <p>
          We will use commercially reasonable efforts to display your Ads on the Site in accordance with the advertising options you select and any agreed-upon terms. However, we do not guarantee specific placement, positioning, or timing of your Ads.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>The display of your Ads may be subject to factors such as website traffic, content relevance, and technical limitations.</li>
          <li>We reserve the right to modify the layout, design, and functionality of the Site, which may affect the display of your Ads.</li>
          <li>We are not responsible for any technical issues, interruptions, or errors that may affect the display of your Ads.</li>
        </ul>

        <h2 className="text-xl font-semibold">Fees and Payment Terms</h2>
        <p>
          You agree to pay the fees for the Advertising Services as outlined in our pricing schedule or as otherwise agreed upon in writing.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>All fees are in [Currency] and are exclusive of any applicable taxes, unless otherwise stated.</li>
          <li>Payment terms will be as specified in our invoicing or payment portal. You agree to pay all invoices by the due date.</li>
          <li>Late payments may be subject to interest charges at a rate of [Specify Percentage]% per month or the maximum rate permitted by law, whichever is lower.</li>
          <li>You are responsible for all costs associated with the creation and submission of your Ads.</li>
          <li>We reserve the right to change our fees and payment terms upon providing you with reasonable notice.</li>
        </ul>

        <h2 className="text-xl font-semibold">Reporting and Analytics</h2>
        <p>
          We may provide you with reports and analytics related to the performance of your Ads through our platform. The metrics provided are for informational purposes only and may not be perfectly accurate. We make no guarantees regarding the performance or results of your Ads.
        </p>

        <h2 className="text-xl font-semibold">Intellectual Property Rights</h2>
        <p>
          You retain all intellectual property rights in the content of your Ads. By submitting your Ads to us, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, display, distribute, and modify your Ads (including resizing or reformatting) solely for the purpose of providing the Advertising Services on the Site.
        </p>
        <p>
          You represent and warrant that you have all necessary rights and permissions to grant us the license described in this section and that your Ads do not infringe upon the intellectual property rights of any third party.
        </p>

        <h2 className="text-xl font-semibold">Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless [Your Company Name], its affiliates, officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys’ fees) arising out of or relating to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Your use of the Advertising Services.</li>
          <li>The content, accuracy, or legality of your Ads.</li>
          <li>Your breach of these Advertiser Terms or our Terms and Conditions of Use.</li>
          <li>Your violation of any applicable laws, regulations, or third-party rights.</li>
        </ul>

        <h2 className="text-xl font-semibold">Disclaimer of Warranties</h2>
        <p>
          THE ADVERTISING SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE. WE DO NOT WARRANT THAT THE ADVERTISING SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE, OR THAT YOUR ADS WILL ACHIEVE ANY SPECIFIC LEVEL OF PERFORMANCE OR RESULTS.
        </p>

        <h2 className="text-xl font-semibold">Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL [Your Company Name], ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES) ARISING OUT OF OR RELATING TO YOUR USE OF THE ADVERTISING SERVICES OR THESE ADVERTISER TERMS, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL CUMULATIVE LIABILITY TO YOU ARISING OUT OF OR RELATING TO THE ADVERTISING SERVICES OR THESE ADVERTISER TERMS SHALL NOT EXCEED THE TOTAL AMOUNT OF FEES PAID BY YOU TO US FOR THE ADVERTISING SERVICES IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.
        </p>

        <h2 className="text-xl font-semibold">Termination</h2>
        <p>
          We may terminate these Advertiser Terms and your access to the Advertising Services at any time, with or without cause, upon providing you with reasonable notice.
        </p>
        <p>
          You may terminate these Advertiser Terms at any time by ceasing your use of the Advertising Services and closing your advertiser account.
        </p>
        <p>
          Upon termination, you will be responsible for paying any outstanding fees owed to us. The provisions regarding intellectual property, indemnification, disclaimer of warranties, and limitation of liability shall survive the termination of these Advertiser Terms.
        </p>

        <h2 className="text-xl font-semibold">Governing Law and Dispute Resolution</h2>
        <p>
          These Advertiser Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions. Any disputes arising out of or relating to these Advertiser Terms or your use of the Advertising Services shall be exclusively resolved in the courts located in [Your City, Your Country/State], and you hereby consent to the jurisdiction of such courts.
        </p>

        <h2 className="text-xl font-semibold">Entire Agreement</h2>
        <p>
          These Advertiser Terms, together with our Terms and Conditions of Use and Privacy Policy, constitute the entire agreement between you and [Your Company Name] regarding the Advertising Services and supersede all prior or contemporaneous communications and proposals, whether oral or written, between you and us with respect to the Advertising Services.
        </p>

        <h2 className="text-xl font-semibold">Modifications to these Advertiser Terms</h2>
        <p>
          We reserve the right to modify these Advertiser Terms at any time by posting the revised terms on the Site. Your continued use of the Advertising Services after the effective date of any such modifications constitutes your acceptance of the revised Advertiser Terms. It is your responsibility to review these Advertiser Terms periodically for any changes.
        </p>

        <h2 className="text-xl font-semibold">Contact Us</h2>
        <p>
          If you have any questions about these Advertiser Terms or our Advertising Services, please contact us at [Your Contact Email Address].
        </p>

        <p><strong>Last updated:</strong> [Date]</p>
      </div>
      <Footer />
    </div>
  );
};

export default AdvertiserTerms;