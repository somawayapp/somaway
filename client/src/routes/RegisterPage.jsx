import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div  style={{ paddingTop: "100px",  }} className="flex items-center px-3 md:px-9 justify-center h-[calc(100vh-80px)]">
      <SignUp signInUrl="/login" />
    </div>
  );
};

export default RegisterPage;
