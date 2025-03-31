import { useState, useRef } from "react";
import { toast } from "react-toastify";

const Upload = ({ setData }) => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const maxImages = 10;

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) {
      toast.error("Maximum images added");
      return;
    }
  
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file, // Keep the file for upload
    }));
  
    setImages((prev) => [...prev, ...newImages]);
  
    // Make sure to update setData in parent (AddListingReview) with actual files
    setData((prev) => [...prev, ...newImages]);
  };
  

  const handlePaste = (e) => {
    const items = e.clipboardData.files;
    if (!items.length) return;
    handleFileChange({ target: { files: items } });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    handleFileChange({ target: { files } });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setData((prev) => prev.filter((_, i) => i !== index)); // Sync with parent
      };
 
  const triggerUpload = () => fileInputRef.current.click();
  const triggerCamera = () => cameraInputRef.current.click();

  return (
    <div
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="space-y-4 border-dashed border-2 border-gray-400 p-4 rounded-lg"
    >
      <div className="flex gap-2">
        <button
          onClick={triggerUpload}
          className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
        >
          {images.length ? "Add More Images" : "Add Images"}
        </button>
        <button
          onClick={triggerCamera}
          className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
        >
          Capture from Camera
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
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