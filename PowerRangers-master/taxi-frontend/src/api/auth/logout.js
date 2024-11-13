import React from "react";
import toast from "react-hot-toast";

const logout = () => {
  try {
    localStorage.removeItem("__paypal_storage__");
    localStorage.removeItem("user-info");

    // Redirect to login or home page
    window.location.href = "/home";
  } catch (error) {
    toast.error("Error logging out:", error);
    console.error("Error logging out:", error);
  }
};

export default logout;
