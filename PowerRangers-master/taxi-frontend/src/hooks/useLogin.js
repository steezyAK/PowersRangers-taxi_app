import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

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
      const res = await fetch("/api/auth/login", {
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
        // Handle successful login (store data, manage sessions, etc.)
      } else {
        throw new Error(data.error);
      }
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password, // Password will be used to authenticate in the backend
          provider: "email_password", // Identify login provider
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Login successful:", data);
        toast.success("Login successful !");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login, loginWithGoogle };
};

export default useLogin;
