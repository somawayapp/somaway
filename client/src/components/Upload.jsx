import { IKContext, IKUpload } from "imagekitio-react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return { signature: data.signature, expire: data.expire, token: data.token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ type, setProgress, setData }) => {
  const ref = useRef(null);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const maxImages = 10;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const newImages = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handlePaste = (e) => {
    handleFileChange({ target: { files: e.clipboardData.files } });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange({ target: { files: e.dataTransfer.files } });
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerUpload = () => fileInputRef.current.click();
  const triggerCamera = () => cameraInputRef.current.click();

  const onError = (err) => {
    console.error(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    setData((prev) => (prev ? [...prev, res] : [res]));
  };

  const onUploadProgress = (progress) => {
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
        multiple
      />
      
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
        
        {setProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-lg">
            <div
              className="bg-blue-500 text-xs font-semibold text-white text-center p-1 rounded-lg"
              style={{ width: `${setProgress}%` }}
            >
              {setProgress}%
            </div>
          </div>
        )}
      </div>
    </IKContext>
  );
};

export default Upload;