



  import { useState, useEffect } from "react";
  import { Link } from "react-router-dom";
  import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
  import ThemeToggler from "./Theme";
  import "../index.css";
  import { AiOutlineMenu } from "react-icons/ai";
  import Avatar from "./Avatar";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { FaSearch, FaTimes } from "react-icons/fa";
  import Search from "./Search";
  import Search2 from "./Search2";
  
  
  const Navbar = () => {
  
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
  

    
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
  
 
  
  

  
    const handleOutsideClick = (e) => {
      if (e.target.id === "popup-overlay") {
        setIsOpen(false);
      }
    };
  
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }, [isOpen]);



  
          return(
          <div  style={{ zIndex: 100004, }}
             className="flex justify-center items-center flex-col relative w-full px-4 md:px-[80px] gap-3 py-2  md:gap-6 flex sticky top-0  text-[var(--TextColor)] bg-[var(--bg)] md:border-b  border-b-[var(--softBg4)] " >
      
      
            <div className="relative w-full  mt-2 gap-2 md:gap-6 flex flex-row items-center  text-[var(--TextColor)]  justify-between  bg-[var(--bg)] "           >
  
  
             {/* Show on medium screens and larger */}
             <Link to="/" className="flex items-center gap-1 text-xl font-bold md:text-3xl hidden md:flex">
              <img src="/airlogo2.png" className="md:h-8" />
             </Link>
    
             <Search2 />

             <div className="flex items-center justify-between flex-row gap-2 md:gap-9">
              <div className="relative"  onClick={() => setOpen((prev) => !prev)}>
              <div className="flex flex-row items-center gap-3">
              <Link
              to="/addlistingreview">
              <button
                type="button"
                className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-[var(--softBg4)] transition cursor-pointer text-[var(--softBg5)]"
              >
                Add Listing
                 </button>
                 </Link>
                <button
                  type="button"
                  className=" p-4 md:py-1 md:pl-4 md:pr-2 border-[1px]  border-[var(--softBg4)]  flex  flex-row  items-center   gap-3   rounded-full   cursor-pointer   hover:shadow-lg shadow-md   transition duration-300"
                >
                  <AiOutlineMenu />
                  <div className="hidden md:flex items-center justify-center">
          
          
           <SignedIn>
            <div className="flex items-center  w-[38px] h-[38px] justify-center">
           <UserButton />
           </div>
           </SignedIn>
  
          
          
           <SignedOut>
           <img
            className="rounded-full text-[14px] w-[38px] h-[38px] select-none"
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
          {open && ( <div
              className="fixed inset-0 bg-black bg-opacity-5 "
              onClick={handleOverlayClick}
              style={{ zIndex: 100015 }} ></div> )}
  



            <div
           className={`inline-flex overflow-y-auto bg-[var(--bg)] rounded-xl border border-[var(--softBg4)] flex-col p-5 items-left justify-left text-[var(--softTextColor)] 
             font-sm text-md rounded-md shadow-md min-w-[19%] fixed top-[10%]  right-3 md:right-[80px] overflow-x-hidden transition-transform ease-in-out ${
           open ? "translate-x-0 visible" : "translate-x-full invisible" }`}

          style={{ zIndex: 100016 }}>
           <div>
  
          </div>
  
     
  
  
         <div className="flex flex-col">
  
          <SignedOut>

            <Link
              to="/register"
              className="block py-2 text-[var(--softTextColor)] font-semibold  hover:text-[#fc3239] p-2 rounded-xl"
            onClick={() => setOpen(false)}          > sign up    
          </Link>   
          </SignedOut>

          <SignedOut>

       <Link
         to="/login"
         className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
          onClick={() => setOpen(false)}          > log in     
               </Link>
         </SignedOut>


          <Link
              to="/"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
             onClick={() => setOpen(false)}          > Home     
            </Link>
            
            <Link
              to="/history"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
             onClick={() => setOpen(false)}          > Reviews     
            </Link>
            <Link
              to="/history"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
             onClick={() => setOpen(false)}          > Property History     
            </Link>

            <SignedIn>
            <Link
              to="/addlisting"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
            onClick={() => setOpen(false)}          > Add listing     
          </Link>
          </SignedIn>

            <Link
              to="/addlistingreview"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
            onClick={() => setOpen(false)}          > Add Review     
          </Link>

           <SignedIn>
            <Link
              to="/profile"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
              onClick={() => setOpen(false)}          > Profile     
             </Link>
             </SignedIn>


             <SignedIn>
              <Link
              to="/listings"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
               onClick={() => setOpen(false)}          > My listings    
               </Link>
             </SignedIn>

             <SignedIn>
              <Link
              to="/wishlist"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
              onClick={() => setOpen(false)}          > My wishlist       
               </Link>
               </SignedIn>

            <Link
              to="/premium"
              className="block py-2 text-[var(--softTextColor)]  hover:text-[#fc3239]  p-2 rounded-xl"
              onClick={() => setOpen(false)}              > Pricing       
              </Link>



            <Link
              to="/about"
              className="block py-2 text-[var(--softTextColor)]  hover:text-[#fc3239]  p-2 rounded-xl"
              onClick={() => setOpen(false)}          > About Us 
            </Link>



            <Link
              to="/help"
              className="block py-2 text-[var(--softTextColor)]  hover:text-[#fc3239]  p-2 rounded-xl"
             onClick={() => setOpen(false)}              > Help center      
              </Link>
            
             <Link  className="block py-2  p-2 "
              onClick={() => setOpen(false)}              >          
                 <ThemeToggler />
             </Link>
             
              </div>
          
          </div>
  
           </div>

            <div className="hidden md:block">
              <Search/>
            </div>
        </div>
    );
  };
  
  export default Navbar;