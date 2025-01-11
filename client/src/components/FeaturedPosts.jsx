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
    <>{/* Layout for large screens only */}
{/* Layout for large screens only */}
<div className=" lg:grid grid-cols-12 gap-6 mt-4">

{/* First column: First post (takes half the width, spans 6 out of 12) */}
<div className="col-span-6 flex flex-col gap-6 lg:gap-[3] lg:mb-[15px] mb-[30px] relative">
  {posts[0].img && (
    <Link to={`/${posts[0].slug}`} className="relative">
      <div className="relative w-full" style={{ paddingTop: '100%' }}> {/* Square container */}
        <Image
          src={posts[0].img}

          
          className="absolute top-0 left-0 w-full h-full object-cover" 
       />
       <div 
          className="absolute inset-0 bg-black opacity-40 " 
       />
       


        <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">

          <Link
              to={`/posts?category=${posts[0].category}`}
              className="text-md font-semibold uppercase"
              >
              {posts[0].category}
              </Link>
          <br />
          <Link
            to={`/${posts[0].slug}`}
            className="text-2xl lg:text-4xl font-bold leading-snug mt-2 block"
          >
            {window.innerWidth > 1024
              ? posts[0].title
              : truncateText(posts[0].title, 130)}
          </Link>


          <br />
          <Link
    className="text-md text-gray-300 font-base "
    to={`/posts?author=${posts[0].user.username}`}
    onClick={(e) => e.stopPropagation()}
  >
    { posts[0].user.username}
  </Link>
  <span     className="text-md p-1 text-gray-300 font-base "
  >-</span>
 
  <span     className="text-md text-gray-300 font-base "
  >{format( posts[0].createdAt)}</span>
        </div>
      </div>
    </Link>


  )}
</div>




{/* Second column: Second and third post (stacked vertically, takes half the width, spans 3 out of 12) */}
<div className="col-span-3 flex mb-[25px]  md:mb-[0px] flex-col gap-6 lg-gap:[3]">
  {[posts[1], posts[2]].map((post, index) => post && (
    <div key={index} className="w-full relative">
      <Link to={`/${post.slug}`} className="relative">
        <div className="relative w-full" style={{ paddingTop: '100%' }}> {/* Square container */}
          <Image
            src={post.img}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-40" /> {/* Dark overlay */}
          {/* Post title on top of the image */}
          <div className="absolute bg-black bg-opacity-30 top-0 left-0 right-0 bottom-0 flex flex-col justify-end p-4"> {/* Align text at bottom */}
            <div className="text-white text-left">
            <Link
                to={`/posts?category=${post.category}`}
                className="text-md font-semibold uppercase"
                >
                {post.category}
              </Link>
              <br />
              <Link
                to={`/${post.slug}`}
                className=" text-lg lg:text-md font-bold leading-snug"
              >
                {truncateText(post.title, 75)}
              </Link>
<br className="mt-5" /> 
              <Link
    className="text-md text-gray-300 font-base"
    to={`/posts?author=${post.user.username}`}
    onClick={(e) => e.stopPropagation()}
  >
    { post.user.username}
  </Link>
  <span     className="text-md p-1 text-gray-300 font-base "
  >-</span>
 
  <span     className="text-md text-gray-300 font-base "
  >{format( post.createdAt)}</span>
             
            </div>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-1">
        {/* Empty for now, can add more details if needed */}
      </div>
    </div>
  ))}
</div>

<div className=" relative col-span-3   ">



  {/* Original Content */}
  <div className="relative  text-left" style={{ zIndex: 2 }}>
  <div className="col-span-3 flex flex-col gap-3">
  <p className="text-2xl text-[var(--textColor)] font-bold">Top Headlines</p>
  {posts.slice(4, 8).map((post, index) => (
    post && (
      <div key={index} className="flex items-top mt-[10px] gap-2">
        <div className="w-2 h-2 bg-[var(--textColor)] bottom-[-7px] flex-shrink-0" />
        <Link
          to={`/${post.slug}`}
          className="text-md text-[var(--textColor)] font-bold hover:underline"
        >
          {truncateText(post.title, 55)}
        </Link>
      </div>
    )
  ))}
</div>

        <AdChanger/>
    
  
  </div>
</div>



 
      </div>
    </>
  );
};

export default FeaturedPosts;
