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
  const [files, setFiles] = useState([]);

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData((prev) => [...prev, res]); // Append uploaded file to state
  };

  const onUploadProgress = (progress) => {
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <input
        type="file"
        multiple
        accept={`${type}/*`}
        className="hidden"
        ref={ref}
        onChange={handleFileChange}
      />
      {files.map((file, index) => (
        <IKUpload
          key={index}
          file={file}
          useUniqueFileName
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
        />
      ))}
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;

