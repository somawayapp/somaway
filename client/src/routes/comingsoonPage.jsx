import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ComingSoon = () => {
  return (
    <div className="bg-[var(--bg)] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--primaryColor)] mb-4">
            Coming Soon!
          </h1>
          <p className="text-lg md:text-xl text-[var(--softTextColor)] mb-8">
            We're working hard on something awesome. Please check back later!
          </p>
          {/* You can add an optional email signup form or other elements here */}
          {/* <input
            type="email"
            placeholder="Enter your email for updates"
            className="w-full md:w-auto px-4 py-2 rounded-md text-black"
          />
          <button className="bg-[var(--primaryColor)] text-white px-6 py-2 rounded-md ml-2 hover:bg-[var(--secondaryColor)]">
            Subscribe
          </button> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComingSoon;