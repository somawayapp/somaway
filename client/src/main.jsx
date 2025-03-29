import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/Homepage.jsx";
import Write from "./routes/Write.jsx";
import LandingPage from "./routes/LandingPage.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import SinglePostPage from "./routes/SinglePostPage.jsx";
import AboutPage from "./routes/AboutPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react"; // Import Vercel Analytics
import PremiumPage from "./routes/PremiumPage.jsx";
import SettingsPage from "./routes/SettingsPage.jsx";
import SubscriptionPage from "./routes/SubscriptionPage.jsx";
import ReviewsHomePage from "./routes/ReviewsHompage.jsx";
import ReviewsPostPage from "./routes/ReviewsPostPage.jsx";

const queryClient = new QueryClient();

// Hardcoded Clerk publishable key

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_live_Y2xlcmsubWFrZXNvbWF3YXkuY29tJA";

if (!clerkPublishableKey) {
    throw new Error("Missing Clerk Publishable Key!");
}
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      
      {
        path: "/reviws/",
        element: <ReviewsHomePage />,
      },
     
      {
        path: "/reviews/:slug",
        element: <ReviewsPostPage />,
      },
      {
        path: "/:slug",
        element: <SinglePostPage />,
      },
      {
        path: "/addlisting#review",
        element: <Write />,
      },
      {
      path: "/addlisting",
      element: <Write />,
    },
      {
        path: "/subscribe",
        element: <SubscriptionPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
   
      {
        path: "/about",
        element: <LandingPage />,
      },
      {
        path: "/premium",
        element: <PremiumPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" />
        <Analytics />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>
);
