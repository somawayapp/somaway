import { IKContext, IKUpload } from "imagekitio-react";
import { useRef } from "react";
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
    toast.error(`Failed to get upload auth: ${error.message}`);
    throw error;
  }
};

const Upload = ({ type, setData, setProgress, setPreview, children }) => {
  const ikRef = useRef();

  const onUploadError = (error) => {
    toast.error("Image upload failed: " + error.message);
  };

  const onUploadSuccess = (file) => {
    const filePath = file.url;
    setData({ ...file, filePath });
    setPreview(file.url); // Set the preview URL when upload is successful
    toast.success("Image uploaded successfully!");
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      authenticationEndpoint={authenticator}
    >
      <IKUpload
        ref={ikRef}
        onError={onUploadError}
        onSuccess={onUploadSuccess}
        onProgress={setProgress}
        fileName={type === "image" ? "cover.jpg" : "file.mp4"}
        useUniqueFileName={true}
      >
        {children}
      </IKUpload>
    </IKContext>
  );
};

export default Upload;
