import nodemailer from "nodemailer";
import { emailVerifTOkenTemplate } from "./emailTemplate.js";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "geraldberongoy04@gmail.com", // Your Gmail address
    pass: process.env.GMAIL_PASSWORD, // Use the generated App Password, NOT your actual Gmail password
  },
});

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: "geraldberongoy04@gmail.com", // Replace with your Gmail
      to: email,
      subject: "Verify Your Email Address",
      html: emailVerifTOkenTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending verification email: ", error);
    throw new Error("Error sending verification email");
  }
};
