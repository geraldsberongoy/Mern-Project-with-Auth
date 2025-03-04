import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateJWTToken } from "../utils/generateJWTToken.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../resend/email.js";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const userAlreadyExist = await User.findOne({ email });

    if (userAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateVerificationToken();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    generateJWTToken(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({ verificationToken: code });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    if (user.verificationTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Verification token has expired" });
    }

    // If the token is valid and not expired, you can proceed with verification
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email: ", error);
    res.status(500).json({ message: error.message });
  }
};
