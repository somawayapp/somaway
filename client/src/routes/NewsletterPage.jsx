import { Link } from "react-router-dom";

const NewsletterPage = () => {
  return (
    <div className="mt-4 px-6 md:px-12 lg:px-24 flex flex-col gap-12">
      {/* BREADCRUMB */}
      <div className="flex gap-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-800">
          Home
        </Link>
        <span>•</span>
        <span className="text-[#1da1f2]">Newsletter</span>
      </div>

      {/* INTRODUCTION */}
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-[#1da1f2] text-3xl md:text-4xl lg:text-5xl font-bold">
          Our Daily Newsletter
        </h1>
        <p className="text-md md:text-xl text-[var(--textColor)] leading-relaxed">
          Subscribe to our newsletter and get smatter in just 5 minutes with the latest tech updates, insights, and exclusive
           content delivered directly in your inbox. From wall street to silicon valley.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-[var(--textColore)] flex flex-col  mb-[160px] lg:flex-row items-center lg:items-stretch gap-6 rounded-lg">
        {/* IMAGE SECTION */}
        <div className="lg:w-1/3 w-full">
          <img
            src="/news.svg"
            alt="Newsletter illustration"
            className="w-full h-full object-cover rounded-l-lg lg:rounded-l-lg lg:rounded-r-none"
          />
        </div>

        {/* TEXT AND FORM SECTION */}
        <div className="lg:w-2/3 w-full flex flex-col justify-center text-white gap-6 p-6">
          {/* TEXT */}
          <h2 className="text-md pb-9 pt-9 leading-relaxed">
          Welcome to Xtech. Every day we'll send you the world's most important tech news, 
          with a hint of wit and humor, so that you start your day informed, knowledgeable, and ready to go.          </h2>
          {/* SUBSCRIPTION FORM */}
          <form className="flex items-center  pb-20 w-full">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-4 py-2 border border-2 border-gray-300 rounded-l-2xl focus:outline-none focus:ring-1 focus:ring-[#1da1f2]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1da1f2] text-white rounded-r-2xl font-medium hover:bg-blue-700 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <p>
        on small screens make the image rounded only at the tops
        reduce the  padding top and bottoms of the text and input bar on small screens
        the input section is spanning past the screen width on small screens i think it is too long
        add a button checkout our latest send
      </p>
    </div>
  );
};

export default NewsletterPage;
