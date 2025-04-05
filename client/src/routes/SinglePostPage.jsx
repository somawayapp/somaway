
          import { Link, useParams } from "react-router-dom";
          import Reviews from "../components/Reviews";
          import PostMenuActions from "../components/PostMenuActions";
          import Comments from "../components/Comments";
          import axios from "axios";
          import { useQuery } from "@tanstack/react-query";
          import Navbar from "../components/navbar2";
          import Footer from "../components/Footer";
          import { useEffect } from "react";
          import { Helmet } from "react-helmet";
          import { useState } from "react";
          import BackButton from "../components/BackButton";
          import SpinnerMini from "../components/Loader";
          import { FaBath, FaRulerCombined } from "react-icons/fa";
          import { FaBuilding, FaWarehouse, FaHome, FaTree, FaBed } from "react-icons/fa";
          import { MdVilla, MdApartment } from "react-icons/md";
          import { GiOfficeChair, GiShop, GiCargoCrate } from "react-icons/gi";
          import { FaSwimmingPool, FaWifi, FaParking, FaLeaf, FaBabyCarriage } from 'react-icons/fa';
          import { MdBalcony, MdAir, MdFitnessCenter, MdSecurity, MdOutlineBackup} from 'react-icons/md';
          import { ArrowUpCircle } from "lucide-react";
          import { AiOutlineAppstore } from "react-icons/ai";
          import { useRef } from "react";
          import Ratings from "../components/Ratings";
          import RelatedPosts from "../components/RelatedPosts";
          import { ChevronLeft } from "lucide-react";
          import { ChevronRight } from "lucide-react";
          import LikeButton from "../components/LikeButton";

          const fetchPost = async (slug) => {
             
          
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
            return res.data;
          };
          
          const SinglePostPage = () => {
            useEffect(() => {
              window.scrollTo(0, 0); // Scrolls to the top when this component mounts
            }, []);
            const { slug } = useParams();
          
            const { isPending, error, data } = useQuery({
              queryKey: ["post", slug],
              queryFn: () => fetchPost(slug),
            });


            const amenitiesIcons = {
              "lift": <ArrowUpCircle />,
              "air-conditioning": <MdAir />,
              "swimming-pool": <FaSwimmingPool />,
              "balcony": <MdBalcony />,
              "gym": <MdFitnessCenter />,
              "wifi": <FaWifi />,
              "security": <MdSecurity />,
              "playground": <FaBabyCarriage />,
              "garden": <FaLeaf />,
              "backup-generator": <MdOutlineBackup />,
              "parking": <FaParking />,
            
            };
          
            const [isLoading, setIsLoading] = useState(false);

              const handleClick = () => {
                window.open(`https://wa.me/${data.whatsapp}`, "_blank");
              };

            const [popupImage, setPopupImage] = useState(null);
            
            const images = data?.img || [];
  const [showMore, setShowMore] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const rightDivRef = useRef(null);

  const mainImage = images.length > 0 ? images[0] : null;
  const sideImages = images.slice(1);

  const scrollRightDiv = (direction) => {
    if (rightDivRef.current) {
      rightDivRef.current.scrollBy({
        top: direction === "down" ? 100 : -100,
        behavior: "smooth",
      });
    }
  };

  const openPopup = (imageIndex) => {
    setPopupImage(images[imageIndex]);
    setCurrentIndex(imageIndex);
  };

  const navigatePopup = (direction) => {
    let newIndex =
      direction === "next"
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setPopupImage(images[newIndex]);
  };
            // Prevent scrolling when popup is open
            useEffect(() => {
              if (popupImage) {
                document.body.style.overflow = "hidden";
              } else {
                document.body.style.overflow = "auto";
              }
            }, [popupImage]);


            
            

            const [popupDesc, setPopupDesc] = useState(null);
          
            // Prevent scrolling when popup is open
            useEffect(() => {
              if (popupDesc) {
                document.body.style.overflow = "hidden";
              } else {
                document.body.style.overflow = "auto";
              }
            }, [popupDesc]);
     
            if (isPending) return <SpinnerMini />;
            if (error) return "Something went wrong!" + error.message;
            if (!data) return "Post not found!";
            
const icons = {
  apartment: <MdApartment />,
  studio: <FaBed />,
  bedsitter: <FaBed />,
  "single-room": <FaBed />,
  "town-house": <FaHome />,
  bungalow: <FaHome />,
  mansionatte: <FaBuilding />, 
  villa: <MdVilla />,
  container: <GiCargoCrate />,
  office: <GiOfficeChair />,
  shop: <GiShop />,
  warehouse: <FaWarehouse />,
  land: <FaTree />,
};

// Filtering out null values (but keeping 0 values if they exist)
const details = [
  data.bedrooms ? `${data.bedrooms} bedroom` : null,
  data.bathrooms ? `${data.bathrooms} bathroom` : null,
  data.rooms ? `${data.rooms} room` : null,
  data.propertysize ? `${data.propertysize} square feet` : null,
  data.propertytype ? `${data.propertytype} ` : null,
].filter(Boolean);

          
            return details.length > 0 ? (
              <div className=" bg-[var(--bg)]">
          
          
          
                <Navbar />
                <div className="px-2 md:px-[80px]">

                <Helmet>
    <title>{`${data.title || 'Best '} by ${data.author || 'Hodi'} Book Summary`}</title>

    <meta name="description" content={` ${data.summary} `} />
    <meta name="keywords"  content={`book title ${data.title}, author ${data.author} category ${data.category},  knowledge empowerment, Hodi, book summaries, knowledge empowerment, bestselling books, transformative ideas, thought leadership, business books, self-help summaries, industry insights, personal growth, productivity hacks, motivation, innovation strategies, creative thinking, mind mastery, leadership skills, financial wisdom, success mindset, breakthrough thinking, wisdom for life, practical knowledge, learning shortcuts, brain boost, Best book summaries, rapid reading, book digest, quick reads, success stories, entrepreneurial mindset, modern wisdom, elite knowledge, mastery techniques, global perspectives, future readiness, book analysis, idea extraction, in-depth reviews, concise knowledge, summary breakdowns, book wisdom, mental expansion, critical thinking, intellectual growth, top books, influential reads, advanced thinking, ultimate book digest, life hacks, professional growth, career mastery, mindset shift, paradigm transformation, unconventional wisdom, practical insights, top nonfiction books, skill enhancement, brain optimization, cognitive skills, mind enhancement, top book reviews, wisdom harvesting, fast knowledge, core ideas, rapid insights, strategic intelligence, innovation fuel, personal development, growth mindset, self-mastery, breakthrough books, smart reading, fast tracking wisdom, peak performance, visionary thinking, knowledge domination, unbeatable learning.`} />

    <meta property="og:description" content={`Experience the most profound interpretation of ${data.title} - A book summary that redefines insight and analysis.`} />
    <meta property="og:image" content={data.img} />
    <meta property="og:url" content={`${window.location.href}`} />
    <link rel="canonical" href={`${window.location.href}`} />
</Helmet>
                <div className="flex flex-col p-3 md:p-9 gap-4">
          
            
                <div className="max-w-[1200px] mx-auto">


     <div className="w-full mt-0 md:mt-[-13px]  mb-[20px] flex items-center justify-between  ">
      <div>
      <h1 className="text-xl md:text-2xl pb-1 md:pb-2 text-[var(--softTextColor)]  font-semibold text-left">
        {data.title}
  </h1>
  <h1 className="text-md md:text-lg text-[var(--softTextColor)] font-normal text-left">
    {data.bedrooms}
    <span className="pl-1 font-normal">Bedroom</span>
    <span className="pl-1 font-normal">{data.propertytype}</span>

  </h1>
      </div>
 

  <BackButton/>
</div>





        
          
          
          
<div className="w-full flex h-[300px] md:h-[500px] overflow-hidden rounded-xl relative transition duration-300">
      {/* Left Image */}
      <div>
      <div className="flex-1 h-full overflow-hidden relative mr-1 md:mr-2 cursor-pointer" onClick={() => openPopup(0)}>
        {mainImage && <img src={mainImage} className="object-cover h-full w-full" alt="Main Image" />}
      </div>

      <div className=" absolute top-3 right-3">
       <LikeButton postId={post._id} />
        </div>
      </div>
  
{/* Right Side Images */}
<div className="w-1/4 h-full flex flex-col overflow-hidden relative">
  <div ref={rightDivRef} className="flex flex-col gap-1 md:gap-2 h-full">
    {/* Map through 4 items even if there are fewer than 4 images */}
    {Array.from({ length: 4 }).map((_, index) => {
      const image = sideImages[index];
      return (
        <div
          key={index}
          className="w-full h-1/4 overflow-hidden relative cursor-pointer"
          style={{
            backgroundColor: image ? 'transparent' : 'var(--softBg4)', // Apply background color if no image
          }}
          onClick={() => openPopup(index + 1)}
        >
          {/* Conditionally render the image or fallback background */}
          {image ? (
            <img
              src={image}
              className="object-cover h-full w-full"
              alt={`Image ${index + 1}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* Optional: You can display some placeholder text or icon */}
            </div>
          )}
        </div>
      );
    })}

    {/* Floating Show More Button on the 4th Image */}
    {!showMore && sideImages.length > 4 && (
      <button
        className="absolute inset-0 m-auto flex items-center justify-center w-[60px] h-[20px] md:w-[100px] md:h-[40px] px-2 py-1 md:px-4 md:py-2 rounded-xl border-[1px]
          border-white bg-black bg-opacity-60 text-white text-[9px] md:text-sm hover:bg-opacity-80 transition whitespace-nowrap"
        onClick={() => openPopup(4)} // Here, openPopup can be triggered for the 4th image (or custom logic)
      >
        Show More
      </button>
    )}
  </div>
</div>



  {/* Popup Modal */}
{popupImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
    style={{ zIndex: 100014 }}
    onClick={() => setPopupImage(null)}
  >
    <div
      className="relative w-full p-3 md:p-9 md:w-4/5 flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button (Top Right) */}
     
      <button
        className="absolute top-4 right-4 p-2  bg-black bg-opacity-50  text-white w-10 h-10 flex items-center justify-center rounded-full z-10"
        onClick={() => setPopupImage(null)}
      >
        ✖
      </button>

      {/* Previous and Next Buttons (Centered on Image) */}
      <button
     onClick={() => navigatePopup("prev")}
      className=" absolute left-3  w-10 h-10 z-10  top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-100  transition"
    >
      ❮ 
    </button>
      <button
      onClick={() => navigatePopup("next")}
      className=" absolute right-3  w-10 h-10 z-10  top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-100 transition"
    >
      ❯ 
    </button>

      {/* Popup Image */}
      <img
        src={popupImage}
        className="w-full h-auto max-h-[85vh] md:max-h-[90vh] object-cover rounded-xl"
        alt="Popup"
      />
    </div>
  </div>
)}

    </div>
              

    


          <div className="flex flex-col-reverse md:flex-row bg-[var(--bg)] mt-6 gap-4 md:gap-8">




          <div className="flex flex-col gap-1 md:gap-2  mt-4 w-full   md:w-4/6">
          
               
          <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
      <div className="text-[16px] font-semibold text-[var(--softTextColor)] flex flex-row items-center gap-2 md:justify-start justify-center">
  <span className="mr-1">Hosted by</span> 
  <img
    className="rounded-full text-[14px] md:text-[16px]  w-[30px] md:w-[40px] h-[30px] md:h-[40px] select-none"
    alt="Avatar"
    src={data.user?.img || "/placeholder.jpg"} 
  />
  <span>{data.user?.username}</span>
</div>

        <div
          className="flex flex-row items-center  mt-3 md:mt-7 gap-2 md:gap-4 font-light text-[var(--softTextColor)]
          "
        >  <div className=" md:justify-start justify-center property-details">
        {data.bedrooms !== undefined && data.bedrooms !== null && (
          <span className="detail-item text-[14px] md:text-[16px] ">
            <FaBed className="icon" /> {data.bedrooms} Bedrooms
          </span>
        )}
        {data.bathrooms !== undefined && data.bathrooms !== null && (
          <span className="detail-item text-[14px] md:text-[16px] ">
            <FaBath className="icon" /> {data.bathrooms} Bathrooms
          </span>
        )}
        {data.rooms !== undefined && data.rooms !== null && (
          <span className="detail-item text-[14px] md:text-[16px] ">
            <AiOutlineAppstore className="icon" /> {data.rooms} Rooms
          </span>
        )}
        {data.propertysize !== undefined && data.propertysize !== null && (
          <span className="detail-item text-[14px] md:text-[16px] ">
            <FaRulerCombined className="icon" /> {data.propertysize} sq/ft
          </span>
        )}
      </div>
        </div>
      </div>
      <hr className="h-[1px] bg-[var(--softBg4)] border-0" />
      
      <p className=" flex flex-row" style={{ 
  alignItems: "center", 
}}>
  {icons[data.propertytype] && (
    <span style={{ 
      fontSize: "68px", // Large icon for default
      marginRight: "12px", 
      display: "flex", 
      alignItems: "center",
      color: "var(--softTextColor)", // Apply text color variable
      fill: "var(--softTextColor)", // Ensure SVG icons match the text color
      fontWeight: "normal" // Ensure it's not bold
    }}>
      {icons[data.propertytype]}
    </span>
  )}

  <span>
    <p className="capitalize font-semibold">
      {data.propertytype}
    </p>
    <span className=" text-[14px] md:text-[16px] text-[var(--softTextColor)] ">This is a {details.join(", ")} property!</span>
  </span>

</p>





      <hr className="h-[1px] bg-[var(--softBg4)] border-0" />



   {/* Popup Modal */}
   {popupDesc && (
          <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center " style={{ zIndex: 100014 }}
          onClick={() => setPopupDesc(null)}
          >
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setPopupDesc(null)}>
          <div
          className="relative w-full p-3 md:p-9 md:w-3/4"
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
          >
          <button
          className="absolute top-2 right-2 bg-gray-800 text-white rounded-full"
          onClick={() => setPopupDesc(null)}  
          style={{ zIndex: 100024 }}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="red"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          </button>
          <div className="w-full h-auto max-h-[80vh] overflow-auto bg-[var(--bg)] p-5 rounded-xl">
            <p className="text-[var(--textColor)]" dangerouslySetInnerHTML={{ __html: popupDesc }} />
          </div>
          </div>
          </div>
          </div>
          )}

{/* Description Preview */}
<p className="desc-content text-[var(--softTextColor)]">
  {data.desc?.length > 300 ? (
    <>
<h1 className="text-[var(--softTextColor)] font-semibold  text-[20px] md:text-[22px]  ">About this property </h1>    
  <span dangerouslySetInnerHTML={{ __html: data.desc.substring(0, 470) }} />
      <button  
  className="text-[var(--softTextColor)]  text-[14px] md:text-[16px]  font-semibold  mt-2  border-[2px]  rounded-xl py-2 px-6 border-[var(--softBg4)]"
  onClick={() => setPopupDesc(data.desc)}
>
  Show More
</button>

    </>
  ) : (
    <span dangerouslySetInnerHTML={{ __html: data.desc }} />
  )}
</p>



<hr className="h-[1px] bg-[var(--softBg4)] border-0" />
<h1 className="text-[var(--softTextColor)] font-semibold  text-[20px] md:text-[22px]  ">What this property offers </h1>   
<div className="flex flex-wrap gap-4">
  {data.amenities.map((amenity, index) => (
    <div 
      key={index} 
      className="flex flex-col justify-between items-center gap-1 border-[1px] border-[var(--softBg4)]  py-2  px-3  md:py-4  md:px-6  rounded-md"
    >
      <div 
        className="text-[var(--softTextColor)] md:text-3xl text-xl"
      >
        {amenitiesIcons[amenity] || null}
      </div>
      <span className=" text-[14px] md:text-[16px]  text-[var(--softTextColor)] capitalize">{amenity.replace('-', ' ')}</span>
    </div>
  ))}
</div>


<hr className="h-[1px] bg-[var(--softBg4)] border-0" />


      <div className=" text-[14px] md:text-[16px]  text-[var(--softTextColor)]">
       map
      </div>

      <hr className="h-[1px] bg-[var(--softBg4)] border-0" />
      <h1 className="text-[var(--softTextColor)] font-semibold ml-1 md:ml-5 text-[20px] md:text-[22px]  ">Property reviews  </h1>   

      <Reviews postId={data._id} /> 
      <hr className="h-[1px] bg-[var(--softBg4)] mb-5 md:mb-9 border-0" />

    </div>

        
   

          </div>








          <div className="flex flex-col gap-2 pb-4 w-full md:w-2/6 ">

          <div className="  rounded-xl border-[1px]  border-[var(--softBg4)]  shadow-md  overflow-hidden">
      <div className="flex text-[var(--softTextColor)] flex-row items-center gap-1 p-4">
        <span className=" text-[14px] md:text-[16px] text-[var(--softTextColor)] font-semibold">KES {data.price}</span>
        <span className="font-light text-[14px] md:text-[16px]  ">
  {data.model === "forrent" ? "/month" : data.model === "forsale" ? "for sale" : ""}
</span>
      </div>
      <hr className="h-[1px] bg-[var(--softBg4)] border-0" />

      <div>
  <p
    className="p-4 text-[14px] md:text-[16px] text-[var(--softTextColor)]  flex items-center gap-2 cursor-pointer hover:bg-[var(--softBg)] rounded-lg transition"
    onClick={() => window.location.href = `tel:${data.phone}`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2 2 19.79 19.79 0 0 1-8.63-2A19.79 19.79 0 0 1 2 6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 1.72 12.34 12.34 0 0 0 .68 2.72 2 2 0 0 1-.45 2.11l-1.42 1.42a16 16 0 0 0 6 6l1.42-1.42a2 2 0 0 1 2.11-.45 12.34 12.34 0 0 0 2.72.68A2 2 0 0 1 22 16.92z" />
    </svg>
    Contact: <span>{data.phone}</span>
  </p>
</div>

<hr className="h-[1px] bg-[var(--softBg4)] border-0" />
<div>


<div>
      <p
        className="p-4 flex items-center text-[var(--softTextColor)] gap-2 text-[14px] md:text-[16px]   cursor-pointer hover:bg-[var(--softBg)] rounded-lg transition-all"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.5 12.2c0-5.2-4.3-9.5-9.5-9.5S2.5 7 2.5 12.2a9.5 9.5 0 0 0 1.3 4.9L2 22l5.2-1.7a9.5 9.5 0 0 0 4.8 1.3c5.2 0 9.5-4.3 9.5-9.5z" />
          <path d="M16.5 15.3c-.5.3-1 .5-1.6.6-2.6.6-5.5-1.7-6.7-3.8-.3-.5-.5-1-.6-1.6 0-.5.2-.9.6-1.2.3-.2.7-.2 1.1 0l.9.4c.3.1.6.4.7.7l.2.4c.1.3 0 .6-.2.9-.1.2-.3.4-.3.4s.4.7 1 1.3c.6.6 1.3 1 1.3 1 .1 0 .2-.1.4-.3.3-.2.6-.3.9-.2l.4.2c.3.1.6.3.7.7l.4.9c.1.3.1.8-.1 1.1z" />
        </svg>
        WhatsApp: <span>{data.whatsapp}</span>
      </p>
    </div>

   </div>

   <hr className="h-[1px] bg-[var(--softBg4)] border-0" />
   <div >
    <Comments postId={data._id} />
      </div>
      <hr className="h-[1px] bg-[var(--softBg4)] border-0" />
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">


      <div >
      <Ratings postId={data._id} />

</div>


      </div>
   
   
          </div>
          
   
    </div>



        </div>
      </div>

      </div>






      
 <div className="mb-[20px] px-3 md:px-9  ">
<div>
      <h3 className="text-xl md:text-3xl ml-2 mb-3 md:mb-6  font-bold text-[var(--SoftTextColor)]">
      Related property     </h3>
    </div>
   <RelatedPosts />
</div>



<div className="flex items-center justify-center text-[var(--textColor)] mx-auto">

    <div className="flex justify-center ">
      <PostMenuActions post={data} />
    </div>


    
         
   </div>
   <Footer/>     
   </div>
  
   </div>
) : null;
};

export default SinglePostPage;