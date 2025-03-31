import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import Navbar from "../components/Navbar";
import "react-quill-new/dist/quill.snow.css";

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
    mutationFn: async (newPost) => axios.post(`${import.meta.env.VITE_API_URL}/reviews`, newPost),
    onSuccess: (res) => {
      toast.success("Listing has been created!");
      navigate(`/reviews/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    let missingFields = [];
    if (!propertyname.trim()) missingFields.push("Property name");
    if (!location.trim()) missingFields.push("Location");
    if (img.length === 0) missingFields.push("Image");
    if (!propertytype.trim()) missingFields.push("Property type");

    if (missingFields.length > 0) {
      setError(`All this fields are required: ${missingFields.join(", ")}`);
      return;
    }

    let slug = propertyname.trim().replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+$/, "");
    slug += `-${Date.now()}-review`;

    const data = {
      propertyname,
      slug,
      location,
      img: img.map((i) => i.url),
      propertytype,
    };

    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6  px-4 md:px-[80px] border border-[var(--softBg4)] shadow-md rounded-lg mt-10">
        <h1 className="text-2xl font-bold text-[var(--softTextColor)] text-center mb-6">Add a place to Review</h1>
        {error && <div className="text-blue-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload Component */}
          <Upload setProgress={setProgress} setData={setImg} />

          
          {img.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {img.map((img, index) => (
                <img key={index} src={img.url} alt="Uploaded" className="w-24 h-24 object-cover rounded-md border" />
              ))}
            </div>
          )}

          {/* Property Type */}
          <label className="block font-semibold text-[var(--softTextColor)]">Property Type</label>
          <select value={propertytype} onChange={(e) => setPropertyType(e.target.value)} className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg">
            <option value="" disabled>Select the type of Property</option>
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

          {/* Property Name */}
          <label className="block font-semibold text-[var(--softTextColor)]">Name of this building or place</label>
          <input type="text" placeholder="Enter the name of this place" value={propertyname} onChange={(e) => setPropertyName(e.target.value.slice(0, 50))} className="w-full p-2 border  border-[var(--softBg4)] bg-[var(--bg)]   text-[var(--softTextColor)] rounded-lg" />
          
          {/* Location */}
          <label className="block font-semibold text-[var(--softTextColor)]">Location</label>
          <input type="text" placeholder="Enter the Location" value={location} onChange={(e) => setLocation(e.target.value.slice(0, 50))} className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)]   text-[var(--softTextColor)] rounded-lg" />

          {/* Progress Indicator */}
          <span className="block  text-[var(--softTextColor)]">Upload Progress: {progress}%</span>

          {/* Submit Button */}
          <button type="submit" disabled={mutation.isPending || (progress > 0 && progress < 100)} className="w-full bg-blue-500 text-white p-3 font-semibold rounded-lg hover:bg-blue-600 transition-all">
            {mutation.isPending ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListingReview;
