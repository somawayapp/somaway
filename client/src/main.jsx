import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/Homepage.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import SinglePostPage from "./routes/SinglePostPage.jsx";
import AboutPage from "./routes/AboutPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ComingSoon from "./routes/comingsoonPage.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react"; // Import Vercel Analytics
import PremiumPage from "./routes/PremiumPage.jsx";
import SettingsPage from "./routes/SettingsPage.jsx";
import TermsAndConditions from "./routes/termsandconditionsPage.jsx";
import SubscriptionPage from "./routes/SubscriptionPage.jsx";
import AddListingReview from "./routes/AddListingReview.jsx";
import AddListing from "./routes/AddListing.jsx";
import SubscriptionTerms from "./routes/subscriptiontermsPage.jsx";
import PrivacyPolicy from "./routes/privacypolicyPage.jsx";
import HelpCenter from "./routes/HelpcenterPage.jsx";
import HistoryPage from "./routes/HistoryPage.jsx";

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
        path: "/history",
        element: <HistoryPage />,
      },
      {
        path: "/terms",
        element: <TermsAndConditions />,
      },
      {
        path: "/help",
        element: <HelpCenter />,
      },
      {
        path: "/subscription-terms",
        element: <SubscriptionTerms />,
      },
    
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/coming-soon",
        element: <ComingSoon />,
      },
  
      {
        path: "/:slug",
        element: <SinglePostPage />,
      },
    
      {
        path: "/addlistingreview",
        element: <AddListingReview />,
      },
      {
      path: "/addlisting",
      element: <AddListing />,
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
        element: <AboutPage />,
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
