import React from "react";
import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <Image
      className="rounded-full select-none"
      height="30"
      width="30"
      alt="Avatar"
      src={src || "/placeholder.webp"}
    />
  );
};

export default Avatar;
