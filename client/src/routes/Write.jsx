import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload"; 

import "react-quill-new/dist/quill.snow.css"; 

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null); // Stores the image file
  const [preview, setPreview] = useState(null); // Stores the preview URL
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const fileInputRef = useRef(null); 

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleTitleChange = (e) => setTitle(e.target.value.slice(0, 150));
  const handleDescChange = (value) => setDesc(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();
    if (!title || !desc || !category || !cover) return setError("Please complete all fields.");

    const timestamp = Date.now();
    const slug = `${title.replace(/\s+/g, "-").toLowerCase()}-${timestamp}`;

    mutation.mutate({
      img: cover, // This should be the uploaded image path
      title,
      category,
      desc,
      slug,
      isFeatured,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      setPreview(URL.createObjectURL(file)); // Create preview
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] max-w-[900px] flex flex-col gap-6 px-4 py-6">
      <h1 className="text-3xl font-semibold">Create a New Post</h1>
      {error && <div className="p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Image Upload */}
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
            id="coverImageInput"
          />
        </Upload>

        <label htmlFor="coverImageInput" className="p-3 bg-blue-500 text-white rounded-xl cursor-pointer">
          {progress > 0 && progress < 100 ? "Uploading..." : "Add a cover image"}
        </label>

        {/* Image Preview */}
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Preview" className="w-full h-auto rounded-lg shadow-md" />
          </div>
        )}

        {/* Title Input */}
        <input
          className="p-3 w-full border rounded-xl"
          type="text"
          placeholder="Enter Post Title"
          value={title}
          onChange={handleTitleChange}
        />

        {/* Category Selection */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-xl"
        >
          <option value="" disabled>Select a category</option>
          <option value="general">General</option>
        </select>

        {/* Rich Text Editor */}
        <ReactQuill value={desc} onChange={handleDescChange} className="border rounded-xl" />

        {/* Is Featured */}
        <div className="flex items-center gap-4">
          <label htmlFor="isFeatured">Featured Post?</label>
          <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
        </div>

        {/* Submit Button */}
        <button disabled={mutation.isPending || progress > 0 && progress < 100} className="bg-blue-500 text-white p-3 rounded-xl">
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default Write;
