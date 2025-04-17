import React from 'react';
import {
  FaQuestionCircle,
  FaUser,
  FaPlusCircle,
  FaSignInAlt,
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaShareAlt,
  FaRocket,
  FaArrowUp,
  FaPhone,
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SectionTitle = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="text-blue-500 text-xl" />
    <h2 className="text-2xl md:text-3xl font-semibold text-[var(--textColor)]">{children}</h2>
  </div>
);

const HelpItem = ({ icon: Icon, title, children }) => (
  <div className="mb-8">
    <h3 className="flex items-center text-lg font-semibold text-[var(--textColor)] gap-2 mb-2">
      {Icon && <Icon className="text-blue-500" />} {title}
    </h3>
    <div className="text-[var(--softTextColor)]">{children}</div>
  </div>
);

const HelpCenter = () => {
  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <Navbar />

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--textColor)]">
            Hi, how can we help?
          </h1>
        </div>

        {/* Agent & Landlord Section */}
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl p-8 shadow-md mb-12">
          <SectionTitle icon={FaUser}>For Agents and Landlords</SectionTitle>

          <HelpItem icon={FaSignInAlt} title="How to Login">
            <ul className="list-disc pl-6 space-y-1">
              <li>Go to the Hodii website or open the mobile app.</li>
              <li>Click on the <strong className="text-red-500">"Login"</strong> button.</li>
              <li>Enter your registered <strong className="text-red-500">email</strong> or <strong className="text-red-500">phone</strong>.</li>
              <li>Enter your <strong className="text-red-500">password</strong>.</li>
              <li>Click <strong className="text-red-500">"Submit"</strong>.</li>
              <li>Forgot password? Use the <strong className="text-red-500">"Forgot Password"</strong> link.</li>
            </ul>
          </HelpItem>

          <HelpItem icon={FaPlusCircle} title="How to Create a Listing">
            <ul className="list-disc pl-6 space-y-1">
              <li>Login to your account.</li>
              <li>Go to the <strong className="text-red-500">"Add Listing"</strong> page.</li>
              <li>Fill in all required details including photos and description.</li>
              <li>Click <strong className="text-red-500">"Create Listing"</strong>.</li>
              <li><strong>Duration:</strong> Listings last <strong className="text-red-500">28 days</strong>.</li>
              <li>Update or delete listings from the <strong className="text-red-500">"Listings"</strong> page.</li>
            </ul>
          </HelpItem>

          <HelpItem icon={FaRocket} title="Boosting Your Listing">
            <ul className="list-disc pl-6 space-y-1">
              <li>Navigate to your <strong className="text-red-500">"Listings"</strong> page.</li>
              <li>Click <strong className="text-red-500">"Boost Listing"</strong>.</li>
              <li>Select a <strong className="text-red-500">package</strong> and complete payment.</li>
              <li>Your listing will rank higher in search results.</li>
            </ul>
          </HelpItem>

          <HelpItem icon={FaArrowUp} title="Unboosting Your Listing">
            <ul className="list-disc pl-6 space-y-1">
              <li>Go to <strong className="text-red-500">"Listings"</strong>.</li>
              <li>Find the boosted listing and click <strong className="text-red-500">"Unboost"</strong>.</li>
              <li>No refunds are offered for unused boost time.</li>
            </ul>
          </HelpItem>

          <HelpItem title="Managing Inquiries">
            <p>Use the <strong className="text-red-500">"Inquiries"</strong> section in your dashboard to view and respond.</p>
          </HelpItem>

          <HelpItem title="Updating Your Profile">
            <p>Go to <strong className="text-red-500">"Profile"</strong> or <strong className="text-red-500">"Account Settings"</strong> to update contact details.</p>
          </HelpItem>
        </div>

        {/* Buyer/Tenant Section */}
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl p-8 shadow-md">
          <SectionTitle icon={FaSearch}>For Tenants and Buyers</SectionTitle>

          <HelpItem title="Viewing Listings">
            <p>All property listings are <strong className="text-green-500">free</strong> to view.</p>
          </HelpItem>

          <HelpItem icon={FaPhone} title="Accessing Contact Information">
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-red-500">Login</strong> to your account.</li>
              <li>Share the listing to a WhatsApp group to unlock contacts.</li>
            </ul>
          </HelpItem>

          <HelpItem icon={FaSearch} title="Searching and Filtering Listings">
            <ul className="list-disc pl-6 space-y-1">
              <li>Click <strong className="text-red-500">"Search"</strong> and use filters such as price, location, property type, etc.</li>
              <li>Clear or update filters as needed.</li>
            </ul>
          </HelpItem>

          <HelpItem icon={FaMapMarkerAlt} title="Location-Based Search">
            <ul className="list-disc pl-6 space-y-1">
              <li>Use <strong className="text-red-500">"Map View"</strong> and draw an area.</li>
              <li>Search by radius around a landmark or your current location.</li>
            </ul>
          </HelpItem>

          <HelpItem icon={FaStar} title="Adding Reviews">
            <p>You must <strong className="text-red-500">log in</strong> to leave a review on a listing or agent profile.</p>
          </HelpItem>

          <HelpItem title="Saving Favorite Listings">
            <p>Click the <strong className="text-red-500">"Save"</strong> or heart icon on listings to add to your favorites.</p>
          </HelpItem>

          <HelpItem title="Contacting Agents/Landlords">
            <p>Once contact details are unlocked, use the phone or WhatsApp link to reach out.</p>
          </HelpItem>

          <HelpItem icon={FaShareAlt} title="Sharing Listings">
            <p>Use the <strong className="text-red-500">"Share"</strong> button to send via messaging or social media.</p>
          </HelpItem>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter;