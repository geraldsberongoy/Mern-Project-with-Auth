import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../resend/email.js";

// METHOD: POST
// PATH: /api/auth/signup
// DESCRIPTION: Register a new user
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Check if the user already exists
    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if the password meets the minimum length requirement
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Generate a verification token
    const verificationToken = generateVerificationToken();

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Generate a JWT token and send it as a cookie
    generateJWTToken(res, user._id);

    // Send a verification email to the user
    await sendVerificationEmail(user.email, verificationToken);

    // Respond with a success message and the user data (excluding the password)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ success: false, message: error.message });
  }
};

// METHOD: POST
// PATH: /api/auth/login
// DESCRIPTION: Login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Password" });
    }

    // Check if the user's email is verified
    const isVerified = user.isVerified;
    if (!isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is not verified" });
    }

    // Generate a JWT token and send it as a cookie
    generateJWTToken(res, user._id);

    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.log("Error logging in user: ", error);
    res.status(400).json({ message: error.message });
  }
};

// METHOD: POST
// PATH: /api/auth/logout
// DESCRIPTION: Logout a user
export const logoutUser = async (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie("token");
    // Respond with a success message
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error logging out: ", error);
    res.status(500).json({ message: "Error logging out" });
  }
};

// METHOD: POST
// PATH: /api/auth/verify-email
// DESCRIPTION: Verify user's email
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    // Find the user by verification token
    const user = await User.findOne({ verificationToken: code });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // Check if the verification token has expired
    if (user.verificationTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Verification token has expired" });
    }

    // If the token is valid and not expired, proceed with verification
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Send a welcome email to the user
    await sendWelcomeEmail(user.email, user.name);

    // Respond with a success message
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error verifying email: ", error);
    res.status(500).json({ message: error.message });
  }
};
