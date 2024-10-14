import { useState } from "react";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ComingSoon from "./pages/ComingSoon/ComingSoon";

function App() {
  return (
    <div data-theme="light" className="h-screen w-screen">
      <Toaster />
      <Routes>
        {/* <Route path="/" element={<Home/>}/> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
      </Routes>
    </div>
  );
}

export default App;
