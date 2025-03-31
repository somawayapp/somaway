import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react"; // Keep useEffect
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import Navbar from "../components/Navbar";
// Remove Quill CSS if not used: import "react-quill-new/dist/quill.snow.css";

const AddListingReview = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [propertyname, setPropertyName] = useState("");
  // img state now correctly stores { url: "...", fileId: "..." } from Upload's onSuccess
  const [img, setImg] = useState([]);
  const [propertytype, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [progress, setProgress] = useState(0); // Still useful for current file progress
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  // --- New State ---
  const [isUploading, setIsUploading] = useState(false); // Track upload status from child

  const mutation = useMutation({
    mutationFn: async (newPost) =>
      axios.post(`${import.meta.env.VITE_API_URL}/reviews`, newPost, {
          // Optional: Add withCredentials if using cookies/sessions
          // withCredentials: true,
      }),
    onSuccess: (res) => {
      toast.success("Listing has been created!");
      // Ensure slug exists in response - adjust if needed based on your API
      if (res.data?.slug) {
        navigate(`/reviews/${res.data.slug}`);
      } else {
         console.warn("Slug not found in response, navigating home.");
         navigate('/'); // Fallback navigation
      }
    },
    onError: (error) => {
        // Log the full error for debugging
        console.error("Mutation Error:", error.response || error);
        toast.error(error.response?.data?.message || "An error occurred while creating the listing");
        setIsSubmitClicked(false); // Allow retry
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitClicked(true);
    setError("");

    // --- Enhanced Validation ---
    if (isUploading) {
      setError("Images are still uploading. Please wait.");
      return; // Don't submit yet
    }

    let missingFields = [];
    if (!propertyname.trim()) missingFields.push("Property name");
    if (!location.trim()) missingFields.push("Location");
    // Check if the img state (filled by Upload's onSuccess) has items
    if (img.length === 0) missingFields.push("At least one image (upload must complete)");
    if (!propertytype) missingFields.push("Property type"); // Check if a type was selected

    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.join(", ")}`);
      setIsSubmitClicked(false); // Reset click state if validation fails early
      return;
    }

    // --- Slug Generation (Keep as is) ---
    let slug = propertyname
       .trim()
       .replace(/\s+/g, "-")
       .toLowerCase()
       .replace(/[^a-z0-9-]/g, "")
       .replace(/-+$/, "");
    slug += `-${Date.now()}-review`;

    const data = {
      propertyname: propertyname.trim(),
      slug,
      location: location.trim(),
      // Map the array of objects to just an array of URLs for the backend
      img: img.map((imageInfo) => imageInfo.url),
      propertytype,
    };

    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 px-4 md:px-[80px] border border-[var(--softBg4)] shadow-md rounded-lg mt-10 mb-10">
        <h1 className="text-2xl font-bold text-[var(--softTextColor)] text-center mb-6">
          Add a place to Review
        </h1>

        {/* Display validation error (now includes upload status) */}
        {/* Show error only if submit was clicked OR if it's an upload warning */}
        {(isSubmitClicked || error.includes("uploading")) && error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- Upload Component --- */}
          <label className="block font-semibold text-[var(--softTextColor)]">
             Images (Max {MAX_IMAGES}, wait for uploads to complete) <span className="text-red-500">*</span>
          </label>
          <Upload
            type="image"
            setProgress={setProgress}
            setData={setImg} // Passes setImg function
            setIsUploading={setIsUploading} // Pass the state setter
          />
          {/* Progress Indicator - Shows progress for the *current* file */}
          {isUploading && progress < 100 && (
             <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                 <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
             </div>
          )}
           <span className="block text-sm text-[var(--softTextColor)] text-center mt-1">
             {isUploading ? `Uploading... (${progress}%)` : (img.length > 0 ? "Upload complete." : "No images selected.")}
           </span>

          {/* --- Property Type (Keep as is) --- */}
           <label className="block font-semibold text-[var(--softTextColor)]">
             Property Type <span className="text-red-500">*</span>
           </label>
           <select
             value={propertytype}
             onChange={(e) => setPropertyType(e.target.value)}
             className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg"
             required // Keep basic HTML required
           >
             <option value="" disabled>Select the type of Property</option>
             {/* ... options ... */}
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

          {/* --- Property Name (Keep as is) --- */}
           <label className="block font-semibold text-[var(--softTextColor)]">
             Name of this building or place <span className="text-red-500">*</span>
           </label>
           <input
             type="text"
             placeholder="Enter the name of this place"
             value={propertyname}
             onChange={(e) => setPropertyName(e.target.value.slice(0, 50))}
             maxLength={50}
             className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg"
             required
           />

          {/* --- Location (Keep as is) --- */}
          <label className="block font-semibold text-[var(--softTextColor)]">
             Location <span className="text-red-500">*</span>
           </label>
           <input
             type="text"
             placeholder="e.g., Westlands, Nairobi"
             value={location}
             onChange={(e) => setLocation(e.target.value.slice(0, 50))}
             maxLength={50}
             className="w-full p-2 border border-[var(--softBg4)] bg-[var(--bg)] text-[var(--softTextColor)] rounded-lg"
             required
           />

          {/* --- Submit Button --- */}
          <button
            type="submit"
            // Disable if mutation is pending OR if uploads are in progress
            disabled={mutation.isPending || isUploading}
            className="w-full bg-blue-500 text-white p-3 font-semibold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending
              ? "Publishing..."
              : isUploading
              ? "Uploading Images..." // Give feedback on the button too
              : "Publish Listing Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListingReview;