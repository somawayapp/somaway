import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-quill-new/dist/quill.snow.css"; // Quill styles
import Upload from "../components/Upload"; // File upload component

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null); // Holds image file and preview URL
  const [isFeatured, setIsFeatured] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [titleRemainingChars, setTitleRemainingChars] = useState(150);
  const [descRemainingChars, setDescRemainingChars] = useState(10000);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCover({ filePath: file.name, file, previewUrl });
    }
  };

  // Handle title input
  const handleTitleChange = (e) => {
    const value = e.target.value.slice(0, 150);
    setTitle(value);
    setTitleRemainingChars(150 - value.length);
  };

  // Handle description input
  const handleDescChange = (value) => {
    setDesc(value);
    setDescRemainingChars(10000 - value.length);
  };

  // Mutation for submitting a post
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
      toast.success("Post created successfully!");
      navigate(`/${res.data.slug}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "An error occurred.");
    },
  });

  // Clear error
  const clearError = () => setError("");

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!title) return setError("Please include a title for your post.");
    if (!desc) return setError("Please include a description for your post.");
    if (!category) return setError("Please select a category for your post.");
    if (!cover) return setError("Please upload a cover image for your post.");

    const timestamp = Date.now();
    const slug = `${title.replace(/\s+/g, "-").toLowerCase()}-${timestamp}`;

    const data = {
      title,
      desc,
      category,
      slug,
      isFeatured,
      img: cover.filePath, // Assuming file upload returns the file path
    };

    mutation.mutate(data);
  };

  if (!isLoaded) return <div className="text-center mt-8">Loading...</div>;
  if (isLoaded && !isSignedIn)
    return <div className="text-center mt-8">You need to sign in to create a post!</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Create a New Post</h1>
      {error && <div className="p-4 bg-red-100 text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Cover Image Upload */}
        <div className="relative w-full max-w-[250px] h-[150px]">
          {cover && cover.previewUrl ? (
            <img src={cover.previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
          )}
          <input type="file" onChange={handleFileUpload} className="mt-2" />
        </div>

        {/* Featured toggle */}
        <div>
          <label>Mark as Featured:</label>
          <button
            type="button"
            onClick={() => setIsFeatured((prev) => !prev)}
            className={`px-4 py-2 rounded ${isFeatured ? "bg-green-500 text-white" : "bg-gray-300"}`}
          >
            {isFeatured ? "Yes" : "No"}
          </button>
        </div>

        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={handleTitleChange}
            className="border p-2 w-full"
          />
          <small>{titleRemainingChars} characters remaining</small>
        </div>

        {/* Category Selection */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="" disabled>
            Select category
          </option>
          <option value="general">General</option>
          <option value="apps">Apps</option>
          <option value="software">Software</option>
          {/* Add more categories here */}
        </select>

        {/* Description (ReactQuill) */}
        <ReactQuill
          value={desc}
          onChange={handleDescChange}
          className="border p-2"
          placeholder="Write your post description"
        />
        <small>{descRemainingChars} characters remaining</small>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default Write;
