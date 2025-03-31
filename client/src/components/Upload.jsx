import { useState, useRef } from "react";
import { toast } from "react-toastify";

const Upload = ({ setData }) => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const maxImages = 10;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) {
      toast.error("Maximum images added");
      return;
    }

    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.files;
    if (!items.length) return;
    handleFileChange({ target: { files: items } });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerUpload = () => fileInputRef.current.click();

  return (
    <div onPaste={handlePaste} className="space-y-4">
      <button
        onClick={triggerUpload}
        className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
      >
        {images.length ? "Add More Images" : "Add Images"}
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.url}
                alt="preview"
                className="w-24 h-24 object-cover rounded-md border"
              />
              <button
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                onClick={() => removeImage(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Upload;
