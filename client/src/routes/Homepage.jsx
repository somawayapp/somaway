import { useEffect, useState, useRef } from "react";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import Maincategories from "../components/MainCategories";
import SideMenu from "../components/SideMenu";
import ThemeToggler from "../components/Theme";
import Sidebar from "../components/Sidebar2";
import { ThemeProvider } from "../../themecontext";
import Navbar from "../components/Navbar";


const Homepage = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const searchRef = useRef(null);
  const shareRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY <=600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        showSearch
      ) {
        setShowSearch(false);
      }
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target) &&
        showShare
      ) {
        setShowShare(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch, showShare]);

  return (
      <div>
            <Navbar/>

    <div className="mb-9   flex flex-col gap-0">


      {/* Floating Section */}
      <div
  className={` flex items-center mx-auto justify-between px-5 py-3 transition-opacity 
    duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"} sm:opacity-100 sm:pointer-events-auto  `}
 
>

        {/* 

        <Link to="/" className="flex items-center mt-[10px] gap-1 text-lg font-bold md:text-2xl">
        <img src="/x.png" alt="Logo" className="w-50 h-20 lg:w-50 lg:h-20" />

<span className="text-[var(--textLogo)] text-[30px] lg:text-[90px]"></span>

</Link>  */}

      

 
      </div>



      {/* MAIN CONTENT */}
      <div className="bg-[var(--textColore)] flex flex-col border  border-2 border-[var(--textColore)]   mb-[40px] lg:flex-row items-center
       lg:items-stretch gap-6 rounded-none">
        {/* IMAGE SECTION */}
        <div className="lg:w-1/3 w-full">
          <img
            src="/logo3.jpg"
            alt="Newsletter illustration"
            className="w-full h-full object-cover :rounded-r-none"
          />
        </div>

        {/* TEXT AND FORM SECTION */}
        <div className="lg:w-2/3 w-full flex flex-col justify-center text-white gap-1 p-2">
          {/* TEXT */}
          <h2 className="text-sm text-[var(--textColor)] leading-relaxed">        </h2>
          {/* SUBSCRIPTION FORM */}
          <form className="flex   items-center w-full">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-4 py-2 text-sm  text-[var(--textColor)] border  border-1 border-[var(--softTextColor7)] rounded-full
               bg-[var(--textColore)] focus:outline-none focus:ring-1 focus:ring-[#0875b9]"
            />
            <Link to="/login">

            <button
              type="submit"
              className="px-6 py-2.5 text-sm bg-[#1da1f2] text-white ml-[-110px] rounded-full font-medium hover:bg-[#0875b9]
              transition duration-300"
            >
              Subscribe
            </button>   
            </Link>
          </form>
        </div>
      </div>

   {/*

      <div  style={{ zIndex: 100004 }} className="mb-[45px] md:mb-[30px] mt-[15px] md:mt-[20px] sticky top-0.5 md:top-2 ">
  <Maincategories />
</div>
     */}

   <FeaturedPosts />




      {/* Recent Posts */}
      <div>
      <h1 className="my-8 lg:text-[50px] text-3xl ml-2 mb-10 mt-10 lg:mb-20 lg:mt-20  text-[#1da1f2] font-bold">Recent Posts</h1>
    
      
      <div className="flex flex-row justify-between">
      <div className="w-full md:w-3/4 pr-0 md:pr-10">
      <PostList />
      <ThemeToggler />

  </div>
  <div className="hidden md:block w-1/4">
    <SideMenu />
    <ThemeToggler />
    

  </div>
</div>



    
      </div>
    </div>
    </div>

  );
};

export default Homepage;
