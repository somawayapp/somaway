


import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import MainCategories from "../components/MainCategories";
import Navbar from "../components/Navbar";
import { FaStar } from "react-icons/fa";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Post not found!";

  return (
    <div>
     <Navbar/>

    <div className="flex flex-col  mt-[20px] gap-4">
        

      <div className="flex gap-4 md:gap-8">

      {data.img && (
          <div className=" w-1/4">
            <Image src={data.img} w="400" className="rounded-2xl" />
          </div>
        )}

        <div className="lg:w-2/4 flex flex-col gap-2">
          <h1 className="text-xl md:text-4xl font-semibold">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm md:text-md ">
            <span>Book by</span>
            <Link >{data.user.username}</Link>
            <span>Category</span>
            <Link>{data.category}</Link>
          </div>
           <div className="flex gap-2 flex-row">
               <FaStar  className="text-yellow-500 w-[25px] text-orange-500"  />
               <FaStar  className="text-yellow-500 w-[25px] text-orange-500"  />
               <FaStar  className="text-yellow-500 w-[25px] text-orange-500"  />
               <FaStar  className="text-yellow-500 w-[25px] text-orange-500"  />
               <FaStar  className="text-yellow-500 w-[25px] text-orange-500"  />

           </div>
          <p className="mt-5  text-md md:text-lg text-bold">
           A short summary
          </p>

          <p
          className="text-[var(--textColor)] text-[16px] mb-[50px] md:text-[20px] text-justify mt-2"
          dangerouslySetInnerHTML={{ __html: data.desc }} 
         />      

      </div>
      <div className="lg:w-1/4 flex flex-col gap-2">
      <p className="text-sm md:text-md text-bold ">
        Table of contents
      </p>

      <p className="text-sm md:text-md mt-[20px] text-bold ">
        What you  will learn
      </p>
        </div>
     
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        {/* text */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify">
         
      
        </div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              {data.user.img && (
                <Image
                  src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              )}
              <Link className="text-blue-800">{data.user.username}</Link>
            </div>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur
            </p>
            <div className="flex gap-2">
            
            </div>
          </div>
          <PostMenuActions post={data}/>
         
        </div>
      </div>
      <Comments postId={data._id}/>
    </div>
    </div>

  );
};

export default SinglePostPage;