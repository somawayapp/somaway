
        
import { Link } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { MdSearch } from 'react-icons/md'; // Material Design style
import { SignedOut } from "@clerk/clerk-react";
import { SignedIn } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";

const MainCategories = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Toggle search bar
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle menu dropdo]wn

  return (
    <div className=" max-w-[1000px] mx-auto bg-[#1da1f2]/95 rounded-full  shadow-lg ">
      {/* Navigation container */}
      <div className="flex items-center text-[#e6e6ff] justify-between px-2 py-1.5">
        {/* Categories or Search Bar */}
        <div className="flex flex-1  items-center">
          {!isSearchOpen ? (
            <div
              className={`${
                isMenuOpen ? "hidden" : "hidden"
              } lg:flex items-center flex-wrap text-[14px] gap-1 overflow-x-auto hidden sm:hidden md:block whitespace-nowrap`}
            >
              <Link
                to="/newsletter"
                className="bg-[var(--bg2)]  text-[var(--textColor)] rounded-full px-4 py-2.5"
              >
                Newsletter
              </Link>
              <Link
                to="/discover?sort=newest"
                className="hover:bg-[var(--bg2)]  hover:text-[var(--textColor2)]  hover:text-[var(--textColor2)] rounded-full px-2 py-1"
              >
                Latest

              </Link>
              <Link
                to="/discover?sort=popular"
                className="hover:bg-[var(--bg2)]  hover:text-[var(--textColor2)]  rounded-full px-2 py-1"
              >
                Most Popular
              </Link>
              <Link
                to="/discover?sort=trending"
                className="hover:bg-[var(--bg2)]  hover:text-[var(--textColor2)]  rounded-full px-2 py-1"
              >
                Top Trending
              </Link>
              <Link
                              to="/discover?sort=oldest"

                className="hover:bg-[var(--bg2)]  hover:text-[var(--textColor2)]  rounded-full px-2 py-1"
              >
              Oldest            
              </Link>
              <Link
                to="/about"
                className="hover:bg-[var(--bg2)]  hover:text-[var(--textColor2)]   rounded-full px-2 py-1"
              >
                About Us
              </Link>
            </div>
          ) : (
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-4 py-2 text-white bg-gray-900 rounded-full focus:outline-none"
            />
          )}
        </div>

        {/* Right-side icons and controls */}
        <div className="flex items-center py-[0.8px] space-x-2  w-full sm:w-auto">
  {/* User and Sign In */}
  <div className="flex items-center space-x-1 lg:space-x-5 w-full justify-between sm:justify-start sm:w-auto">

  <div className="flex items-center space-x-2 ">
    <Link
      to="/newsletter"
      className={`bg-[var(--bg2)]  text-[var(--textColor)] sm:block md:hidden rounded-full px-4 py-2 ${isSearchOpen ? "hidden" : "block"}`}
    >
      Newsletter
    </Link>

    <SignedOut>
      <Link 
        to="/login" 
        className={`px-1 py-3 md:py-2 flex flex-row items-center border-white text-xs md:text-sm text-white ${isSearchOpen ? "hidden" : "block"}`}
      >         
        <img src="/user.png" width={24} height={24} />
        <span className="whitespace-nowrap">Sign In</span>
        </Link>
    </SignedOut>
  </div>

  <SignedIn>
  <Link 
        to="/profile" 
        className={`px-1 py-3 md:py-2 flex flex-row items-center border-white text-xs md:text-sm text-white ${isSearchOpen ? "hidden" : "block"}`}
      >         
        <img src="/user.png"  width={24} height={24} />
        <span className="whitespace-nowrap">Profile</span>

   </Link> 
   </SignedIn>



  <button
    onClick={() => setIsSearchOpen(!isSearchOpen)}
    className=" text-white"
  >
    {isSearchOpen ? <FaTimes/> : 
      <img
        src="/search.png"
        width={24}
        height={24}
      />
    }
  </button>

  {/* Menu icon */}
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="p-2 text-white"
  >
    <div
      className="cursor-pointer text-[var(--textColor)] text-sm"
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="flex flex-col">
        <div className={`h-[1px] mb-[3px] rounded-md w-4 bg-[#dfecf5] origin-left transition-all ease-in-out`}></div>
        <div className={`h-[1px] mb-[3px] rounded-md w-4 bg-[#dfecf5] transition-all ease-in-out`}></div>
        <div className={`h-[1px] mb-[3px] rounded-md w-4 bg-[#dfecf5] transition-all ease-in-out`}></div>
        <div className={`h-[1px] rounded-md w-4 bg-[#dfecf5] origin-left transition-all ease-in-out`}></div>
      </div>
    </div>
  </button>
</div>
</div>

      </div>

      {/* Categories dropdown for menu */}
      {isMenuOpen && !isSearchOpen && (
        <div className="flex flex-row  absolute top-full mt-2 left-0 w-full text-[14px] gap-1  md:gap-24 rounded-2xl shadow-lg bg-[#1da1f2]/95 p-4 z-10">
         
         <div>
  <Link
    to="/posts"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    All Books
  </Link>
  <Link
    to="/discover?cat=apps"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Apps
  </Link>
  <Link
    to="/discover?cat=software"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Software
  </Link>
  <Link
    to="/discover?cat=health"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Health
  </Link>
  <Link
    to="/discover?cat=climate"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Climate
  </Link>
  <Link
    to="/discover?cat=cloud"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Cloud
  </Link>
  <Link
    to="/discover?cat=commerce"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Commerce
  </Link>
  <Link
    to="/discover?cat=crypto"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Crypto
  </Link>
  <Link
    to="/discover?cat=fintech"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Fintech
  </Link>
  <Link
    to="/discover?cat=gaming"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Gaming
  </Link>
  <Link
    to="/discover?cat=gadgets"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Gadgets
  </Link>
  <Link
    to="/discover?cat=security"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Security
  </Link>
  <Link
    to="/discover?cat=space"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Space
  </Link>
  <Link
    to="/discover?cat=startups"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Startups
  </Link>
  <Link
    to="/discover?cat=transportation"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Transportation
  </Link>
  <Link
    to="/discover?cat=hardware"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Hardware
  </Link>
  <Link
    to="/discover?cat=ai-robotics"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    AI & Robotics
  </Link>
  <Link
    to="/discover?cat=entertainment"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Entertainment
  </Link>
  <Link
    to="/discover?cat=media"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Media
  </Link>
  <Link
    to="/discover?cat=industrial"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Industrial
  </Link>
  <Link
    to="/discover?cat=engineering"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Engineering
  </Link>
  <Link
    to="/discover?cat=energy"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Energy
  </Link>
  <Link
    to="/discover?cat=science"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
  >
    Science
  </Link>
</div>





        <div>
          <Link
            to="/discover?sort=newest"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl "
          >Newest          </Link>
          <Link
            to="/discover?sort=popular"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
          > Popular          </Link>
          <Link
            to="/discover?sort=trending"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
          > Trending
          </Link>
          <Link
            to="/discover?sort=oldest"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
              > Oldest         </Link>
        
        </div>




        <div>
          <Link
            to="/newsletter"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl "
          >Newsletter          </Link>
          <Link
            to="/premium"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
          > Premium          </Link>
          <Link
            to="/about"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
          > About Us 
          </Link>
          <Link
            to="/settings"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
              > Settings          </Link>
       
        </div>
        
        </div>
      )}
    </div>
  );
};

export default MainCategories;
