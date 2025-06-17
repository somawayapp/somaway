import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/Homepage.jsx";
import AboutPage from "./routes/AboutPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ComingSoon from "./routes/comingsoonPage.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react"; // Import Vercel Analytics
import TermsAndConditions from "./routes/termsandconditionsPage.jsx";
import PrivacyPolicy from "./routes/privacypolicyPage.jsx";
import HelpCenter from "./routes/HelpcenterPage.jsx";
import PaymentTerms from "./routes/paymenttermsPage.jsx";
const queryClient = new QueryClient();



const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
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
        path: "/Payment-terms",
        element: <PaymentTerms />,
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
        path: "/about",
        element: <AboutPage />,
      },
     
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" />
        <Analytics />
      </QueryClientProvider>
  </StrictMode>
);
