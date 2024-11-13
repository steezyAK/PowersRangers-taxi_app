import { useState } from "react";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./pages/protectedRoute/ProtectedRoute";
import LandingPage from "./pages/landingPage/LandingPage";

// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import Checkout from './Checkout';

// const initialOptions = {
//   "client-id": import.meta.env.VITE_CLIENT_ID,
//   currency: "CAD",
//   intent: "capture",
// };

function App() {
  return (
    <div data-theme="light" className="h-screen w-screen">
      <Toaster />
      <Routes>
        {/* Redirect root to /profile */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/home" element={<LandingPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/ride" element={<Home />} />
          <Route path="/profile" element={<ComingSoon />} />
          <Route path="/settings" element={<ComingSoon />} />
          <Route path="/history" element={<ComingSoon />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
