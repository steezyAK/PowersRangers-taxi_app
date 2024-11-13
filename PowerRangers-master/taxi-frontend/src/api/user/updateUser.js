const updateUserInfo = async (updatedUserData) => {
  try {
    const res = await fetch("backend url the edit the profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData), // send the updated user data
    });

    if (!res.ok) {
      throw new Error("Failed to update user information.");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export default updateUserInfo;
