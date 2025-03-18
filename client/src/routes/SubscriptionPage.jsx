import React from 'react';
import { useLocation } from 'react-router-dom';
import Paypal from '../components/Paypal';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';


const SubscriptionPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when this component mounts
  }, []);
  const location = useLocation();
  const { planPrice, planName } = location.state || {};

  React.useEffect(() => {
    if (planPrice && planName) {
      console.log(`Plan Selected: ${planName}, Price: $${planPrice}`);
    }
  }, [planPrice, planName]);

  if (!planPrice || !planName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--textColor)] text-lg">No plan selected. Please go back and select a subscription plan.</p>
      </div>
    );
  }

  return (
<div>
  <Navbar/>     
  

  <div className="flex flex-col max-w-[1200px] px-3 md:px-9 rounded-3xl md:rounded-[20px] bg-[var(--softBg)] mb-[80px]  mx-auto mt-4 md:mt-9">
      <div className="flex flex-col lg:flex-row  min-h-[93vh] gap-[100px] ">
        {/* Left Section */}
        <div className="lg:w-1/2 flex flex-col pl-2 pr-2 pb-20 pt-4 md:p-[50px]  bg-[#7a00da]  items-center md:items-start gap-1 md:gap-4 
        rounded-tl-xl rounded-tr-xl md:rounded-tr-none md:rounded-bl-xl ">
       <div className="flex flex-row items-center gap-2">
  <Link to="/premium">
    <FontAwesomeIcon
      icon={faArrowLeft}
      className="text-[var(--textColor)] h-[15px] md:h-[20px] text-orange-500"
    />
  </Link>

  <SignedIn>
    <UserButton />
  </SignedIn>




  <p className="font-extrabold text-xs bg-orange-500 py-2 px-3 rounded-[20px] text-white">
    Check Out
  </p>
</div>

<>
  <div className="text-center sm:text-left">
    <h1 className="text-xl lg:text-2xl font-bold text-white">
      Try  Somaway's premium
    </h1>
    <p className="text-6xl font-bold text-white">{planPrice}</p>
    <p className="text-lg font-bold text-white mt-2">{planName} Subscription</p>
    <h1 className="text-sm lg:text-md font-bold text-gray-100">
      Get smarter in just 5 minutes
    </h1>
    <h1 className="text-sm lg:text-md font-bold text-gray-100">
      With unlimited access to the world's top best-selling non-fiction books
    </h1>
  </div>
</>

     
          <p className="text-md md:text-lg text-gray-400 italic absolute bottom-5">
            Powered by <span className="text-xl md:text-2xl font-bold"> Somaway</span>
                </p>

      
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 flex mt-[-53px] md:mt-0 flex-col">
          {/* First Featured Post */}
          <div className=" flex flex-col  mb-8 hidden sm:block   p-2 md:p-20 md:mb-0 top-0">
          <img
                src="/desktop.webp"
                className=" w-full object-cover rounded-lg"
              />
              <Paypal price={planPrice} />

          </div>

          <div className="flex block sm:hidden flex-col p-2 mb-8 md:mb-0 top-0">
          <Paypal price={planPrice} />

              <img
                src="/mobile.webp"
                className=" w-full object-cover rounded-lg"
              />

          </div>
        </div>
      </div>





      </div>
      </div>


  );
};

export default SubscriptionPage;
