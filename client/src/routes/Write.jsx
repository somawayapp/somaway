const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null); // Initially null, will hold the image file and preview URL
  const [progress, setProgress] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false); // Added state for featured
  const [titleRemainingChars, setTitleRemainingChars] = useState(150);
  const [descRemainingChars, setDescRemainingChars] = useState(10000);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { getToken } = useAuth();

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
      img: cover.filePath, // Assuming `filePath` is the path to the uploaded file
      title,
      category,
      desc,
      slug,
      isFeatured, // Added the isFeatured field
    };

    mutation.mutate(data);
  };

  if (!isLoaded) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="text-center mt-8">You need to sign in to create a post!</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6 px-4 py-6">
      <h1 className="text-3xl font-semibold text-black">Create a New Post</h1>
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        {/* Upload Component */}
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button
            type="button"
            onClick={clearError}
            disabled={progress > 0 && progress < 100}
            className="w-max p-3 shadow-md rounded-xl text-sm text-black bg-blue-500 disabled:opacity-50 hover:bg-blue-400 transition-all duration-200"
          >
            {progress > 0 && progress < 100 ? "Uploading..." : "Add a cover image"}
          </button>
        </Upload>

        {/* Image Preview */}
        {cover && cover.filePath && (
          <div className="mt-4">
            <h3 className="text-sm text-gray-600">Image Preview</h3>
            <img src={cover.filePath} alt="Cover Preview" className="w-full h-auto rounded-xl shadow-lg" />
          </div>
        )}

        {/* Title Input */}
        <div>
          <input
            className="text-md font-semibold rounded-xl bg-transparent outline-none p-3 w-full border border-1 border-gray-300"
            type="text"
            placeholder="Enter Post Title"
            value={title}
            onChange={handleTitleChange}
            name="title"
          />
          <span className="text-sm text-gray-600">{titleRemainingChars} characters remaining</span>
        </div>

        {/* Category Selection */}
        <div className="flex items-center gap-4">
          <label htmlFor="category" className="text-sm text-gray-600">Choose a category:</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-xl bg-gray-100 text-gray-600 shadow-md w-full max-w-xs"
          >
            <option value="" disabled>Select a category</option>
            <option value="general">General</option>
            <option value="apps">Apps</option>
            <option value="software">Software</option>
            {/* Add more categories as necessary */}
          </select>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-4 mt-4">
          <label className="text-sm text-gray-600">Featured Post:</label>
          <button
            type="button"
            onClick={() => setIsFeatured(!isFeatured)}
            className={`px-4 py-2 rounded-xl ${isFeatured ? 'bg-green-500' : 'bg-gray-400'} text-white transition-all duration-200`}
          >
            {isFeatured ? "Featured" : "Not Featured"}
          </button>
        </div>

        {/* Rich Text Description Input using ReactQuill */}
        <div>
          <ReactQuill 
            value={desc} 
            onChange={handleDescChange} 
            className="border border-1 border-gray-300 rounded-xl text-gray-600"
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
          <span className="text-sm text-gray-600">{descRemainingChars} characters remaining</span>
        </div>

   


        {/* Submit Button */}
        <button
          disabled={mutation.isPending || (progress > 0 && progress < 100)}
          className="bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-xl mt-4 p-3 w-full disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Publishing..." : "Publish Post"}
        </button>
        <span className="text-sm text-gray-600">{`Progress: ${progress}%`}</span>
      </form>
    </div>
  );
};

export default Write;
