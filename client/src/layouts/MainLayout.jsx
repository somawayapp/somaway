import { Outlet, useLocation } from "react-router-dom";

import { useEffect } from "react";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const homepageBg = document.querySelector(".homepage-bg");

      if (window.scrollY > 1000) {
        homepageBg?.classList.add("fade-out");
        homepageBg?.classList.remove("fade-in");
      } else {
        homepageBg?.classList.add("fade-in");
        homepageBg?.classList.remove("fade-out");
      }
    };

    // Add the homepage-bg class when on the homepage
    if (location.pathname === "/") {
      document.body.classList.add("homepage-bg");
    } else {
      document.body.classList.remove("homepage-bg");
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount to avoid side effects
    return () => {
      document.body.classList.remove("homepage-bg");
      document.body.classList.remove("fade-in");
      document.body.classList.remove("fade-out");
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  


return (

  <div className="container  mx-auto  ">
    <Outlet />

  </div>


  );
};

export default MainLayout;
