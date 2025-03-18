import { Link } from "react-router-dom";
import { useEffect } from "react";
const NewsletterPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when this component mounts
  }, []);
  return (
    <div className="mt-4 flex px-3 md:px-9 flex-col gap-12">
      {/* BREADCRUMB */}
      <div className="flex gap-2 text-sm text-[var(--textColor)]">
        <Link className="hover:text-blue-800">
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
            src="/newsletter.jpg"
            className="w-full h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-r-none "
          />
        </div>

        <div className="lg:w-2/3 w-full flex flex-col justify-center text-[var(--textColor)] gap-1 p-2 lg:p-6 md:p-4">
          {/* TEXT */}
          <h2 className="text-md pb-4 pt-0  md:pt-9 md:pb-9 leading-relaxed">
          Welcome to soma. Every day we'll send you the world's most important tech news, 
          with a hint of wit and humor, so that you start your day informed, knowledgeable, and ready to go.          </h2>
        {/* TEXT AND FORM SECTION */}          {/* SUBSCRIPTION FORM */}
          <form className="flex  mb-[30px] md:mb-[60px] items-center w-full">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-4 py-2 text-sm  text-[var(--textColor)] border  border-1 border-[var(--softTextColor7)] rounded-full
               bg-[var(--textColore)] focus:outline-none focus:ring-1 focus:ring-[#0875b9]"
            />
                        <Link to="/login">

            <button
              type="submit"
              className="px-6 py-2.5 text-sm bg-[#1da1f2] text-white ml-[-110px] rounded-full font-medium hover:bg-[#0875b9]
              transition duration-300"
            >
              Subscribe
            </button>
            </Link>

          </form>
        </div>
      </div>
      <p>
      
      </p>
    </div>
  );
};

export default NewsletterPage;
