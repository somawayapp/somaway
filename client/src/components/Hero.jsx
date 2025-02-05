import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


const Hero = () => {


  return (
    <div className="flex flex-col mt-0 md:mt-4">
      <div className="flex flex-col lg:flex-row lg:h-[60vh] gap-[100px] mt-4">
        {/* Left Section */}
        <div className="lg:w-1/2 flex flex-col mt-0 md:mt-9 items-start gap-1 md:gap-4 rounded-md">
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--textColor)]">
            #1 most
          </h1>
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--textColor)]">
            popular <span className="text-[#01274f]  ">book </span>
          </h1>
          <h1 className="text-4xl lg:text-5xl font-bold text-[var(--textColor)]">
            <span className="text-[#01274f]  ">summary</span> app
          </h1>
          <p className="text-md md:text-xl text-[var(--textColor)]">
            Achieve your goals with somaAI by listening and reading the world’s best ideas
          </p>
          <Link
            to="/login"
            className="w-full text-center mt-3 md:mt-0 sm:w-auto px-4 md:px-12 py-3 md:py-3 bg-[#01274f]   text-white font-semibold
             rounded-md hover:bg-blue-700  "
          >
            Get Started
          </Link>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 flex mt-[-53px] md:mt-0 flex-col">
          {/* First Featured Post */}
          <div className="flex mb-8 md:mb-0 top-0">
              <img
                src="/desktop.webp"
                alt="Newsletter illustration"
                className="hidden sm:block w-full object-cover rounded-lg"
              />
              <img
                src="/mobile.webp"
                alt="Newsletter illustration"
                className="block sm:hidden w-full object-cover rounded-lg"
              />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Hero;
