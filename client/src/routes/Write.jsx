import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import 'react-quill-new/dist/quill.snow.css';

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null);
  const [author, setAuthor] = useState("");
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

  const generateSlug = (title) => {
    return title
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();

    if (!title) return setError("Please include a title for your post.");
    if (!desc) return setError("Please include a description for your post.");
    if (!category) return setError("Please select a category for your post.");
    if (!cover?.filePath) return setError("Please upload a cover image for your post.");
    if (!author) return setError("Please enter the author's name.");

    const timestamp = Date.now();
    const slug = `${generateSlug(title)}-${timestamp}`;

    const data = {
      img: cover.filePath,
      title,
      category,
      desc,
      slug,
      author,
      isFeatured,
    };

    mutation.mutate(data);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setCover({ file, previewUrl, filePath: null });

    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const token = await getToken();
      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          },
        }
      );
      
      if (uploadResponse.data?.filePath) {
        setCover((prev) => ({ ...prev, filePath: uploadResponse.data.filePath }));
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      toast.error("Image upload failed. Try again.");
      setCover(null);
      setProgress(0);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (isLoaded && !isSignedIn) return <div>You need to sign in to create a post!</div>;

  return (
    <div className="max-w-[900px] flex flex-col gap-6 px-4 py-6">
      <h1 className="text-3xl font-semibold">Create a New Post</h1>
      {error && <div className="p-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
        <button type="button" onClick={() => fileInputRef.current.click()} className="p-3 bg-blue-500 text-white rounded-lg">
          {progress > 0 && progress < 100 ? `Uploading... (${progress}%)` : "Add a Cover Image"}
        </button>
        {cover?.previewUrl && <img src={cover.previewUrl} alt="Cover Preview" className="max-w-xs rounded-md" />}
        
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 150))} placeholder="Enter Post Title" className="p-3 border rounded-lg" />
        
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author Name" className="p-3 border rounded-lg" />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3 border rounded-lg">
          <option value="" disabled>Select a category</option>
          <option value="general">General</option>
        </select>
        
        <ReactQuill value={desc} onChange={setDesc} placeholder="A Short Description" className="border rounded-lg" />
        
        <label className="flex gap-2">
          <input type="checkbox" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} /> Is this post featured?
        </label>
        
        <button disabled={mutation.isPending || (progress > 0 && progress < 100)} className="p-3 bg-blue-600 text-white rounded-lg">
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default Write;

