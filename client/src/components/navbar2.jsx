import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "../index.css";
import Search from "./Search";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "./Avatar";

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
     <div style={{ zIndex: 100004 }}  className="relative w-full h-[60px] md:h-[70px]  px-3 md:px-[80px] gap-4 flex items-center text-[var(--TextColor)]
      sticky top-0 justify-between bg-[var(--bg)] md:border-b md:border-b-[var(--softBg4)] ">

<div className="flex items-center justify-between gap-12">
<Link to="/" className="flex items-center text-xl font-bold md:text-3xl sm:block md:hidden">
    <img src="/airlogo.png" className="w-9 h-9" />
  </Link>

  {/* Show on medium screens and larger */}
  <Link to="/" className="flex items-center gap-1 text-xl font-bold md:text-3xl hidden md:flex">
    <img src="/airlogo2.png" className="md:h-8" />
  </Link>
  

</div>

<Search />

     

     <div className="flex items-center justify-between flex-row gap-2 md:gap-9">


    

      

        
   



  <div className="relative"  onClick={() => setOpen((prev) => !prev)}>
      <div className="flex flex-row items-center gap-3">
            <button
              type="button"
              className="hidden md:block text-sm font-bold py-3 px-4 rounded-full hover:bg-[var(--softBg4)] transition cursor-pointer text-[var(--softTextColor)]"
            >
              Add listing
            </button>
              <button
                type="button"
                className=" p-4 md:py-1 md:pl-4 md:pr-2 border-[1px]  border-[var(--softBg4)]  flex  flex-row  items-center   gap-3   rounded-full   cursor-pointer   hover:shadow-md   transition duration-300"
              >
                <AiOutlineMenu />
                <div className="hidden md:flex items-center justify-center">
  <SignedIn>
    <div className="flex items-center justify-center">
      <UserButton />
    </div>
  </SignedIn>

  <SignedOut>
    <img
      className="rounded-full text-[14px] w-[30px] h-[30px] select-none"
      alt="Avatar"
      src="/placeholder.jpg"
    />
  </SignedOut>
</div>

              </button>
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
            className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239] p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Home           </Link>   
     <Link
   to="/"
   className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239]  p-2 rounded-xl"
onClick={() => setOpen(false)}          > Book summaries          </Link>
        <Link
            to="/"
            className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239]  p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Discover          </Link>
          <Link
            to="/premium"
            className="block py-2 text-[var(--TextColor)] font-bold   hover:text-[#fc3239]  p-2 rounded-xl"
   onClick={() => setOpen(false)}          > Premium          </Link>
          <Link
            to="/about"
            className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239]  p-2 rounded-xl"
   onClick={() => setOpen(false)}          > About Us 
          </Link>
          <Link
            to="/settings"
            className="block py-2 text-[var(--TextColor)] font-bold   hover:text-[#fc3239]  p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Settings          </Link>
          
     <Link
            to="/premium"
            className="block py-2 text-[var(--TextColor)] font-bold  hover:text-[#fc3239]  p-2 rounded-xl"
   onClick={() => setOpen(false)}              > Pricing           </Link>
        </div>
        
        </div>



        </div>





       

          <SignedOut>
          <Link
            to="/login"
            className="w-full items-center  md:ml-2 mr-4 text-center  text-md md:text-xl sm:w-auto px-4 md:px-6  py-3 md:py-3
             bg-[#fc3239]  text-white font-semibold 
            rounded-md hover:bg-[#FF5A5F]   "
          >
          Login     
               </Link>
          </SignedOut>

        </div>


   

     
      </div>
  );
};

export default Navbar;