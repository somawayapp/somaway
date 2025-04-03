import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
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

  // Handle errors
  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  // Handle success and add the files to state
  const onSuccess = (res) => {
    console.log("Upload successful:", res);
    if (Array.isArray(res)) {
      // For multiple file uploads
      res.forEach((file) => {
        setData((prev) => [...prev, file]); // Append each file to the state
      });
    } else {
      // For single file uploads
      setData((prev) => [...prev, res]); // Add single file to state
    }
  };

  // Track upload progress
  const onUploadProgress = (progress) => {
    console.log(progress);
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
        className="hidden"  // Keep the upload button hidden (triggered by click)
        ref={ref}
        accept={`${type}/*`}  // Ensure the file type is correct
        multiple // Allow multiple file uploads
      />
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;



