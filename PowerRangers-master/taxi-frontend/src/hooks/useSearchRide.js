import React from "react";

const useSearchRide = () => {
  return <div></div>;
};

function handleInputErrors({ email, username, password, confirmPassword }) {
  if (!email?.trim() || !username?.trim() || !password || !confirmPassword) {
    toast.error("Please fill in all fields");
    console.log("EMPTY");

    return false;
  }

  //   email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  if (!validateEmail(email)) {
    toast.error("Invalid email format");
    return false;
  }

  //   password validation
  if (password !== confirmPassword) {
    console.log("not match");
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}

export default useSearchRide;
