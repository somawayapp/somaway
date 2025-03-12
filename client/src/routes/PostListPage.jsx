
import { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from react-router-dom
import Search from "../components/Search";
import { Link } from "react-router-dom";
import CategoriesScroll from "../components/CategoriesScroll";
import Discover from "../components/Discover";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PopularPosts from "../components/PopularPosts";
import LatestPosts from "../components/LatestPosts";
import TrendingPosts from "../components/TrendingPosts";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";

import { useEffect } from "react";


const PostListPage = () => {

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when this component mounts
  }, []);
  
  const [open, setOpen] = useState(false);
  const location = useLocation(); // Get the current location object

  // Use URLSearchParams to extract query parameters from the URL
  const params = new URLSearchParams(location.search);

  // Extract the 'category', 'sort', 'author', 'search', and 'cat' parameters (if available)
  const sort = params.get("sort");
  const author = params.get("author");
  const search = params.get("search");
  const cat = params.get("cat"); // Extract 'cat' parameter

  // Build the display string based on available parameters
  const displayText = [
    search ? `Search: ${search}` : "",
    sort ? `Sort: ${sort}` : "",
    author ? `Author: ${author}` : "",
    cat ? `Category: ${cat}` : "", // Display 'cat' if present
  ]
    .filter(Boolean) // Remove empty strings
    .join(" | ") || "All summaries"; // Default to "All Books" if no filters are applied

  return (
   <div>
    
   </div>
  );
};

export default PostListPage;



 
