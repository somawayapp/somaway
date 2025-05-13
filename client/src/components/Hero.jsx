import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


const Hero = () => {


  return (
    <div className="flex mb-0 md:mb-[100px] px-3 md:px-9 flex-col mt-0 md:mt-4">
      <div className="flex flex-col lg:flex-row lg:h-[60vh] gap-[100px] mt-4">
        {/* Left Section */}
        <div className="lg:w-4/9 flex flex-col mt-0 md:mt-9 items-start gap-1 md:gap-4 rounded-md">
          <h1 className="text-4xl lg:text-6xl font-bold text-[var(--textColor)]">
            #1 most
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--textColor)]">
          popular   <span className="text-[#fc3239]  ">book </span>
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--textColor)]">
            <span className="text-[#fc3239]  ">summary</span> app
          </h1>
          <p className="text-md md:text-xl text-[var(--textColor)]">
            Achieve your goals with  Hodii by listening and reading the world’s best ideas
          </p>
          <Link
            to="/login"
            className="w-full text-center mt-3 md:mt-0 sm:w-auto px-4 md:px-12 py-3 md:py-3bg-[#2F74FD]  text-white font-semibold
             rounded-md hover:bg-[#0556f7]   "
          >
            Get Started
          </Link>
        </div>
        <div className="lg:w-1/9 flex mt-[-53px] md:mt-[-40px] flex-col">
          </div>
        {/* Right Section */}
        <div className="lg:w-4/9 flex mt-[-53px] md:mt-[-40px] flex-col">
          {/* First Featured Post */}
          <div className="flex mb-8 md:mb-[50px] top-0">
              <img
                src="/desktop.webp"
                className="hidden sm:block w-full object-cover rounded-lg"
              />
              <img
                src="/mobile.webp"
                className="block sm:hidden w-full object-cover rounded-lg"
              />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Hero;
