import { useRef, useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setData, setProgress }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const ref = useRef(null);

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).slice(0, 10);
    setSelectedImages(imageFiles);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (!selectedImages.length) return toast.error("No images selected!");
    for (const image of selectedImages) {
      await ref.current.uploadFile(image);
    }
  };

  const onError = (err) => toast.error("Image upload failed!");
  const onSuccess = (res) => setData((prev) => [...prev, res]);
  const onUploadProgress = (progress) => setProgress(Math.round((progress.loaded / progress.total) * 100));

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="p-4 border rounded-lg bg-gray-100">
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-wrap gap-2">
          {selectedImages.map((img, index) => (
            <div key={index} className="relative w-24 h-24">
              <img src={URL.createObjectURL(img)} className="w-full h-full object-cover rounded-lg" alt="Preview" />
              <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">✕</button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => document.querySelector('input[type=file]').click()} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Select Images</button>
          <button onClick={uploadImages} className="bg-green-500 text-white px-4 py-2 rounded-lg">Upload</button>
        </div>
      </div>
      <IKUpload
        useUniqueFileName
        ref={ref}
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
      />
    </IKContext>
  );
};

export default Upload;
