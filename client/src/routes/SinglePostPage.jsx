


import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import MainCategories from "../components/MainCategories";
import Navbar from "../components/Navbar";


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

    <div className="flex flex-col gap-8">
        

      <div className="flex gap-2">

      {data.img && (
          <div className=" w-2/8">
            <Image src={data.img} w="300" className="rounded-2xl" />
          </div>
        )}

        <div className="lg:w-4/8 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl font-semibold">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Book by</span>
            <Link className="text-blue-800">{data.user.username}</Link>
            <span>Category</span>
            <Link className="text-blue-800">{data.category}</Link>
          </div>

          <p
          className="text-[var(--textColor)] text-[14px] mb-[50px] md:text-[16px] text-justify mt-2"
          dangerouslySetInnerHTML={{ __html: data.desc }} 
         />      

      </div>
      <div className="lg:w-2/8 flex flex-col gap-8">
      <p>
        Table of contents
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