import React from 'react';

import Navbar from '../components/Navbar'; // Assuming you have a Navbar component
import Footer from '../components/Footer'; // Assuming you have a Footer component

const HelpCenter = () => {
  return (
    <div className="bg-[var(--bg)] ">
      <Navbar /> {/* Include your Navbar */}
      <div className="max-w-4xl mx-auto px-4 mt-6 text-[14px] md:text-[16px] md:px-8">
        <div className="text-center justify-center mb-12">
          <h1 className="text-2xl md:text-5xl font-semibold text-[var(--textColor)] mb-2">How can we help you?</h1>
          <p className="0">Find answers to common questions and get the support you need.</p>
        </div>

        {/* Agent/Landlord Help Section */}
        <section className="bg-white rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <h2 className="text-xl md:text-3xl font-semibold text-[var(--softTextColor)]">For Agents and Landlords</h2>
          </div>
          <div className="space-y-4">
            {/* Login Instructions */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
            <h3 className="flex items-center text-lg md:text-2xl space-x-2 font-semibold text-[var(--softTextColor)] mb-2">
            <span>Logging In</span>
              </h3>
              <p className="0 mb-2">Having trouble logging in? Here's how:</p>
              <ul className="list-disc pl-5 0">
                <li>Go to the Hodii website or open the mobile app.</li>
                <li>Click on the <strong className="text-indigo-600">"Log In"</strong> button.</li>
                <li>Enter your registered <strong className="text-indigo-600">email address</strong> or <strong className="text-indigo-600">phone number</strong>.</li>
                <li>Enter your <strong className="text-indigo-600">password</strong>.</li>
                <li>Click the <strong className="text-indigo-600">"Submit"</strong> or <strong className="text-indigo-600">"Log In"</strong> button.</li>
                <li>
                  <button className="text-sm text-blue-500 hover:underline focus:outline-none">
                    Forgot Password?
                  </button>
                </li>
              </ul>
            </div>

            {/* Creating a Listing Instructions */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="flex items-center text-lg md:text-2xl space-x-2 font-semibold text-[var(--softTextColor)] mb-2">
                <span>Creating a Listing</span>
              </h3>
              <p className="0 mb-2">Ready to list your property? Follow these steps:</p>
              <ol className="list-decimal pl-5 0">
                <li>First, <strong className="text-indigo-600">log in</strong> to your account.</li>
                <li>Navigate to the <strong className="text-indigo-600">"Add Listing"</strong> page.</li>
                <li>Carefully fill in all the <strong className="text-indigo-600">required information</strong>:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Property Type (e.g., House, Apartment)</li>
                    <li>Location (Address, City, Region)</li>
                    <li>Price (Sale or Rent)</li>
                    <li>Bedrooms and Bathrooms</li>
                    <li>Property Size</li>
                    <li>Key Features and Amenities</li>
                    <li>Upload <strong className="text-indigo-600">high-quality photos</strong>.</li>
                    <li>Write a detailed <strong className="text-indigo-600">description</strong>.</li>
                  </ul>
                </li>
                <li>Click the <strong className="text-indigo-600">"Create Listing"</strong> or <strong className="text-indigo-600">"Submit"</strong> button.</li>
                <li><strong className="font-semibold">Listing Duration:</strong> Active for <strong className="text-indigo-600">28 days</strong>. Update availability afterwards.</li>
                <li><strong className="font-semibold">Updating Availability:</strong> Go to your <strong className="text-indigo-600">"Listings"</strong> page and find the <strong className="text-indigo-600">"Update Availability"</strong> option.</li>
                <li><strong className="font-semibold">Deleting or Unlisting:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    <li><strong className="text-indigo-600">"Delete"</strong>: Permanently remove the listing.</li>
                    <li><strong className="text-indigo-600">"Unlist"</strong>: Hide from users, keep info saved. Relist later.</li>
                    <li>Find these options on your <strong className="text-indigo-600">"Listings"</strong> page.</li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* Boosting Your Listing Instructions */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="flex items-center text-lg md:text-2xl space-x-2 font-semibold text-[var(--softTextColor)] mb-2">
                <span>Boosting Your Listing</span>
              </h3>
              <p className="0 mb-2">Want more visibility? Here's how to boost your listing:</p>
              <ol className="list-decimal pl-5 0">
                <li>Go to your <strong className="text-indigo-600">"Listings"</strong> page.</li>
                <li>Find the listing and click <strong className="text-indigo-600">"Boost Listing"</strong>.</li>
                <li>Select a <strong className="text-indigo-600">boosting package</strong> (duration and price).</li>
                <li>Follow the payment instructions.</li>
                <li>Once paid, your listing will be boosted and appear higher in search results.</li>
              </ol>
            </div>

            {/* Unboosting Your Listing Instructions */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="flex items-center text-lg md:text-2xl space-x-2 font-semibold text-[var(--softTextColor)] mb-2">
                <span>Unboosting Your Listing</span>
              </h3>
              <p className="0 mb-2">Need to stop boosting? Here's how:</p>
              <ol className="list-decimal pl-5 0">
                <li>Go to your <strong className="text-indigo-600">"Listings"</strong> page.</li>
                <li>Find the boosted listing (usually indicated).</li>
                <li>Click <strong className="text-indigo-600">"Unboost Listing"</strong> or <strong className="text-indigo-600">"Stop Boosting"</strong>.</li>
                <li>Note: Refunds for remaining boost time may not be provided.</li>
              </ol>
            </div>

            {/* Managing Inquiries */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="font-semibold text-[var(--softTextColor)] mb-2">Managing Inquiries</h3>
              <p className="0">View and manage inquiries in your dashboard's <strong className="text-indigo-600">"Inquiries"</strong> section. Respond promptly.</p>
            </div>

            {/* Updating Your Profile */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="font-semibold text-[var(--softTextColor)] mb-2">Updating Your Profile</h3>
              <p className="0">Keep your profile updated in <strong className="text-indigo-600">"Profile"</strong> or <strong className="text-indigo-600">"Account Settings"</strong>. Ensure contact details are accurate.</p>
            </div>
          </div>
        </section>

        {/* User (Tenant/Buyer) Help Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <h2 className="text-xl md:text-3xl font-semibold text-[var(--softTextColor)]">For Tenants and Buyers</h2>
          </div>
          <div className="space-y-4">
            {/* Viewing Listings */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="font-semibold text-[var(--softTextColor)] mb-2">Viewing Listings</h3>
              <p className="0">Viewing property listings on Hodii is <strong className="text-green-500">free</strong> for all users.</p>
            </div>

            {/* Accessing Contact Information */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="flex items-center text-lg md:text-2xl space-x-2 font-semibold text-[var(--softTextColor)] mb-2">
                <span>Accessing Contact Information</span>
              </h3>
              <p className="0 mb-2">To view the contact information of the agent or landlord:</p>
              <ul className="list-disc pl-5 0">
                <li><strong className="text-indigo-600">Log In:</strong> Create an account and log in to see contact details.</li>
                <li><strong className="text-indigo-600">Share to WhatsApp:</strong> Share the listing to at least one WhatsApp group to unlock contact info.</li>
              </ul>
            </div>

            {/* Searching and Filtering Listings */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="flex items-center text-lg md:text-2xl space-x-2 font-semibold text-[var(--softTextColor)] mb-2">
                <span>Searching and Filtering Listings</span>
              </h3>
              <p className="0 mb-2">Find your perfect property using our search and filtering options:</p>
              <ol className="list-decimal pl-5 0">
                <li>Click the <strong className="text-indigo-600">"Search"</strong> button.</li>
                <li>A <strong className="text-indigo-600">filter panel</strong> will appear. Filters include:
                  <ul className="list-disc pl-5 mt-2">
                    <li><strong className="font-semibold">Price Range</strong> (min and max)</li>
                    <li><strong className="font-semibold">Location</strong> (city, region, area)</li>
                    <li><strong className="font-semibold">Property Type</strong> (House, Apartment, Land)</li>
                    <li><strong className="font-semibold">Number of Bedrooms</strong></li>
                    <li><strong className="font-semibold">Number of Bathrooms</strong></li>
                    <li>Other <strong className="font-semibold">amenities</strong> and <strong className="font-semibold">features</strong>.</li>
                  </ul>
                </li>
                <li><strong className="font-semibold">Updating Filters:</strong> Click the <strong className="text-indigo-600">"x"</strong> or <strong className="text-indigo-600">"clear"</strong> to remove. Adjust values and click <strong className="text-indigo-600">"Apply"</strong> or <strong className="text-indigo-600">"Search"</strong> to change.</li>
              </ol>
            </div>

            {/* Location-Based Search */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="flex items-center text-lg md:text-2xl space-x-2 font-semibold text-[var(--softTextColor)] mb-2">
                <span>Location-Based Search</span>
              </h3>
              <p className="0 mb-2">Find properties in specific areas easily:</p>
              <ul className="list-disc pl-5 0">
                <li><strong className="font-semibold">Map Circling:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Open <strong className="text-indigo-600">"Map View"</strong> on the search page.</li>
                    <li>Draw a circle on the map with your finger or mouse.</li>
                    <li>Listings within the circle will be displayed.</li>
                  </ul>
                </li>
                <li><strong className="font-semibold">Radius Search from Landmark/Place:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Type a <strong className="text-indigo-600">landmark</strong> or <strong className="text-indigo-600">place name</strong> in the location search bar.</li>
                    <li>Select a <strong className="text-indigo-600">radius</strong> (e.g., 1km, 5km) to search around it.</li>
                  </ul>
                </li>
                <li><strong className="font-semibold">Search from Current Location:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Enable your device's location services.</li>
                    <li>Click <strong className="text-indigo-600">"Search Near Me"</strong> or a location icon.</li>
                    <li>Listings near your current location will be shown.</li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Adding Reviews */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="flex items-center text-lg md:text-2xl space-x-2 font-semibold text-[var(--softTextColor)] mb-2">
                <span>Adding Reviews</span>
              </h3>
              <p className="0">You <strong className="text-indigo-600">must be logged in</strong> to add a review for a property or agent/landlord. Look for the review option on the listing or profile page.</p>
            </div>

            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="font-semibold text-[var(--softTextColor)] mb-2">Saving Favorite Listings</h3>
              <p className="0">Click the <strong className="text-indigo-600">"Save"</strong> or <strong className="text-indigo-600">heart</strong> icon to save listings. View them in your account dashboard.</p>
            </div>

            {/* Contacting Agents/Landlords */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="font-semibold text-[var(--softTextColor)] mb-2">Contacting Agents/Landlords</h3>
              <p className="0">Once contact information is unlocked (login or share), you can contact the agent/landlord via the provided phone or WhatsApp.</p>
            </div>

            {/* Sharing Listings */}
            <div className="rounded-md shadow-md border border-[var(--softbg5)] p-4">
              <h3 className="flex items-center text-lg md:text-2xl space-x-2 font-semibold text-[var(--softTextColor)] mb-2">
                <span>Sharing Listings</span>
              </h3>
              <p className="0">Share listings easily using the <strong className="text-indigo-600">"Share"</strong> button on the listing page via social media or messaging apps.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer /> {/* Include your Footer */}
    </div>
  );
};

export default HelpCenter;