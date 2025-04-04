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
  const [files, setFiles] = useState([]); // Store selected files
  const [uploadingIndex, setUploadingIndex] = useState(0); // Track the current file index

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]); // Append new image to array

    // Proceed with next file after the current one finishes
    if (uploadingIndex < files.length - 1) {
      setUploadingIndex((prev) => prev + 1);
      ref.current.click(); // Trigger upload for the next file
    }
  };

  const onUploadProgress = (progress) => {
    console.log(progress);
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handleFileSelection = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles); // Store all selected files
    setUploadingIndex(0); // Reset to start with the first file
    ref.current.click(); // Start uploading the first file immediately
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
        multiple
        ref={ref}
        accept={`${type}/*`}
        file={files[uploadingIndex]} // Upload the current file
      />
      <input
        type="file"
        multiple
        onChange={handleFileSelection}
        className="hidden"
      />
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;



