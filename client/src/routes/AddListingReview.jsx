import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import "react-quill-new/dist/quill.snow.css";
import Navbar from "../components/Navbar";

const AddListingReview = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [propertyname, setPropertyName] = useState("");
  const [img, setImg] = useState([]);
  const [propertytype, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const mutation = useMutation({
    mutationFn: async (newPost) => {
      return axios.post(`${import.meta.env.VITE_API_URL}/reviews`, newPost);
    },
    onSuccess: (res) => {
      toast.success("Post has been created");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const clearError = () => setError("");

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();

    const submitButton = e.nativeEvent.submitter;
    if (!submitButton || submitButton.name !== "submitPost") return;

    let missingFields = [];
    if (!propertyname.trim()) missingFields.push("Property name");
    if (!location.trim()) missingFields.push("Location");
    if (!img.trim()) missingFields.push("Image");
    if (!propertytype.trim()) missingFields.push("Property type");


    if (missingFields.length > 0) {
      setError(`Missing fields: ${missingFields.join(", ")}`);
      return;
    }
    let slug = title.trim().replace(/\s+/g, "-").toLowerCase();
    slug = slug.replace(/[^a-z0-9-]/g, "").replace(/-+$/, "");
    
    // Append a timestamp
    slug += `-${Date.now()}-review`;
    

    const data = {
      propertyname,
      slug,
      location,
      img: img.map((img) => img.url),
      propertytype,
    };

    mutation.mutate(data);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-[900px] mx-auto flex flex-col mb-[100px] px-4 md:px-[80px] justify-center items-center overflow-x-scroll">
        <h1 className="text-xl md:text-3xl mt-[30px] mb-[30px] text-[var(--textColor)] font-semibold">
          Create a New Listing to review
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      

          <Upload type="image" setProgress={setProgress} setData={setImg}>
            <button className="p-2 bg-[var(--textColore)] text-[var(--textColor)] rounded-lg">
              Add atleast one Image
            </button>
          </Upload>

          {img.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {img.map((img, index) => (
                <img key={index} src={img.url} alt="Uploaded" className="w-[100px] h-[100px] object-cover" />
              ))}
            </div>
          )}




        {/*  property type Selection */}
        <h1>
          which one best describes this  property 
        </h1>
        <select value={propertytype} onChange={(e) => setPropertyType(e.target.value)} className="p-2 bg-[var(--textColore)] text-[var(--textColor)] rounded">
          <option value="" disabled> select Your property type</option>
          <option value="apartment">Apartment/Flat</option>
          <option value="studio">Studio Apartment</option>
          <option value="bedsitter">Bedsitter</option>
          <option value="single-room">Single Room</option>
          <option value="town-house">Town House</option>
          <option value="bungalow">Bungalow</option>
          <option value="mansionatte">Mansionatte</option>
          <option value="villa">Villa</option>
          <option value="container">Container</option>
          <option value="office">Office</option>
          <option value="shop">Shop</option>
          <option value="warehouse">Warehouse</option>
          <option value="land">Plot/Land</option>

        </select>





        <input type="text" placeholder="Enter the name of the building/ Apartment/ property" value={propertyname} onChange={(e) => setPropertyName(e.target.value.slice(0, 50))} className="p-2 bg-[var(--textColore)] text-[var(--textColor)]  rounded" />
        <input type="text" placeholder="Enter the Location of this building/ Apartment/ property" value={location} onChange={(e) => setLocation(e.target.value.slice(0, 50))} className="p-2 bg-[var(--textColore)] text-[var(--textColor)]  rounded" />


        {error && <div className="text-red-600">{error}</div>}

        <button 
       name="submitPost" 
       type="submit" 
       disabled={mutation.isPending || (progress > 0 && progress < 100)}
       className="bg-blue-500 text-white p-2 rounded">
       {mutation.isPending ? "Publishing..." : "Publish Post"}
       </button>

        <span>Upload Progress: {progress}%</span>
      
      </form>
    </div>
    
    </div>

  );
};

export default AddListingReview;

