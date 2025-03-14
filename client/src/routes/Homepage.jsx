import { useEffect, useState } from "react";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import { Link } from "react-router-dom";
import Search from "../components/Search2";
import Maincategories from "../components/MainCategories";
import SideMenu from "../components/SideMenu";
import ThemeToggler from "../components/Theme";
import Sidebar from "../components/Sidebar2";
import { ThemeProvider } from "../../themecontext";
import Navbar from "../components/Navbar";
import CategoriesScroll from "../components/CategoriesScroll";
import Hero from "../components/Hero";
import Partners from "../components/Patners";
import LatestPosts from "../components/LatestPosts";
import PopularPosts from "../components/PopularPosts";
import TrendingPosts from "../components/TrendingPosts";
import StoryLine from "../components/StoryLine";
import Footer from "../components/Footer";
import MobileControls from "../components/MobileControls";
import { Helmet } from "react-helmet";
import axios from "axios"; // Don't forget to import axios!

const Homepage = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch post data dynamically
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const slug = "dynamic-slug"; // Replace with actual logic to get the slug
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
        setData(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching post data:", error);
        setIsLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0); // Scroll to top on page load
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          {isLoading
            ? "Loading... - Book Summaries | Somaway"
            : `${data.title} - Book Summaries | Somaway`}
        </title>
        <meta
          name="description"
          content={
            isLoading
              ? "Explore book summaries and grow with Somaway."
              : data.summary?.slice(0, 160) || "Discover insightful book summaries."
          }
        />
        <meta
          name="keywords"
          content={
            isLoading
              ? "book summaries, Somaway, self-growth"
              : `${data.title}, ${data.author}, ${data.category}, book summary, Somaway`
          }
        />
        <meta
          property="og:title"
          content={
            isLoading
              ? "Book Summaries | Somaway"
              : `${data.title} - Book Summary | Somaway`
          }
        />
        <meta
          property="og:description"
          content={
            isLoading
              ? "Discover insightful book summaries and self-growth resources."
              : data.summary?.slice(0, 160)
          }
        />
        <meta property="og:image" content={data.img || "/default-image.jpg"} />
        <meta property="og:url" content={`${window.location.href}`} />
        <link rel="canonical" href={`${window.location.href}`} />
      </Helmet>

      <Navbar />
      <div className="mb-9 flex flex-col gap-0">
        <Hero />
        <Partners />
        <StoryLine />
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;
