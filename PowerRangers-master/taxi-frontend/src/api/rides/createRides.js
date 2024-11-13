import React from "react";

const createRides = async (rideData) => {
  try {
    const transferedData = {
      userEmail: rideData.userEmail,
      departure_adress: rideData.departure_adress,
      departure_coord: rideData.departure_coord,
      destination_adress: rideData.destination_adress,
      destination_coord: rideData.destination_coord,
      rideType: rideData.rideType,
      eta: rideData.eta,
      arrival_time: rideData.arrival_time,
      price: rideData.price,
    };
    const res = await fetch("the url to create the ride", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transferedData), // Pass rideData here
    });

    if (!res.ok) {
      throw new Error("Failed to create ride");
    }

    const data = await res.json();
    return data; // You can return the response data if needed
  } catch (error) {
    console.error("Error creating ride:", error);
  }
};

export default createRides;
