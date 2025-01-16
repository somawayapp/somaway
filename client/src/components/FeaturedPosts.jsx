import { Link } from "react-router-dom";
import Image from "./Image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import AdChanger from "./Adchanger";

const fetchPost = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?featured=true&limit=9&sort=newest`
  );
  return res.data;
};

const truncateText = (text, length) =>
  text.length > length ? text.substring(0, length) + "..." : text;

const FeaturedPosts = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["featuredPosts"],
    queryFn: fetchPost,
  });

  if (isLoading) return "Loading...";
  if (error) return "Something went wrong! " + error.message;

  const posts = data?.posts;
  if (!posts || posts.length < 9) {
    return null; // Ensure there are enough posts
  }

  return (
    <div className="flex flex-col  gap-1 md:gap-6 mt-0 md:mt-4">
<div className="flex flex-col lg:flex-row lg:h-[60vh] gap-[100px] mt-4">

      {/* Left Section */}
      <div className="lg:w-1/2 flex flex-col items-start gap-1 md:gap-4   rounded-md">
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--textColor)]">
          #1 most 
        </h1>
        <h1 className="text-4xl lg:text-5xl font-bold text-[var(--textColor)]">
           downloaded <span className="text-blue-600">book </span> 
        </h1> <h1 className="text-4xl lg:text-5xl font-bold text-[var(--textColor)]">
           <span className="text-blue-600"> summary</span> app
        </h1>

        <p className=" text-md text-[var(--textColor)]">
          Achieve your goals with Headway by listening and reading the world’s best ideas
        </p>
        <Link
  to="/login"
  className="w-full text-center sm:w-auto px-4 py-3 md:py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
>
  Get Started
</Link>

      </div>
    


      {/* Right Section */}
      <div className="lg:w-1/2 flex flex-col ">
        {/* First Featured Post */}
        <div className="flex  mb-8 md:mb-0 top-0  ">
        <Link to={`/${posts[0].slug}`} className="relative w-full">
  {/* For larger screens */}
  <img
    src="/desktop.webp"
    alt="Newsletter illustration"
    className="hidden sm:block w-full object-cover rounded-lg"
  />
  {/* For smaller screens */}
  <img
    src="/mobile.webp"
    alt="Newsletter illustration"
    className="block sm:hidden w-full object-cover rounded-lg"
  />
</Link>

     
        </div>

      </div>
      

      </div>

      
        {/* Featured Section Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">Featured</h3>
          <p className="text-gray-600">Featured posts for you</p>
        </div>

        {/* Additional Featured Posts */}
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-4">
          {posts.slice(1, 8).map((post, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Link to={`/${post.slug}`} className="relative w-full" style={{ paddingTop: '150%' }}>
                <Image
                  src={post.img}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                />
              </Link>
              <Link
                to={`/posts?category=${post.category}`}
                className="text-[var(--textColor)] text-xs font-semibold "
              >
                {post.category}
              </Link>
            </div>
          ))}
        </div>
    </div>
  );
};

export default FeaturedPosts;



