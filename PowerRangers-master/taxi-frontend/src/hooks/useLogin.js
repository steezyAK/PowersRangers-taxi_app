import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../utils/firebase.utils";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  // the google account log in

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  const loginWithGoogle = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send Email and Google UID to the backend
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid, // Send Google UID - that the firebase gives us - to the backend
          provider: "google", // Identify login provider
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Google login successful:", data);
        toast.success("logged in ");
        // Handle successful login (store data, manage sessions, etc.)
      } else {
        throw new Error(data.error);
      }
      window.location.href = "/comingsoon"; // Adjust the path as needed
    } catch (error) {
      console.error("Google login error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  // the email/password log in

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const login = async ({ email, password }) => {
    setLoading(true);

    try {
      // Firebase Email/Password Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }

      // Send Email and Password to the backend
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password, // Password will be used to authenticate in the backend
          provider: "email/password", // Identify login provider
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Login successful:", data);
        toast.success("Login successful !");
      } else {
        toast.error("data problem");
        throw new Error(data.error);
      }
      window.location.href = "/comingsoon"; // Adjust the path as needed
    } catch (error) {
      // Check for specific error codes
      if (error.code === "auth/email-already-in-use") {
        console.error("Email is already in use");
        return toast.error(
          "This email is already registered. Please use a different email or log in."
        );
      }
      if (error.code === "auth/invalid-email") {
        console.error("Invalid-email");
        return toast.error("Invalid-email");
      }
      if (error.code === "auth/invalid-credential") {
        console.error("Invalid-credential");
        return toast.error("Invalid-credential");
      }

      console.error("Login error:", error);
      toast.error("error.message");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login, loginWithGoogle };
};

export default useLogin;
