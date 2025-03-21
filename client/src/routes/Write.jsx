import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill-new";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import 'react-quill-new/dist/quill.snow.css';
import Navbar from "../components/Navbar";

const Write = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoaded, isSignedIn } = useUser();
  const [aboutbook, setAboutbook] = useState("");
  const [aboutauthor, setAboutauthor] = useState("");
  const [title, setTitle] = useState("");
  const [whoshouldread, setWhoshouldread] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null);
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState([]); // Store multiple images

  useEffect(() => {
    if (images.length > 0) {
      const imageElements = images.map((img) => `<p><img src="${img.url}" /></p>`).join("");
      setDesc((prev) => prev + imageElements);
    }
  }, [images]);

  const navigate = useNavigate();
  const { getToken } = useAuth();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    clearError();

    const submitButton = e.nativeEvent.submitter;
    if (!submitButton || submitButton.name !== "submitPost") return;

    let missingFields = [];

    if (!title.trim()) missingFields.push("Title");
    if (!whoshouldread.trim()) missingFields.push("Who Should Read");
    if (!aboutauthor.trim()) missingFields.push("About Author");
    if (!aboutbook.trim()) missingFields.push("About Book");
    if (!summary.trim()) missingFields.push("Summary");
    if (!desc.trim()) missingFields.push("Description");
    if (!category) missingFields.push("Category");
    if (!cover) missingFields.push("Cover Image");
    if (!author.trim()) missingFields.push("Author Name");
    if (images.length < 5 || images.length > 10) missingFields.push("Between 5-10 Images");

    if (missingFields.length > 0) {
      setError(`Missing fields: ${missingFields.join(", ")}`);
      return;
    }

    let slug = title.trim().replace(/\s+/g, "-").toLowerCase();
    slug = slug.replace(/[^a-z0-9-]/g, "").replace(/-+$/, "");
    slug += "-summary";

    const data = {
      title,
      whoshouldread,
      aboutbook,
      aboutauthor,
      desc,
      category,
      cover: cover?.filePath || "",
      author,
      summary,
      slug,
      isFeatured,
      images: images.map((img) => img.filePath), // Store image URLs
    };

    mutation.mutate(data);
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>You need to sign in to create a post!</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-[900px] mx-auto flex flex-col mb-[100px] px-2 justify-center items-center">
        <h1 className="text-xl md:text-3xl mt-[30px] mb-[30px] text-[var(--textColor)] font-semibold">
          Create a New Post
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Upload type="image" setProgress={setProgress} setImages={setImages} images={images}>
            <button className="p-2 bg-[var(--textColor)] text-white rounded-lg">
              Upload Images (5-10)
            </button>
          </Upload>

          <div className="flex flex-wrap gap-2">
            {images.map((img, index) => (
              <img key={index} src={img.url} alt="Uploaded" className="h-20 w-20 object-cover rounded-md" />
            ))}
          </div>

          <input type="text" placeholder="Enter Post Title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 rounded" />

          <button name="submitPost" type="submit" disabled={mutation.isPending || (progress > 0 && progress < 100)} className="bg-blue-500 text-white p-2 rounded">
            {mutation.isPending ? "Publishing..." : "Publish Post"}
          </button>

          {error && <div className="text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Write;
