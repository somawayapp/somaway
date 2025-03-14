import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import Navbar from "../components/navbar2";
import { FaStar } from "react-icons/fa";
import Footer from "../components/Footer";
import ExplorePosts from "../components/ExplorePosts";
import MobileControls from "../components/MobileControls";
import LatestPosts from "../components/LatestPosts";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Post not found!";

  return (
    <div className="bg-[var(--navBg)]">
      <Helmet>
        <title>{data.title} - Summary | Somaway</title>
        <meta name="description" content={data.summary.slice(0, 160)} />
        <meta name="keywords" content={`${data.title}, ${data.author}, ${data.category}, book summary, Somaway`} />
        <meta property="og:title" content={`${data.title} - Summary | Somaway`} />
        <meta property="og:description" content={data.summary.slice(0, 160)} />
        <meta property="og:image" content={data.img} />
        <meta property="og:url" content={`${window.location.href}`} />
        <link rel="canonical" href={`${window.location.href}`} />
      </Helmet>
      <Navbar />
      <div className="flex flex-col p-3 md:p-9 gap-4">
        <div className="w-full mt-[-13px] flex pb-2 pt-4 md:pt-1 text-[var(--textColor)]">
          <h1 className="text-md md:text-xl font-semibold text-left">
            Library / <span className="pl-1 font-normal">{data.title}</span>
            <span className="font-normal"> Summary</span>
          </h1>
        </div>
        <div className="flex flex-col bg-[var(--bd3)] border border-[var(--softBg4)] rounded-3xl p-2 md:p-8 md:flex-row gap-4 md:gap-8">
          {data.img && (
            <div className="w-full md:w-1/4 mt-2 md:mt-0 flex justify-center md:block">
              <Image src={data.img} alt={data.title} className="w-[180px] md:w-[400px] rounded-2xl" />
            </div>
          )}
          <div className="flex flex-col gap-1 md:gap-2 items-center md:items-start md:w-2/4">
            <h2 className="text-2xl md:text-5xl font-bold text-center md:text-left">{data.title}</h2>
            <p className="text-lg text-center md:text-left">By <Link to={`/discover?author=${data.author}`} className="ml-1">{data.author}</Link></p>
            <p className="text-md text-center md:text-left">Category: <Link to={`/discover?cat=${data.category}`} className="ml-1 capitalize">{data.category}</Link></p>
            <p className="mt-2 text-xl font-bold">What’s inside</p>
            <p className="text-[var(--textColor)] text-[16px] md:text-[19px] text-justify">{data.summary}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SinglePostPage;
