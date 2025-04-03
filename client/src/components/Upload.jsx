import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaCamera, FaUpload } from "react-icons/fa";

const MAX_IMAGES = 10;

const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/upload-auth`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    if (!data.signature || !data.token || !data.expire) {
      throw new Error("Authentication response missing required fields.");
    }
    return data;
  } catch (error) {
    console.error("Authentication request failed:", error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

const Upload = ({ type = "image", setProgress, setData }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);

  const handleFileSelect = useCallback(
    (files) => {
      const validFiles = Array.from(files).filter((file) =>
        file.type.startsWith(`${type}/`)
      );

      if (validFiles.length !== files.length) {
        toast.warn(
          `Some files were not of the expected type (${type}) and were ignored.`
        );
      }

      let selectedFiles = validFiles.slice(0, MAX_IMAGES - previewImages.length);

      if (selectedFiles.length < validFiles.length) {
        toast.warn(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      }

      if (selectedFiles.length === 0) {
        if (validFiles.length > 0) toast.info("Maximum image limit reached.");
        return;
      }

      const newImagePreviews = selectedFiles.map((file) => ({
        file,
        localUrl: URL.createObjectURL(file),
        name: file.name,
      }));

      setPreviewImages((prev) => [...prev, ...newImagePreviews]);
      setUploadQueue((prev) => [...prev, ...selectedFiles]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [previewImages.length, type]
  );

  const onError = (err) => {
    console.error("Upload Error:", err);
    const message = err?.message || "Image upload failed! Please try again.";
    toast.error(message);
    setProgress(0);
  };

  const onSuccess = (res, file) => {
    setData((prev) => [...prev, { url: res.url, fileId: res.fileId }]);
    setUploadQueue((prevQueue) => prevQueue.filter((f) => f.name !== file.name));
  };

  const onUploadProgress = (progress) => {
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handlePaste = useCallback(
    (event) => {
      const items = event.clipboardData.items;
      const files = [];
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith(`${type}/`)) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        handleFileSelect(files);
      }
    },
    [handleFileSelect, type]
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const removePreview = (indexToRemove) => {
    const removedImagePreview = previewImages[indexToRemove];
    setPreviewImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setUploadQueue((prevQueue) =>
      prevQueue.filter((file) => file.name !== removedImagePreview.name)
    );
    URL.revokeObjectURL(removedImagePreview.localUrl);
  };

  useEffect(() => {
    return () => {
      previewImages.forEach((img) => URL.revokeObjectURL(img.localUrl));
    };
  }, [previewImages]);

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div
        className="p-4 border-2 border-dashed border-gray-400 rounded-lg text-center cursor-pointer hover:bg-gray-200 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter") fileInputRef.current?.click();
        }}
      >
        <FaUpload className="mx-auto mb-2 text-xl text-gray-600" />
        {previewImages.length === 0
          ? "Click or Drag & Drop Images Here"
          : `Add more images (${previewImages.length}/${MAX_IMAGES})`}
        <span className="block text-xs text-gray-500">(Or paste images)</span>
      </div>

      <input
        type="file"
        multiple
        className="hidden"
        ref={fileInputRef}
        accept={`${type}/*`}
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(e.target.files);
          }
        }}
      />

      {previewImages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {previewImages.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.localUrl}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded border"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
                onClick={() => removePreview(index)}
                aria-label="Remove image"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadQueue.map((file, index) => (
        <IKUpload
          key={index}
          fileName={file.name}
          file={file}
          useUniqueFileName
          onError={onError}
          onSuccess={(res) => onSuccess(res, file)}
          onUploadProgress={onUploadProgress}
          className="hidden"
        />
      ))}
    </IKContext>
  );
};

export default Upload;
