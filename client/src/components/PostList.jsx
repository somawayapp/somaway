const PostList = () => {
  const [columns, setColumns] = useState("repeat(1, 1fr)");
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [showMessage, setShowMessage] = useState(false);
  const [displayedPosts, setDisplayedPosts] = useState([]);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      setColumns(
        width > 1400
          ? "repeat(4, 1fr)"
          : width > 1000
          ? "repeat(3, 1fr)"
          : width > 640
          ? "repeat(2, 1fr)"
          : "repeat(1, 1fr)"
      );
    };

    window.addEventListener("resize", updateColumns);
    updateColumns();

    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const { data: allPosts = [], error, status } = useQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: () => fetchPosts(searchParams),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (allPosts.length === 0) return;
    setIsLoading(false);

    let newPosts = [];
    let index = 0;

    const loadNextBatch = (batchSize) => {
      newPosts = [...newPosts, ...allPosts.slice(index, index + batchSize)];
      setDisplayedPosts([...newPosts]);
      index += batchSize;
    };

    loadNextBatch(4);
    setTimeout(() => loadNextBatch(4), 50);
    setTimeout(() => loadNextBatch(4), 100);
    setTimeout(() => {
      while (index < allPosts.length) {
        loadNextBatch(8);
      }
    }, 150);
  }, [allPosts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Placeholder UI when loading */}
      {isLoading && (
        <div style={{ display: "grid", gridTemplateColumns: columns }} className="gap-6 md:gap-9 scrollbar-hide">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="relative aspect-[3/3] w-full h-full">
              <div className="absolute inset-0 bg-[var(--softBg4)] animate-pulse rounded-xl md:rounded-2xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error handling */}
      {error && <p>Something went wrong!</p>}

      {/* No posts found message */}
      {displayedPosts.length === 0 && showMessage && (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Link to="/addlisting"
            className="w-full px-6 py-3 rounded-xl border border-[var(--softBg4)] 
                     text-[var(--softTextColor)] shadow-md 
                     hover:text-[var(--textColor)] text-center"
          >
            <p className="mb-2">No posts found</p>
            <p className="mb-2 font-bold">Go back home</p>
          </Link>
        </div>
      )}

      {/* Display posts */}
      {displayedPosts.length > 0 && (
        <div className="gap-2 grid grid-cols-1 md:grid-cols-4 md:gap-6 scrollbar-hide">
          {displayedPosts.map((post) => (
            <PostListItem key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
