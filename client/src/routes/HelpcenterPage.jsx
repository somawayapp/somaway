import React from 'react';
import styled from 'styled-components';
import { FaQuestionCircle, FaUser, FaPlusCircle, FaSearch, FaMapMarkerAlt, FaStar, FaShareAlt } from 'react-icons/fa';

const HelpCenterContainer = styled.div`
  padding: 40px;
  font-family: sans-serif;
  line-height: 1.6;
  background-color: #f9f9f9;
  color: #333;
`;

const HelpSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #007bff;
  margin-top: 0;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SubsectionTitle = styled.h3`
  color: #555;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const HelpText = styled.p`
  margin-bottom: 10px;
`;

const CodeBlock = styled.pre`
  background-color: #eee;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
`;

const List = styled.ul`
  padding-left: 20px;
  margin-bottom: 10px;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
`;

const Important = styled.span`
  font-weight: bold;
  color: #dc3545;
`;

const HelpCenter = () => {
  return (
    <HelpCenterContainer>
      <SectionTitle><FaQuestionCircle /> Welcome to the Hodii Help Center</SectionTitle>

      {/* Agent/Landlord Help */}
      <HelpSection>
        <SectionTitle><FaUser /> For Agents and Landlords</SectionTitle>

        <SubsectionTitle>How to Login</SubsectionTitle>
        <HelpText>
          To login to your Agent or Landlord account, follow these steps:
        </HelpText>
        <List>
          <ListItem>Go to the Hodii website or open the mobile app.</ListItem>
          <ListItem>Click on the <Important>"Login"</Important> button, usually located at the top right of the page or within the app's main menu.</ListItem>
          <ListItem>Enter your registered <Important>email address</Important> or <Important>phone number</Important>.</ListItem>
          <ListItem>Enter your <Important>password</Important>.</ListItem>
          <ListItem>Click the <Important>"Submit"</Important> or <Important>"Login"</Important> button to access your account.</ListItem>
          <ListItem>If you've forgotten your password, click on the <Important>"Forgot Password?"</Important> link and follow the instructions to reset it.</ListItem>
        </List>

        <SubsectionTitle><FaPlusCircle /> How to Create a Listing</SubsectionTitle>
        <HelpText>
          To list a property on Hodii, please follow these steps:
        </HelpText>
        <List>
          <ListItem>First, <Important>login</Important> to your Agent or Landlord account.</ListItem>
          <ListItem>Navigate to the <Important>"Add Listing"</Important> page. This button is usually found on your dashboard or in a menu option like <Important>"Listings"</Important>.</ListItem>
          <ListItem>Carefully fill in all the <Important>required information</Important> about the property. This typically includes:</ListItem>
          <List>
            <ListItem>Property Type (e.g., House, Apartment, Land, Commercial)</ListItem>
            <ListItem>Location (Address, City, Region)</ListItem>
            <ListItem>Price (Sale or Rent)</ListItem>
            <ListItem>Number of Bedrooms and Bathrooms</ListItem>
            <ListItem>Property Size (in square meters or feet)</ListItem>
            <ListItem>Key Features and Amenities (e.g., Parking, Balcony, Security)</ListItem>
            <ListItem><Important>High-quality photos</Important> of the property (upload multiple images for better visibility).</ListItem>
            <ListItem>A detailed <Important>description</Important> of the property and its surroundings.</ListItem>
          </List>
          <ListItem>Once you have filled in all the necessary details and uploaded photos, click the <Important>"Create Listing"</Important> or <Important>"Submit"</Important> button.</ListItem>
          <ListItem><Important>Listing Duration:</Important> Your listing will be active for <Important>28 days</Important>. After this period, you will need to update its availability to keep it listed.</ListItem>
          <ListItem><Important>Updating Availability:</Important> To update the availability of your listing after 28 days, go to your <Important>"Listings"</Important> page, find the relevant listing, and look for an <Important>"Update Availability"</Important> button or option.</ListItem>
          <ListItem><Important>Deleting or Unlisting:</Important>
            <List>
              <ListItem><Important>"Delete"</Important>: This will permanently remove the listing from the platform.</ListItem>
              <ListItem><Important>"Unlist"</Important>: This will make the listing invisible to users but keep the information saved in your account. You can relist it later.</ListItem>
              You can find options to delete or unlist your listings on your <Important>"Listings"</Important> page.
            </List>
          </ListItem>
        </List>

        <SubsectionTitle><FaRocket /> Boosting Your Listing</SubsectionTitle>
        <HelpText>
          To increase the visibility of your listing, you can boost it. Here's how:
        </HelpText>
        <List>
          <ListItem>Navigate to your <Important>"Listings"</Important> page.</ListItem>
          <ListItem>Find the listing you want to boost and look for a <Important>"Boost Listing"</Important> button or option.</ListItem>
          <ListItem>You will be presented with different <Important>boosting packages</Important> or options, often with varying durations and prices.</ListItem>
          <ListItem>Select the duration for which you want to boost your listing (e.g., 3 days, 7 days, 14 days).</ListItem>
          <ListItem>Follow the payment instructions to complete the boosting process. You will likely need to enter your payment details.</ListItem>
          <ListItem>Once the payment is successful, your listing will be boosted and will appear higher in search results and potentially in featured sections for the chosen duration.</ListItem>
        </List>

        <SubsectionTitle><FaArrowUp /> Unboosting Your Listing</SubsectionTitle>
        <HelpText>
          You can stop boosting your listing at any time:
        </HelpText>
        <List>
          <ListItem>Go to your <Important>"Listings"</Important> page.</ListItem>
          <ListItem>Find the currently boosted listing. There will usually be an indicator showing that it's boosted.</ListItem>
          <ListItem>Look for an <Important>"Unboost Listing"</Important> or <Important>"Stop Boosting"</Important> button or option associated with that listing.</ListItem>
          <ListItem>Click the button to stop the boost. Please note that you may not receive a refund for any remaining time on the boost.</ListItem>
        </List>

        {/* Add more Agent/Landlord help topics here */}
        <SubsectionTitle>Managing Inquiries</SubsectionTitle>
        <HelpText>
          You can view and manage inquiries from potential tenants or buyers through your dashboard or a dedicated <Important>"Inquiries"</Important> section. Respond promptly to messages to ensure effective communication.
        </HelpText>

        <SubsectionTitle>Updating Your Profile</SubsectionTitle>
        <HelpText>
          Keep your profile information up-to-date by navigating to the <Important>"Profile"</Important> or <Important>"Account Settings"</Important> page. Ensure your contact details are accurate.
        </HelpText>

      </HelpSection>

      {/* User (Tenant/Buyer) Help */}
      <HelpSection>
        <SectionTitle><FaSearch /> For Tenants and Buyers</SectionTitle>

        <SubsectionTitle>Viewing Listings</SubsectionTitle>
        <HelpText>
          Viewing property listings on Hodii is <Important>free</Important> for all users. You can browse through numerous properties without any initial cost.
        </HelpText>

        <SubsectionTitle><FaPhone /> Accessing Contact Information</SubsectionTitle>
        <HelpText>
          To view the contact information of the agent or landlord for a specific listing, you have two options:
        </HelpText>
        <List>
          <ListItem><Important>Login:</Important> Create an account and log in to the Hodii platform. Once logged in, the contact details will be visible on the listing page.</ListItem>
          <ListItem><Important>Share to WhatsApp:</Important> Alternatively, you can share the listing to at least one WhatsApp group. After successfully sharing, the contact information will be revealed on the listing page.</ListItem>
        </List>

        <SubsectionTitle><FaSearch /> Searching and Filtering Listings</SubsectionTitle>
        <HelpText>
          To find the perfect property, you can use our powerful search and filtering options:
        </HelpText>
        <List>
          <ListItem>Click the <Important>"Search"</Important> button, usually located at the top of the page or within the app.</ListItem>
          <ListItem>A <Important>filter panel</Important> will pop up, allowing you to specify your criteria. Common filters include:</ListItem>
          <List>
            <ListItem><Important>Price Range</Important> (minimum and maximum price)</ListItem>
            <ListItem><Important>Location</Important> (city, region, specific area)</ListItem>
            <ListItem><Important>Property Type</Important> (House, Apartment, Land, Commercial)</ListItem>
            <ListItem><Important>Number of Bedrooms</Important></ListItem>
            <ListItem><Important>Number of Bathrooms</Important></ListItem>
            {/* Add more common filters */}
            <ListItem>Other specific <Important>amenities</Important> and <Important>features</Important>.</ListItem>
          </List>
          <ListItem><Important>Updating Filters:</Important> To remove a filter, simply click the <Important>"x"</Important> or <Important>"clear"</Important> button next to the applied filter. To change a filter, adjust the values within the filter panel and click <Important>"Apply"</Important> or <Important>"Search"</Important> again.</ListItem>
        </List>

        <SubsectionTitle><FaMapMarkerAlt /> Location-Based Search</SubsectionTitle>
        <HelpText>
          Finding properties in specific areas is easy with our location search features:
        </HelpText>
        <List>
          <ListItem><Important>Map Circling:</Important>
            <List>
              <ListItem>Open the <Important>"Map View"</Important> on the search page.</ListItem>
              <ListItem>Use your finger (on mobile) or mouse to draw a circle on the map around the area you are interested in.</ListItem>
              <ListItem>The platform will then display listings only within the circled region.</ListItem>
            </List>
          </ListItem>
          <ListItem><Important>Radius Search from Landmark/Place:</Important>
            <List>
              <ListItem>In the location search bar, type a specific <Important>landmark</Important> or <Important>place name</Important> (e.g., "Ruiru Town Centre", "Thika Level 5 Hospital").</ListItem>
              <ListItem>You will then be able to select a <Important>radius</Important> (e.g., 1km, 5km, 10km) around that landmark to search within.</ListItem>
            </List>
          </ListItem>
          <ListItem><Important>Search from Current Location:</Important>
            <List>
              <ListItem>Ensure your device's location services are enabled.</ListItem>
              <ListItem>On the search page, look for an option like <Important>"Search Near Me"</Important> or a location icon.</ListItem>
              <ListItem>Clicking this will automatically search for listings within a certain radius of your current location.</ListItem>
            </List>
          </ListItem>
        </List>

        <SubsectionTitle><FaStar /> Adding Reviews</SubsectionTitle>
        <HelpText>
          To add a review for a property or agent/landlord, you <Important>must be logged in</Important> to your Hodii account. Once logged in, you will usually find an option to leave a review on the listing page or the agent/landlord's profile.
        </HelpText>

        {/* Add more User help topics here */}
        <SubsectionTitle>Saving Favorite Listings</SubsectionTitle>
        <HelpText>
          You can save listings you are interested in by clicking the <Important>"Save"</Important> or <Important>heart</Important> icon on the listing page. You can then view your saved listings in your account dashboard.
        </HelpText>

        <SubsectionTitle>Contacting Agents/Landlords</SubsectionTitle>
        <HelpText>
          Once you have unlocked the contact information (by logging in or sharing), you can directly contact the agent or landlord via phone or email provided on the listing.
        </HelpText>

        <SubsectionTitle><FaShareAlt /> Sharing Listings</SubsectionTitle>
        <HelpText>
          You can easily share listings with friends or family using the <Important>"Share"</Important> button on the listing page. This will typically allow you to share via various social media platforms or messaging apps.
        </HelpText>

      </HelpSection>
    </HelpCenterContainer>
  );
};

export default HelpCenter;