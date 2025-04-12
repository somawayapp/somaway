const PostListItem = ({ post }) => {
  if (!post || typeof post !== "object") return null;

  const {
    title = "Untitled",
    price = "N/A",
    img = [],
    location = {},
    propertyname = "",
    slug = "",
  } = post;

  const imageUrl = Array.isArray(img) && img.length > 0 ? img[0] : null;

  return (
    <div className="rounded-xl border shadow-md p-3 bg-white">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <h2 className="mt-2 font-bold text-lg">{title}</h2>
      <p className="text-sm text-gray-600">Ksh {price.toLocaleString()}</p>
      <p className="text-sm text-gray-500">{location.city || "Unknown Location"}</p>
    </div>
  );
};

export default PostListItem;
