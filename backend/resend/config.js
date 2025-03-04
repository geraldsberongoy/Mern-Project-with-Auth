import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "geraldberongoy04@gmail.com", // Your Gmail address
    pass: process.env.GMAIL_PASSWORD, // Use the generated App Password, NOT your actual Gmail password
  },
});
