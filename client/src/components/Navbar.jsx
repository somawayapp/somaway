



  import { useState, useEffect } from "react";
  import { Link } from "react-router-dom";
  import ThemeToggler from "./Theme";
  import "../index.css";
  import { AiOutlineMenu } from "react-icons/ai";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { FaSearch, FaTimes } from "react-icons/fa";

  
  
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
             className="flex justify-between  flex-col relative w-full  gap-3 py-2 md:py-3  md:gap-6 flex sticky top-[48px]  text-[var(--TextColor)] bg-[#65026e] md:border-b  border-b-[var(--softBg4)] " >
      
      
            <div className="relative w-full   gap-2 md:gap-6 flex flex-row items-center  text-[var(--TextColor)]  justify-between  px-4 md:px-[5%] "           >
  
  
             {/* Show on medium screens and larger */}
             <Link to="/" className="flex items-center gap-1 text-xl font-bold md:text-3xl hidden md:flex">
              <img src="/shilingi.png" className="md:h-8 rounded-lg" />
             </Link>
              <Link
              to="/addlistingreview">
              <button
                type="button"
                className="md:hidden  text-xs font-semibold border-[1px] border-[#EBD402]  py-2 px-4 rounded-full hover:bg-[#f36dff]
                 transition cursor-pointer text-[#EBD402]"
              >
                join
                 </button>
                 </Link>

           <Link to="/" className="flex items-center gap-1 text-xl font-bold md:text-3xl md:hidden">
              <img src="/shilingi.png" className="h-[50px]" />
             </Link>
    
             <div className="flex ml-[-30%] hidden md:flex items-center text-sm font-semibold justify-between flex-row gap-2 md:gap-9">
             <p className="text-left text-[#f36dff] hover:text-[#f36dff] transition cursor-pointer">1 shiling</p>
            <p className="text-center text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">To Win</p>
            <p className="text-right text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">1 Million</p>             

            </div>


             <div className="flex items-center justify-between flex-row gap-2 md:gap-9">
              <div className="relative"  onClick={() => setOpen((prev) => !prev)}>
              <div className="flex flex-row items-center gap-3">
              <Link
              to="/addlistingreview">
              <button
                type="button"
                className="hidden md:block text-sm font-semibold border-[1px] border-[#EBD402]  py-2 px-4 rounded-full hover:bg-[#f36dff]
                 transition cursor-pointer text-[#EBD402]"
              >
                join
                 </button>
                 </Link>
                <button
                  type="button"
                  className="  py-1 pl-2 md:pl-4 pr-2 border-[1px]  text-[#EBD402]  border-[#EBD402]  flex  flex-row  items-center   gap-2 md:gap-3  rounded-full  
                   cursor-pointer   hover:bg-[#f36dff] shadow-md   transition duration-300"
                >
                  <AiOutlineMenu />
                  <div className="flex items-center justify-center">
          
          
         
  

           <Link
                type="button"
                className=" text-xs md:text-sm font-semibold py-1   md:pr-2 rounded-full transition cursor-pointer"
              >
                Log in
                 
                 </Link>

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

          style={{ zIndex: 100046 }}>
           <div>
  
          </div>
  
     
  
  
         <div className="flex flex-col">


          <Link
              to="/"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
             onClick={() => setOpen(false)}          > Home     
            </Link>


            <Link
              to="/about"
              className="block py-2 text-[var(--softTextColor)]  hover:text-[#fc3239]  p-2 rounded-xl"
              onClick={() => setOpen(false)}          > About Us 
            </Link>


              <Link
              to="/terms"
              className="block py-2 text-[var(--softTextColor)]   hover:text-[#fc3239]  p-2 rounded-xl"
              onClick={() => setOpen(false)}          >Terms & Conditions      
               </Link>

            <Link
              to="/Payment-terms"
              className="block py-2 text-[var(--softTextColor)]  hover:text-[#fc3239]  p-2 rounded-xl"
              onClick={() => setOpen(false)}              > Payment Terms     
              </Link>

             <Link
              to="/Privacy  "
              className="block py-2 text-[var(--softTextColor)]  hover:text-[#fc3239]  p-2 rounded-xl"
              onClick={() => setOpen(false)}              > Privacy policy     
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

      <div className="grid grid-cols-3 md:hidden mb-2 px-6 text-sm font-semibold">
      <p className="text-left text-[#f36dff] hover:text-[#f36dff] transition cursor-pointer">1 shiling</p>
      <p className="text-center text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">To Win</p>
      <p className="text-right text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">1 Million</p>
      </div>


        </div>
    );
  };
  
  export default Navbar;