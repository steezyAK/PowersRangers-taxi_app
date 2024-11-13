import React, { useEffect, useState } from "react";

// Function to get rides from the backend
const getRides = async () => {
  try {
    const res = await fetch("the url to get the rides", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch rides");
    }

    const data = await res.json();
    return data; // Return the fetched rides data
  } catch (error) {
    console.error("Error fetching rides:", error);
    throw error; // Rethrow the error if you need to handle it elsewhere
  }
};

export default getRides;
