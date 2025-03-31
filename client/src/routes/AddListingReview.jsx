import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload"; // Ensure this path is correct
import Navbar from "../components/Navbar"; // Ensure this path is correct
import "react-quill-new/dist/quill.snow.css"; // If you use ReactQuill elsewhere, keep it, otherwise remove if not needed in this component

const AddListingReview = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [propertyname, setPropertyName] = useState("");
  const [img, setImg] = useState([]); // Stores successfully uploaded image objects { url: "..." }
  const [propertytype, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [progress, setProgress] = useState(0); // Upload progress percentage
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSubmitClicked, setIsSubmitClicked] = useState(false); // Track if submit was attempted

  const mutation = useMutation({
    mutationFn: async (newPost) =>
      axios.post(`${import.meta.env.VITE_API_URL}/reviews`, newPost), // Ensure VITE_API_URL is set
    onSuccess: (res) => {
      toast.success("Listing has been created!");
      // Ensure the response structure has `res.data.slug`
      navigate(`/reviews/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred while creating the listing");
      setIsSubmitClicked(false); // Optional: Allow retry without page reload
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitClicked(true); // Mark that submission was attempted
    setError(""); // Clear previous errors

    let missingFields = [];
    if (!propertyname.trim()) missingFields.push("Property name");
    if (!location.trim()) missingFields.push("Location");
    // Validate that at least one image has been successfully uploaded
    if (img.length === 0) missingFields.push("Image (upload must complete)");
    if (!propertytype.trim()) missingFields.push("Property type");

    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(", ")}`);
      return; // Stop submission if validation fails
    }

    // Generate slug (ensure it's unique enough for your needs)
    let slug = propertyname
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+$/, "");
    slug += `-${Date.now()}-review`; // Append timestamp for uniqueness

    const data = {
      propertyname: propertyname.trim(),
      slug,
      location: location.trim(),
      img: img.map((i) => i.url), // Send only the URLs from successfully uploaded images
      propertytype,
    };

    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 px-4 md:px-[80px] border border-[var(--softBg4)] shadow-md rounded-lg mt-10 mb-10"> {/* Added mb-10 for spacing */}
        <h1 className="text-2xl font-bold text-[var(--softTextColor)] text-center mb-6">
          Add a place to Review
        </h1>

        {/* Display validation error only after submit attempt */}
        {isSubmitClicked && error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- Upload Component --- */}
          <label className="block font-semibold text-[var(--softTextColor)]">
            Images (Max 10, wait for upload to complete)
          </label>
          <Upload
            type="image"
            setProgress={setProgress}
            setData={setImg} // Pass setImg to update the state with uploaded URLs
          />
          {/* Progress Indicator */}
          {progress > 0 && (
             <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
             </div>
          )}
           <span className="block text-sm text-[var(--softTextColor)] text-center">
             Upload Progress: {progress}%
           </span>

          {/* --- Property Type --- */}
          <label className="block font-semibold text-[var(--softTextColor)]">
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            value={propertytype}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg"
            required // Added basic HTML required attribute
          >
            <option value="" disabled>
              Select the type of Property
            </option>
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

          {/* --- Property Name --- */}
          <label className="block font-semibold text-[var(--softTextColor)]">
            Name of this building or place <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter the name of this place"
            value={propertyname}
            onChange={(e) => setPropertyName(e.target.value.slice(0, 50))} // Limit length client-side
            maxLength={50} // Also add HTML max length
            className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg"
            required // Added basic HTML required attribute
          />

          {/* --- Location --- */}
          <label className="block font-semibold text-[var(--softTextColor)]">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Westlands, Nairobi"
            value={location}
            onChange={(e) => setLocation(e.target.value.slice(0, 50))} // Limit length client-side
            maxLength={50} // Also add HTML max length
            className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg"
            required // Added basic HTML required attribute
          />

          {/* --- Submit Button --- */}
          <button
            type="submit"
            // Disable while mutation is posting OR an upload is actively in progress
            disabled={mutation.isPending || (progress > 0 && progress < 100)}
            className="w-full bg-blue-500 text-white p-3 font-semibold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Publishing..." : "Publish Listing Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListingReview;