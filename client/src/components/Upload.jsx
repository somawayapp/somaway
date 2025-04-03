import { IKContext, IKUpload } from "imagekitio-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

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
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ children, type, setProgress, setData }) => {
  const ref = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onError = (err) => {
    console.error(err);
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

  // Handle file selection manually
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  // Manually trigger uploads for all selected files
  const uploadAllFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No images selected!");
      return;
    }

    for (const file of selectedFiles) {
      await ref.current.uploadFile(file);
    }
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <input
        type="file"
        accept={`${type}/*`}
        multiple
        className="hidden"
        onChange={handleFileChange}
        ref={ref}
      />
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>
      <button onClick={uploadAllFiles} className="mt-2 p-2 bg-blue-500 text-white rounded">
        Upload Selected Images
      </button>
    </IKContext>
  );
};

export default Upload;
