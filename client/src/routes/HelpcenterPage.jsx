import React from 'react';
import { FaQuestionCircle, FaUser, FaPlusCircle, FaSignInAlt, FaSearch, FaMapMarkerAlt, FaStar, FaShareAlt, FaRocket, FaArrowUp, FaPhone } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const HelpCenter = () => {
  return (
    <div>
         <Navbar/>

    <div className="py-10 px-6 mt-9 font-sans leading-relaxed bg-[var(--bg)] text-[var(--softTextColor)]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-2 text-xl text-blue-500">
          <FaQuestionCircle />
          <h1 className="text-5xl font-semibold  text-center text-[var(--softTextColor)]">Hi, how can we help?   </h1>
        </div>

        {/* Agent/Landlord Help */}
        <div className="mb-8 p-6  bg-[var(--bg)]  rounded-md shadow-md">
          <div className="mb-4 flex items-center gap-2 text-lg text-blue-500">
            <FaUser />
            <h2 className="text-2xl font-semibold text-[var(--softTextColor)]">For Agents and Landlords</h2>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2 flex items-center gap-1"><span className="text-blue-500"><FaSignInAlt /></span> How to Login</h3>
            <p className="mb-2">
              To login to your Agent or Landlord account, follow these steps:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Go to the Hodii website or open the mobile app.</li>
              <li>Click on the <span className="font-bold text-red-500">"Login"</span> button, usually at the top right or in the menu.</li>
              <li>Enter your registered <span className="font-bold text-red-500">email address</span> or <span className="font-bold text-red-500">phone number</span>.</li>
              <li>Enter your <span className="font-bold text-red-500">password</span>.</li>
              <li>Click the <span className="font-bold text-red-500">"Submit"</span> or <span className="font-bold text-red-500">"Login"</span> button.</li>
              <li>If you forgot your password, click <span className="font-bold text-red-500">"Forgot Password?"</span> and follow the instructions.</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2 flex items-center gap-1"><FaPlusCircle className="text-green-500" /> How to Create a Listing</h3>
            <p className="mb-2">
              To list a property on Hodii, please follow these steps:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>First, <span className="font-bold text-red-500">login</span> to your account.</li>
              <li>Navigate to the <span className="font-bold text-red-500">"Add Listing"</span> page (on your dashboard or menu).</li>
              <li>Carefully fill in all the <span className="font-bold text-red-500">required information</span>:</li>
              <ul className="list-disc pl-8 mb-2">
                <li>Property Type (e.g., House, Apartment)</li>
                <li>Location (Address, City, Region)</li>
                <li>Price (Sale or Rent)</li>
                <li>Bedrooms and Bathrooms</li>
                <li>Property Size</li>
                <li>Key Features and Amenities</li>
                <li><span className="font-bold text-red-500">High-quality photos</span> (upload multiple).</li>
                <li>A detailed <span className="font-bold text-red-500">description</span>.</li>
              </ul>
              <li>Click the <span className="font-bold text-red-500">"Create Listing"</span> or <span className="font-bold text-red-500">"Submit"</span> button.</li>
              <li><span className="font-bold">Listing Duration:</span> Active for <span className="font-bold text-red-500">28 days</span>. Update availability afterwards.</li>
              <li><span className="font-bold">Updating Availability:</span> Go to your <span className="font-bold text-red-500">"Listings"</span> page and find the <span className="font-bold text-red-500">"Update Availability"</span> option.</li>
              <li><span className="font-bold">Deleting or Unlisting:</span>
                <ul className="list-disc pl-8">
                  <li><span className="font-bold text-red-500">"Delete"</span>: Permanently remove the listing.</li>
                  <li><span className="font-bold text-red-500">"Unlist"</span>: Hide from users, keep info saved. Relist later.</li>
                  Find these options on your <span className="font-bold text-red-500">"Listings"</span> page.
                </ul>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2 flex items-center gap-1"><FaRocket className="text-purple-500" /> Boosting Your Listing</h3>
            <p className="mb-2">
              To increase your listing's visibility, you can boost it:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Go to your <span className="font-bold text-red-500">"Listings"</span> page.</li>
              <li>Find the listing and click <span className="font-bold text-red-500">"Boost Listing"</span>.</li>
              <li>Select a <span className="font-bold text-red-500">boosting package</span> (duration and price).</li>
              <li>Follow the payment instructions.</li>
              <li>Once paid, your listing will be boosted and appear higher in search results.</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2 flex items-center gap-1"><FaArrowUp className="text-yellow-500" /> Unboosting Your Listing</h3>
            <p className="mb-2">
              You can stop boosting your listing at any time:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Go to your <span className="font-bold text-red-500">"Listings"</span> page.</li>
              <li>Find the boosted listing (usually indicated).</li>
              <li>Click <span className="font-bold text-red-500">"Unboost Listing"</span> or <span className="font-bold text-red-500">"Stop Boosting"</span>.</li>
              <li>Note: Refunds for remaining boost time may not be provided.</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2">Managing Inquiries</h3>
            <p>View and manage inquiries in your dashboard's <span className="font-bold text-red-500">"Inquiries"</span> section. Respond promptly.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2">Updating Your Profile</h3>
            <p>Keep your profile updated in <span className="font-bold text-red-500">"Profile"</span> or <span className="font-bold text-red-500">"Account Settings"</span>. Ensure contact details are accurate.</p>
          </div>
        </div>

        {/* User (Tenant/Buyer) Help */}
        <div className="mb-8 p-6  bg-[var(--bg)]  rounded-md shadow-md">
          <div className="mb-4 flex items-center gap-2 text-lg text-blue-500">
            <FaSearch />
            <h2 className="text-2xl font-semibold text-[var(--softTextColor)]">For Tenants and Buyers</h2>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2">Viewing Listings</h3>
            <p>Viewing property listings on Hodii is <span className="font-bold text-green-500">free</span> for all users.</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2 flex items-center gap-1"><FaPhone className="text-blue-500" /> Accessing Contact Information</h3>
            <p className="mb-2">
              To view the contact information of the agent or landlord:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li><span className="font-bold text-red-500">Login:</span> Create an account and log in to see contact details.</li>
              <li><span className="font-bold text-red-500">Share to WhatsApp:</span> Share the listing to at least one WhatsApp group to unlock contact info.</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2 flex items-center gap-1"><FaSearch className="text-indigo-500" /> Searching and Filtering Listings</h3>
            <p className="mb-2">
              Find your perfect property using our search and filtering options:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li>Click the <span className="font-bold text-red-500">"Search"</span> button (usually at the top).</li>
              <li>A <span className="font-bold text-red-500">filter panel</span> will appear. Filters include:</li>
              <ul className="list-disc pl-8 mb-2">
                <li><span className="font-bold">Price Range</span> (min and max)</li>
                <li><span className="font-bold">Location</span> (city, region, area)</li>
                <li><span className="font-bold">Property Type</span> (House, Apartment, Land)</li>
                <li><span className="font-bold">Number of Bedrooms</span></li>
                <li><span className="font-bold">Number of Bathrooms</span></li>
                <li>Other <span className="font-bold">amenities</span> and <span className="font-bold">features</span>.</li>
              </ul>
              <li><span className="font-bold">Updating Filters:</span> Click the <span className="font-bold text-red-500">"x"</span> or <span className="font-bold text-red-500">"clear"</span> to remove. Adjust values and click <span className="font-bold text-red-500">"Apply"</span> or <span className="font-bold text-red-500">"Search"</span> to change.</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2 flex items-center gap-1"><FaMapMarkerAlt className="text-teal-500" /> Location-Based Search</h3>
            <p className="mb-2">
              Find properties in specific areas easily:
            </p>
            <ul className="list-disc pl-5 mb-2">
              <li><span className="font-bold">Map Circling:</span>
                <ul className="list-disc pl-8 mb-2">
                  <li>Open <span className="font-bold text-red-500">"Map View"</span> on the search page.</li>
                  <li>Draw a circle on the map with your finger or mouse.</li>
                  <li>Listings within the circle will be displayed.</li>
                </ul>
              </li>
              <li><span className="font-bold">Radius Search from Landmark/Place:</span>
                <ul className="list-disc pl-8 mb-2">
                  <li>Type a <span className="font-bold text-red-500">landmark</span> or <span className="font-bold text-red-500">place name</span> in the location search bar.</li>
                  <li>Select a <span className="font-bold text-red-500">radius</span> (e.g., 1km, 5km) to search around it.</li>
                </ul>
              </li>
              <li><span className="font-bold">Search from Current Location:</span>
                <ul className="list-disc pl-8 mb-2">
                  <li>Enable your device's location services.</li>
                  <li>Click <span className="font-bold text-red-500">"Search Near Me"</span> or a location icon.</li>
                  <li>Listings near your current location will be shown.</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2 flex items-center gap-1"><FaStar className="text-orange-500" /> Adding Reviews</h3>
            <p>You <span className="font-bold text-red-500">must be logged in</span> to add a review for a property or agent/landlord. Look for the review option on the listing or profile page.</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2">Saving Favorite Listings</h3>
            <p>Click the <span className="font-bold text-red-500">"Save"</span> or <span className="font-bold text-red-500">heart</span> icon to save listings. View them in your account dashboard.</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2">Contacting Agents/Landlords</h3>
            <p>Once contact information is unlocked (login or share), you can contact the agent/landlord via the provided phone or WhatsApp.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--softTextColor)] mb-2 flex items-center gap-1"><FaShareAlt className="text-blue-500" /> Sharing Listings</h3>
            <p>Share listings easily using the <span className="font-bold text-red-500">"Share"</span> button on the listing page via social media or messaging apps.</p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>

        </div>

  );
};

export default HelpCenter;