import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "../index.css";
import Search from "./Search";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleOverlayClick = () => setOpen(false);

  // Disable body scroll when the menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup in case of unmount
    };
  }, [open]);





  return (


    
     // Modify or remove z-index here
     <div style={{ zIndex: 100004 }}  className="relative w-full h-[45px] md:h-[55px] gap-4 flex items-center text-[var(--TextColor)]
      sticky top-0 justify-between bg-[var(--bg)]">
   
   

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-1 text-lg font-bold md:text-2xl">
      <img src="/296.png" alt="Logo" className="w-7 h-7 md:w-8 md:h-8" />
      <span className="bg-clip-text text-[#01274f]  pl-1  font-impact">soma</span>

      {/*   <span className="bg-clip-text text-[#1ADAff] font-impact"></span> */}

</Link>


<div className="md:hidden">
<div className="md:hidden  ">
<div className="flex flex-row mb-3 gap-2">

     <Link
            to="/discover"
            className="w-full text-center mt-3 md:mt-0 sm:w-auto px-4 py-2 md:py-2 bg-[#01274f]   text-white
            text-xs font-semibold rounded-md hover:bg-blue-700  "
          >
            Get Started
          </Link>

      {/* MOBILE MENU */}
        
        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-[var(--textColor)] mt-6 text-sm"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex flex-col gap-1">
            <div
              className={`h-[1px] rounded-md w-5 bg-[var(--textColor)] origin-left transition-all ease-in-out ${
                open && "rotate-45"
              }`}
            ></div>
            <div
              className={`h-[1px] rounded-md w-5 bg-[var(--textColor)] transition-all ease-in-out ${
                open && "opacity-0"
              }`}
            ></div>
            <div
              className={`h-[1px] rounded-md w-5 bg-[var(--textColor)] origin-left transition-all ease-in-out ${
                open && "-rotate-45"
              }`}
            ></div>
          </div>
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
          className={`w-[80%]  overflow-y-auto h-cover bg-[var(--bg)] flex flex-col p-5  mb-[60px]items-left justify-left  text-[var(--TextColor)] 
            gap-8 font-sm text-md fixed top-0 right-0  bottom-0 overflow-x-hidden transition-transform ease-in-out z-50 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}   style={{ maxHeight: "100vh" }}

        >
<div>

</div>

          <button
            className="absolute top-2  right-8 text-md text-[var(--TextColor)]"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>


<div className="flex flex-row">





        <div>


        <div >
        <Link
            to="/discover"
            className="block py-2 text-[var(--TextColor)]  hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Discover          </Link>
          <Link
            to="/premium"
            className="block py-2 text-[var(--TextColor)]  hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Premium          </Link>
          <Link
            to="/about"
            className="block py-2 text-[var(--TextColor)]  hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}          > About Us 
          </Link>
          <Link
            to="/settings"
            className="block py-2 text-[var(--TextColor)]  hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Settings          </Link>
           <Link
            to="/write"
            className="block py-2 text-[var(--TextColor)]  hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Write          </Link>
     <Link
            to="/premium"
            className="block py-2 text-[var(--TextColor)]  hover:bg-gray-500 p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Pricing          </Link>
        </div>
        
        </div>



        </div>





       

          <SignedOut>
          <Link
            to="/login"
            className="w-full items-center  md:ml-2 mr-4 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3
             bg-[#01274f]  text-white font-semibold 
            rounded-md hover:bg-blue-700  "
          >
          Login     
               </Link>
          </SignedOut>

        </div>
      </div>
      </div>


      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12  font-medium">

          <Link className="hover:text-blue-700   " to="/" onClick={() => setOpen(false)} >Home</Link>
           <Link className="hover:text-blue-700   " to="/discover" onClick={() => setOpen(false)}> Discover</Link>
          <Link className="hover:text-blue-700   " to="/premium" onClick={() => setOpen(false)}> Premium</Link>
          <Link className="hover:text-blue-700   " to="/settings" onClick={() => setOpen(false)}>Settings</Link>
          <Link className="hover:text-blue-700   " to="/write" onClick={() => setOpen(false)}>Write</Link>
          <Link className="hover:text-blue-700   " to="/about" onClick={() => setOpen(false)}>About Us</Link>
          <Link
            to="/login"
            className="w-full text-center mt-3 md:mt-0 sm:w-auto px-4 py-3 md:py-2 bg-[#01274f]   text-white
            text-sm font-semibold rounded-md hover:bg-blue-700  "
          >
            Get Started
          </Link>

        <SignedOut>
        <Link
            to="/login"
            className="w-full text-center mt-3 md:mt-0 sm:w-auto px-4 py-3 md:py-2 bg-[var(--textColore3)] text-sm text-[var(--textColor)] 
            font-semibold rounded-md hover:text-white hover:bg-[#01274f]  "
          >
            Login
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