import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload"; // Assuming this component handles file uploads and provides preview

import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null); // Initially null, will hold the image file and preview URL
  const [progress, setProgress] = useState(0);
  const [titleRemainingChars, setTitleRemainingChars] = useState(150);
  const [descRemainingChars, setDescRemainingChars] = useState(10000);
  const [error, setError] = useState("");
  const [isFeatured, setIsFeatured] = useState(false); // Track if the post is featured

  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const fileInputRef = useRef(null); // Using ref to handle file input without re-rendering

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const handleTitleChange = (e) => {
    const value = e.target.value.slice(0, 150);
    setTitle(value);
    setTitleRemainingChars(150 - value.length);
  };

  const handleDescChange = (value) => {
    setDesc(value);
    setDescRemainingChars(10000 - value.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!title) return setError("Please include a title for your post.");
    if (!desc) return setError("Please include a description for your post.");
    if (!category) return setError("Please select a category for your post.");
    if (!cover) return setError("Please upload a cover image for your post.");

    // Slug generation
    const timestamp = Date.now();
    const slug = `${title.replace(/\s+/g, "-").toLowerCase()}-${timestamp}`;

    const data = {
      img: cover.filePath, // Assuming filePath is the path to the uploaded file
      title,
      category,
      desc,
      slug,
      isFeatured, // Add the "isFeatured" flag to the request data
    };

    mutation.mutate(data);
  };

  if (!isLoaded) {
    return <div className="text-center text-[var(--textColor)] mt-8">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="text-center text-[var(--textColor)] mt-8">You need to sign in to create a post!</div>;
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview
      const previewUrl = URL.createObjectURL(file);
      setCover({
        file,
        previewUrl,
      });

      // You can handle the actual file upload process here
      const formData = new FormData();
      formData.append("file", file);

      // Simulating an upload (you can replace this with your actual upload logic)
      try {
        setProgress(0);
        const uploadResponse = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setProgress(percent);
          },
        });

        // Assuming the upload returns the file path
        setCover((prevCover) => ({
          ...prevCover,
          filePath: uploadResponse.data.filePath,
        }));
      } catch (error) {
        toast.error("Failed to upload image");
      }
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col top-[20px] lg:top-[100px] gap-6 px-4 py-6">
      <h1 className="text-3xl font-semibold text-[var(--textColor)]">Create a New Post</h1>
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        {/* Upload Component */}
        <div>
          <Upload type="image" setProgress={setProgress} setData={setCover}>
            <div>
              {/* The file input is now handled with a ref to avoid re-render */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}  // Set the reference
                id="coverImageInput"
              />
              <label
                htmlFor="coverImageInput"
                className="w-max p-3 shadow-md rounded-xl text-sm text-[var(--textColor)] bg-[var(--textColore)] cursor-pointer"
              >
                {progress > 0 && progress < 100 ? "Uploading..." : "Add a cover image"}
              </label>
            </div>
          </Upload>
        </div>

        {/* Image Preview Section */}
        {cover && cover.previewUrl && (
          <div className="relative w-full max-w-[250px] h-[150px] mb-4 mx-auto">
            <img
              src={cover.previewUrl}
              alt="Cover preview"
              className="w-full h-full object-cover rounded-md shadow-lg"
            />
            <button
              type="button"
              onClick={() => setCover(null)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
            >
              ✕
            </button>
          </div>
        )}

      





        {/* Title Input */}
        <div>
          <input
            className="text-md font-semibold rounded-xl bg-transparent outline-none p-3 w-full border border-1 border-[var(--textColore)]"
            type="text"
            placeholder="Enter Post Title"
            value={title}
            onChange={handleTitleChange}
            name="title"
          />
          <span className="text-sm text-[var(--textColor)]">{titleRemainingChars} characters remaining</span>
        </div>

        {/* Category Selection */}
        <div className="flex items-center gap-4">
          <label htmlFor="category" className="text-sm text-[var(--textColor)]">Choose a category:</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-xl bg-[var(--textColore)] text-[var(--textColor)] shadow-md w-full max-w-xs"
          >
            <option value="" disabled>Select a category</option>
            <option value="general">General</option>
            {/* Add other categories as needed */}
          </select>
        </div>

        {/* Rich Text Description Input using ReactQuill */}
        <div>
          <ReactQuill 
            value={desc} 
            onChange={handleDescChange} 
            className="border border-1 border-[var(--textColore)] rounded-xl text-[var(--textColor)]"
            placeholder="A Short Description" 
            modules={{
              toolbar: [
                [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link'],
                [{ 'align': [] }],
                ['image'] // To allow image insertion
              ],
            }} 
            formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'align', 'image']} 
          />
          <span className="text-sm text-[var(--textColor)]">{descRemainingChars} characters remaining</span>
        </div>

        {/* Is Featured Button */}
        <div className="flex items-center gap-4">
          <label htmlFor="isFeatured" className="text-sm text-[var(--textColor)]">Is this post featured?</label>
          <input
            type="checkbox"
            id="isFeatured"
            checked={isFeatured}
            onChange={() => setIsFeatured(!isFeatured)}
            className="w-4 h-4"
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={mutation.isPending || (progress > 0 && progress < 100)}
          className="bg-[#1da1f2] hover:bg-[#0875b9] text-white font-medium rounded-xl mt-4 p-3 w-full disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
        <span className="text-sm text-[var(--textColor)]">Progress: {progress}%</span>
      </form>
    </div>
  );
};

export default Write;
