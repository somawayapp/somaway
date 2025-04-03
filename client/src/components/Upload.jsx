import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState, useCallback, useEffect } from "react"; 
import { toast } from "react-toastify";
import { FaTimes, FaCamera, FaUpload } from "react-icons/fa";

const MAX_IMAGES = 10;

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ children, type, setProgress, setData }) => {
  const ref = useRef(null); // Reference for the IKUpload component
  const fileInputRef = useRef(null); // Reference for file input element
  const [previewImages, setPreviewImages] = useState([]); // Stores preview images

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]); // Append new image to array
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith(`${type}/`));

    if(validFiles.length !== files.length){
        toast.warn(`Some files were not of the expected type (${type}) and were ignored.`);
    }

    let selectedFiles = validFiles.slice(0, MAX_IMAGES - previewImages.length);

    if (selectedFiles.length === 0) {
      if (validFiles.length > 0) toast.info("Maximum image limit reached.");
      return;
    }

    const newImagePreviews = selectedFiles.map((file) => ({
      file,
      localUrl: URL.createObjectURL(file),
    }));

    setPreviewImages((prev) => [...prev, ...newImagePreviews]);
  }, [previewImages.length, type]);

  const handleClick = () => {
    fileInputRef.current?.click(); // Trigger file input click
  };

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.addEventListener("change", (e) => {
        if (e.target.files) {
          handleFileSelect(e.target.files);
        }
      });
    }
  }, [handleFileSelect]);

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      {/* Trigger for selecting files */}
      <div
        className="p-4 border-2 border-dashed border-[var(--softBg4)] rounded-lg text-center cursor-pointer hover:bg-[var(--softBg2)] transition-colors"
        onClick={handleClick} // Trigger hidden input
        role="button"
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter') handleClick(); }} // Accessibility
      >
        <FaUpload className="mx-auto mb-2 text-xl text-[var(--softTextColor)]"/>
        {previewImages.length === 0
          ? "Click or Drag & Drop Images Here"
          : `Add more images (${previewImages.length}/${MAX_IMAGES})`}
        <span className="block text-xs text-[var(--softTextColor)]">(Or paste images)</span>
      </div>

      <input
        type="file"
        multiple
        className="hidden"
        ref={fileInputRef}
        accept={`${type}/*`}
      />

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          onClick={handleClick}
          disabled={previewImages.length >= MAX_IMAGES}
        >
          Select Files
        </button>
      </div>

      {/* Image Previews */}
      {previewImages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {previewImages.map((img, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={img.localUrl}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded border border-[var(--softBg4)]"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-70 group-hover:opacity-100 transition-opacity focus:opacity-100"
                onClick={() => setPreviewImages(prev => prev.filter((_, i) => i !== index))}
                aria-label="Remove image"
              >
                <FaTimes size={12}/>
              </button>
            </div>
          ))}
        </div>
      )}

      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
        multiple // Allow multiple uploads
      />

      {/* Trigger for starting the upload */}
      <div className="cursor-pointer" onClick={() => ref.current?.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
