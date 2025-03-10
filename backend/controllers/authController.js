import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../resend/email.js";
import crypto from "crypto";

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

// METHOD: POST
// PATH: /api/auth/forgot-password
// DESCRIPTION: Send a password reset email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // Generate a reset password token and send it to the user's email
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    // Save the reset password token and expiry date to the user's document
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
    await user.save();

    // Send a password reset email to the user
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/api/auth/reset-password/${resetPasswordToken}`
    );

    // Respond with a success message
    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    res.status(500).json({ message: error.message });
  }
};

// METHOD: POST
// PATH: /api/auth/reset-password/:token
// DESCRIPTION: Reset user's password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Please enter a new password" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password: ", error);
    res.status(500).json({ message: error.message });
  }
};

// METHOD: GET
// PATH: /api/auth/check-auth
// DESCRIPTION: Check if the user is authenticated
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    res
      .status(200)
      .json({ successs: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.error("Error checking auth: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// METHOD: POST
// PATH: /api/auth/resend-email-code
// DESCRIPTION: Resend the verification email
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is provided
    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Check if the user's email is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate a new verification token
    const verificationToken = generateVerificationToken();

    // Update the user's verification token and expiry date
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send the verification email
    await sendVerificationEmail(user.email, verificationToken);

    // Respond with a success message
    res.status(201).json({
      success: true,
      message: "Verification email resent successfully",
      user: {
        ...user._doc,
        password: undefined,
        verificationToken: user.verificationToken,
        verificationTokenExpires: user.verificationTokenExpires,
      },
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error resending verification email: ", error);
    res.status(500).json({ message: error.message });
  }
};
