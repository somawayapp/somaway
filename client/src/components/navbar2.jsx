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
     <div style={{ zIndex: 100004 }}  className="relative w-full h-[50px] md:h-[70px]  px-3 md:px-[80px] gap-4 flex items-center text-[var(--TextColor)]
      sticky top-0 justify-between bg-[var(--bg)] border-b border-b-[var(--softBg4)] ">

<div className="flex items-center justify-between gap-12">
<Link to="/" className="flex items-center text-xl font-bold md:text-3xl sm:block md:hidden">
    <img src="/airlogo.png" className="w-8 h-8" />
  </Link>

  {/* Show on medium screens and larger */}
  <Link to="/" className="flex items-center gap-1 text-xl font-bold md:text-3xl hidden md:flex">
    <img src="/airlogo2.png" className="md:h-8" />
  </Link>
  

</div>

<div className="hidden md:flex flex-1 justify-center space-x-12">
    <Link className=" text-[13px] md:text-[15px] cursor-pointer text-[var(--softTextColor)]
             font-semibold hover:bg-[var(--softBg4)] bg[var(--bg)] rounded-3xl py-2 px-4" to="/" onClick={() => setOpen(false)}>For rent</Link>
    <Link className=" text-[13px] md:text-[15px] cursor-pointer text-[var(--softTextColor)]
              hover:bg-[var(--softBg4)] bg[var(--bg)] rounded-3xl py-2 px-4" to="/" onClick={() => setOpen(false)}>For sale</Link>
  </div>
     

     <div className="flex items-center justify-between flex-row gap-2 md:gap-9">

     <Link
            to="/"
            className="text-center hidden md:block text-[13px] md:text-[15px] cursor-pointer text-[var(--softTextColor)]
             font-semibold hover:bg-[var(--softBg4)] bg[var(--bg)] rounded-3xl py-2 px-4
              "
          > airbnb your home
            
          </Link>

    

        <SignedIn>
          <UserButton />
        </SignedIn>

        
        {/* MOBILE BUTTON */}
        <div
  className="cursor-pointer text-[var(--textColor)] text-sm border-[2px] border-[var(--softBg4)] hover:shadow-xl p-2 rounded-3xl flex items-center gap-4"
  onClick={() => setOpen((prev) => !prev)}
>
  <div className="flex flex-col gap-[2px]">
    <div
      className={`h-[2px] rounded-md w-3 bg-[var(--softTextColor)] origin-left transition-all ease-in-out ${
        open && "rotate-45"
      }`}
    ></div>
    <div
      className={`h-[2px] rounded-md w-3 bg-[var(--softTextColor)] origin-left transition-all ease-in-out ${
        open && "opacity-0"
      }`}
    ></div>
    <div
      className={`h-[2px] rounded-md w-3 bg-[var(--softTextColor)] origin-left transition-all ease-in-out ${
        open && "-rotate-45"
      }`}
    ></div>
  </div>



    {/* Person icon */}
    <div className="w-[30px] h-[30px] rounded-full bg-[var(--softTextColor)] flex items-center justify-center">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="300"
    height="300"
    viewBox="0 0 24 24"
    fill="var(--bg)"
  >
    <defs>
      <clipPath id="vesica">
        <circle cx="12" cy="12" r="7" />
      </clipPath>
    </defs>
    <circle cx="12" cy="5" r="7" fill="var(--bg)" clip-path="url(#vesica)" />
    <circle cx="12" cy="3" r="3" fill="var(--bg)" />
  </svg>
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
          className={`w-[80%] md:w-[20%]  overflow-y-auto h-cover bg-[var(--bg)] flex flex-col p-5 items-left justify-left  text-[var(--TextColor)] 
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
            to="/"
            className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#FF5A5F] p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Home           </Link>   
     <Link
   to="/"
   className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#FF5A5F]  p-2 rounded-xl"
onClick={() => setOpen(false)}          > Book summaries          </Link>
        <Link
            to="/"
            className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#FF5A5F]  p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Discover          </Link>
          <Link
            to="/premium"
            className="block py-2 text-[var(--TextColor)] font-bold   hover:text-[#FF5A5F]  p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Premium          </Link>
          <Link
            to="/about"
            className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#FF5A5F]  p-2 rounded-xl"
   onClick={() => setOpen(false)}          > About Us 
          </Link>
          <Link
            to="/settings"
            className="block py-2 text-[var(--TextColor)] font-bold   hover:text-[#FF5A5F]  p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Settings          </Link>
          
     <Link
            to="/premium"
            className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#FF5A5F]  p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Pricing           </Link>
        </div>
        
        </div>



        </div>





       

          <SignedOut>
          <Link
            to="/login"
            className="w-full items-center  md:ml-2 mr-4 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3
             bg-[#FF5A5F]  text-white font-semibold 
            rounded-md hover:bg-[#ff4d52]   "
          >
          Login     
               </Link>
          </SignedOut>

        </div>


   

     
      </div>
  );
};

export default Navbar;