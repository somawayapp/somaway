import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload"; // Assuming Upload component is in ../components/Upload.jsx
import Navbar from "../components/Navbar"; // Assuming Navbar component exists
import "react-quill-new/dist/quill.snow.css"; // Keep if needed elsewhere, but not used directly here

const AddListingReview = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [propertyname, setPropertyName] = useState("");
  const [img, setImg] = useState([]); // Stores successfully uploaded image objects { url: ... }
  const [propertytype, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [progress, setProgress] = useState(0); // Upload progress percentage
  const [error, setError] = useState(""); // Validation error message
  const navigate = useNavigate();
  const [isSubmitClicked, setIsSubmitClicked] = useState(false); // Track if submit was attempted

  const mutation = useMutation({
    mutationFn: async (newPost) =>
      axios.post(`${import.meta.env.VITE_API_URL}/reviews`, newPost), // Ensure VITE_API_URL is correct
    onSuccess: (res) => {
      toast.success("Listing has been created!");
      // Navigate to the newly created review page using the slug from the response
      navigate(`/reviews/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred creating the listing");
      // Reset submit click state on error if desired
      // setIsSubmitClicked(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitClicked(true); // Indicate submission attempt for error display
    setError(""); // Clear previous errors

    let missingFields = [];
    if (!propertyname.trim()) missingFields.push("Property name");
    if (!location.trim()) missingFields.push("Location");
    // Validation checks the 'img' state, which is populated ONLY by successful uploads via Upload component's onSuccess -> setData(setImg)
    if (img.length === 0) missingFields.push("Image (upload required)");
    if (!propertytype.trim()) missingFields.push("Property type");

    if (missingFields.length > 0) {
      setError(`All these fields are required: ${missingFields.join(", ")}`);
      return; // Stop submission if validation fails
    }

    // Generate a slug (ensure this logic matches backend expectations if needed)
    let slug = propertyname
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") // Remove invalid chars
      .replace(/-+$/, ""); // Remove trailing hyphens
    slug += `-${Date.now()}-review`; // Add timestamp and suffix

    // Prepare data for the API
    const data = {
      propertyname: propertyname.trim(),
      slug,
      location: location.trim(),
      // Map the array of { url: ... } objects to an array of URL strings
      img: img.map((i) => i.url),
      propertytype,
    };

    // Execute the mutation
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 px-4 md:px-[80px] border border-[var(--softBg4)] shadow-md rounded-lg mt-10 mb-10"> {/* Added mb-10 for spacing */}
        <h1 className="text-2xl font-bold text-[var(--softTextColor)] text-center mb-6">
          Add a Place to Review
        </h1>

        {/* Display validation error only after submit attempt */}
        {isSubmitClicked && error && (
          <div className="text-red-500 text-center mb-4 p-2 border border-red-300 bg-red-50 rounded"> {/* Improved error styling */}
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- Upload Component --- */}
          {/* Pass setImg to update the parent's state upon successful upload */}
          {/* Pass setProgress to update the parent's state for upload progress */}
          <label className="block font-semibold text-[var(--softTextColor)]">
            Property Images (Max 10)
          </label>
          <Upload type="image" setProgress={setProgress} setData={setImg} />
           {/* Display upload progress */}
           <span className="block text-sm text-[var(--softTextColor)] mt-1">
            Upload Progress: {progress}%
            {progress > 0 && progress < 100 && " (Please wait...)"}
            {img.length > 0 && progress === 0 && " (Upload complete)"}
          </span>

          {/* --- Property Type --- */}
          <label className="block font-semibold text-[var(--softTextColor)]">
            Property Type
          </label>
          <select
            value={propertytype}
            onChange={(e) => setPropertyType(e.target.value)}
            required // Added HTML5 required attribute
            className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" // Added focus styles
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
            Name of this building or place
          </label>
          <input
            type="text"
            placeholder="Enter the name of this place"
            value={propertyname}
            onChange={(e) => setPropertyName(e.target.value.slice(0, 50))}
            maxLength={50} // Added HTML5 maxLength attribute
            required // Added HTML5 required attribute
            className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" // Added focus styles
          />

          {/* --- Location --- */}
          <label className="block font-semibold text-[var(--softTextColor)]">
            Location
          </label>
          <input
            type="text"
            placeholder="E.g., Westlands, Nairobi"
            value={location}
            onChange={(e) => setLocation(e.target.value.slice(0, 50))}
            maxLength={50} // Added HTML5 maxLength attribute
            required // Added HTML5 required attribute
            className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" // Added focus styles
          />


          {/* --- Submit Button --- */}
          <button
            type="submit" // This button triggers the form onSubmit
            // Disable if mutation is running OR an upload is actively in progress
            disabled={mutation.isPending || (progress > 0 && progress < 100)}
            className="w-full bg-blue-500 text-white p-3 font-semibold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
          >
            {mutation.isPending ? "Publishing..." : "Publish Listing Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListingReview;