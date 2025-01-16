

      
import { useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "../index.css"; // Assuming styles are in App.css
import Search from "./Search";


const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleOverlayClick = () => setOpen(false);







  return (


    
     // Modify or remove z-index here
     <div style={{ zIndex: 100004 }}  className="relative w-full h-[55px] gap-4 md:h-[55px] flex items-center text-[var(--TextColor)] sticky top-0 justify-between bg-[var(--bg)]">
   
   

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-1 text-lg font-bold md:text-2xl">
      <img src="/logo7.png" alt="Logo" className="w-6 h-6 md:w-8 md:h-8" />
      <span className="bg-clip-text text-blue-500 pl-1  font-impact">soma</span>

      {/*   <span className="bg-clip-text text-[#1ADAff] font-impact"></span> */}

</Link>






      {/* MOBILE MENU */}
      <div className="md:hidden">
        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-[var(--textColor)] text-sm"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex flex-col gap-1">
            <div
              className={`h-[1px] rounded-md w-4 bg-[var(--textColor)] origin-left transition-all ease-in-out ${
                open && "rotate-45"
              }`}
            ></div>
            <div
              className={`h-[1px] rounded-md w-4 bg-[var(--textColor)] transition-all ease-in-out ${
                open && "opacity-0"
              }`}
            ></div>
            <div
              className={`h-[1px] rounded-md w-4 bg-[var(--textColor)] origin-left transition-all ease-in-out ${
                open && "-rotate-45"
              }`}
            ></div>
          </div>
        </div>

        {/* DARK OVERLAY */}
        {open && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleOverlayClick}
          ></div>
        )}

        {/* MOBILE LINK LIST */}
        <div
          className={`w-[80%]  overflow-y-auto h-cover bg-[#1da1f2] flex flex-col p-5  mb-[60px]items-left justify-left  text-[var(--TextColor)] 
            gap-8 font-sm text-md fixed top-0 right-0  transition-transform ease-in-out z-50 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}   style={{ maxHeight: "100vh" }}

        >
<div>

</div>
<Search/>

          <button
            className="absolute top-2  right-8 text-md text-[var(--TextColor)]"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>


<div className="flex flex-row">


<div>
  <Link
    to="/posts"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}    

  >
    All Posts
  </Link>
  <Link
    to="/posts?cat=apps"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Apps
  </Link>
  <Link
    to="/posts?cat=software"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Software
  </Link>
  <Link
    to="/posts?cat=health"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Health
  </Link>
  <Link
    to="/posts?cat=climate"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Climate
  </Link>
  <Link
    to="/posts?cat=cloud"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Cloud
  </Link>
  <Link
    to="/posts?cat=commerce"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Commerce
  </Link>
  <Link
    to="/posts?cat=crypto"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Crypto
  </Link>
  <Link
    to="/posts?cat=fintech"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Fintech
  </Link>
  <Link
    to="/posts?cat=gaming"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Gaming
  </Link>
  <Link
    to="/posts?cat=gadgets"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Gadgets
  </Link>
  <Link
    to="/posts?cat=security"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Security
  </Link>
  <Link
    to="/posts?cat=space"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Space
  </Link>
  <Link
    to="/posts?cat=startups"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Startups
  </Link>
  <Link
    to="/posts?cat=transportation"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Transportation
  </Link>
  <Link
    to="/posts?cat=hardware"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Hardware
  </Link>
  <Link
    to="/posts?cat=ai-robotics"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    AI & Robotics
  </Link>
  <Link
    to="/posts?cat=entertainment"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Entertainment
  </Link>
  <Link
    to="/posts?cat=media"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Media
  </Link>
  <Link
    to="/posts?cat=industrial"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Industrial
  </Link>
  <Link
    to="/posts?cat=engineering"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Engineering
  </Link>
  <Link
    to="/posts?cat=energy"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Energy
  </Link>
  <Link
    to="/posts?cat=science"
    className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}  >
    Science
  </Link>
</div>





        <div>
          <Link
            to="/posts?sort=newest"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl "
          >Newest          </Link>
          <Link
            to="/posts?sort=popular"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Popular          </Link>
          <Link
            to="/posts?sort=trending"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Trending
          </Link>
          <Link
            to="/posts?sort=oldest"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Oldest         </Link>
        


        <div className="mt-5">
          <Link
            to="/newsletter"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl "
          >Newsletter          </Link>
          <Link
            to="/premium"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Premium          </Link>
          <Link
            to="/about"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}          > About Us 
          </Link>
          <Link
            to="/settings"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Settings          </Link>
           <Link
            to="/write"
            className="block py-2 text-white hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Write          </Link>
        </div>
        
        </div>



        </div>





       

          <SignedOut>
            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="py-2 px-4 rounded-3xl bg-white text-black">
                Login 👋
              </button>
            </Link>
          </SignedOut>

        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12  font-medium">

<Link className="hover:text-[#1DA1F2] " to="/" onClick={() => setOpen(false)} >Home</Link>
          <Link className="hover:text-[#1DA1F2] " to="/newsletter" onClick={() => setOpen(false)}>Newsletter</Link>
          <Link className="hover:text-[#1DA1F2] " to="/premium" onClick={() => setOpen(false)}> Premium</Link>
          <Link className="hover:text-[#1DA1F2] " to="/settings" onClick={() => setOpen(false)}>Settings</Link>
          <Link className="hover:text-[#1DA1F2] " to="/write" onClick={() => setOpen(false)}>Write</Link>
          <Link className="hover:text-[#1DA1F2] " to="/about" onClick={() => setOpen(false)}>About Us</Link>


        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-[#1DA1F2] text-white">
              Login 👋
            </button>
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;