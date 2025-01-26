import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
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
      <Navbar />

      <div className="flex flex-col shadow-2xl p-[1px] md:p-8 mt-[10px] gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {data.img && (
            <div className="w-full md:w-1/4 flex justify-center md:block">
             <Image
                src={data.img}
                className="w-full sm:w-150 md:w-[400px] rounded-2xl"
                />

             </div>
          )}

          <div className="flex flex-col gap-2 items-center md:items-start md:w-2/4">
            <p className="text-[var(--softTextColor2)] text-center md:text-left">
              SUMMARY OF
            </p>
            <h1 className="text-xl md:text-4xl font-semibold text-center md:text-left">
              {data.title}
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-2 text-[var(--softTextColor)] text-md md:text-lg">
              <div className="flex gap-2">
                <span>Book by</span>
                <Link>{data.user.username}</Link>
              </div>
              <div className="flex gap-2">
                <span>Category</span>
                <Link>{data.category}</Link>
              </div>
            </div>
            <div className="flex flex-row justify-center md:justify-start mt-2">
              <FaStar className="text-orange-500 w-[40px] ml-[-5px]" />
              <FaStar className="text-orange-500 w-[40px] ml-[-5px]" />
              <FaStar className="text-orange-500 w-[40px] ml-[-5px]" />
              <FaStar className="text-orange-500 w-[40px] ml-[-5px]" />
              <FaStar className="text-orange-500 w-[40px] ml-[-5px]" />
            </div>
            <p className="mt-5 text-xl md:text-2xl font-bold">
              Short summary
            </p>
            <p
              className="text-[var(--textColor)] text-[15px] md:text-[18px] text-justify"
              dangerouslySetInnerHTML={{ __html: data.desc }}
            />
          </div>

          <div className="flex flex-col gap-2 items-center md:items-start md:w-1/4">
            <p className="text-md md:text-xl font-bold">Table of contents</p>
            <PostMenuActions post={data} />
            <p className="text-md md:text-xl mt-[20px] font-bold">What you will learn</p>
            <Comments postId={data._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;