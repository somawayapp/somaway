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
  const { isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [img, setImg] = useState(null);
  const [cover, setCover] = useState(null);
  const [author, setAuthor] = useState("");
  const [progress, setProgress] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (img) {
      setDesc(prev => prev + `<p><img src="${img.url}"/></p>`);
    }
  }, [img]);

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

  const validateFields = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!desc) newErrors.desc = "Description is required";
    if (!category) newErrors.category = "Category is required";
    if (!cover) newErrors.cover = "Cover image is required";
    if (!author) newErrors.author = "Author name is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    let slug = title.trim().replace(/\s+/g, "-").toLowerCase();
    slug = slug.replace(/[^a-z0-9-]/g, "").replace(/-+$/, "");

    const data = {
      title,
      desc,
      category,
      img: cover?.filePath || "",
      author,
      slug,
      isFeatured,
    };

    mutation.mutate(data);
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>You need to sign in to create a post!</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-[1200px] mx-auto flex flex-col mb-[100px] px-2 justify-center items-center overflow-x-scroll">
        <h1 className="text-xl md:text-3xl mt-[30px] mb-[30px] text-[var(--textColor)] font-semibold">Create a New Post</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Upload type="image" setProgress={setProgress} setData={setCover}>
            <button className="p-2 bg-[var(--textColore)] text-[var(--textColor)] rounded-lg">Upload Cover Image</button>
          </Upload>
          {submitted && errors.cover && <div className="text-red-600">{errors.cover}</div>}

          {cover && <img src={cover.url} alt="Cover Preview" className="max-h-[200px] w-[50%] object-contain" />}

          <input type="text" placeholder="Enter Post Title" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 150))} className="p-2 bg-[var(--textColore)] text-[var(--textColor)] rounded" />
          {submitted && errors.title && <div className="text-red-600">{errors.title}</div>}

          <input type="text" placeholder="Author Name" value={author} onChange={(e) => setAuthor(e.target.value)} className="p-2 bg-[var(--textColore)] text-[var(--textColor)] rounded" />
          {submitted && errors.author && <div className="text-red-600">{errors.author}</div>}

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 bg-[var(--textColore)] text-[var(--textColor)] rounded">
            <option value="" disabled>Select a category</option>
            <option value="self-growth">Self-Growth</option>
            <option value="business-career">Business & Career</option>
            <option value="fiction">Fiction</option>
            <option value="productivity">Productivity</option>
            <option value="home-environment">Home & Environment</option>
            <option value="society-tech">Society & Tech</option>
            <option value="health">Health</option>
            <option value="family">Family</option>
            <option value="sports-fitness">Sports & Fitness</option>
            <option value="personalities">Personalities</option>
            <option value="happiness">Happiness</option>
            <option value="spirituality">Spirituality</option>
            <option value="leadership">Leadership</option>
            <option value="love-sex">Love & Sex</option>
            <option value="money-investments">Money & Investments</option>
            <option value="negotiation">Negotiation</option>
          </select>
          {submitted && errors.category && <div className="text-red-600">{errors.category}</div>}

          <ReactQuill value={desc} onChange={setDesc} placeholder="Write something..." className="bg-[var(--textColore)] text-[var(--textColor)] rounded" />
          {submitted && errors.desc && <div className="text-red-600">{errors.desc}</div>}

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} />
            Mark as Feature
          </label>

          <button disabled={mutation.isPending || (progress > 0 && progress < 100)} className="bg-blue-500 text-white p-2 rounded">
            {mutation.isPending ? "Publishing..." : "Publish Post"}
          </button>
          <span>Upload Progress: {progress}%</span>
        </form>
      </div>
    </div>
  );
};

export default Write;
