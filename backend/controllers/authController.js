export const signupUser = (req, res) => {
  try {
    res.status(200).json({ message: "Signup user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = (req, res) => {
  try {
    res.status(200).json({ message: "Login user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.status(200).json({ message: "Logout user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
