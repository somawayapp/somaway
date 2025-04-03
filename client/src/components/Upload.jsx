import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const authenticator = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ children, type, setProgress, setData }) => {
  const ref = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [fileList, setFileList] = useState([]);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10); // Limit to 10 images
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setFileList(files);
  };

  const handleDelete = (index) => {
    const newFiles = [...fileList];
    newFiles.splice(index, 1);
    setFileList(newFiles);
    setImagePreviews(newFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleCameraCapture = (e) => {
    const cameraFile = e.target.files[0];
    if (cameraFile) {
      setFileList([cameraFile]);
      setImagePreviews([URL.createObjectURL(cameraFile)]);
    }
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
        onChange={handleFileChange}
      />
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-[100px] h-[100px] object-cover rounded-lg"
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              onClick={() => handleDelete(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="cursor-pointer p-2 bg-blue-500 text-white rounded-lg">
          Capture from Camera
          <input
            type="file"
            accept="image/*"
            capture="camera"
            className="hidden"
            onChange={handleCameraCapture}
          />
        </label>
      </div>

      {/* Trigger image upload for all selected images */}
      <div className="mt-4">
        {fileList.length > 0 && (
          <IKUpload
            useUniqueFileName
            onError={onError}
            onSuccess={onSuccess}
            onUploadProgress={onUploadProgress}
            className="hidden"
            accept={`${type}/*`}
            multiple
            files={fileList} // Trigger upload for the list of files
          />
        )}
      </div>
    </IKContext>
  );
};

export default Upload;
