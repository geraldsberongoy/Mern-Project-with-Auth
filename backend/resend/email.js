import {
  emailVerifTOkenTemplate,
  emailWelcomeTemplate,
} from "./emailTemplate.js";
import { transporter } from "./config.js";
import dotenv from "dotenv";
dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Verify Your Email Address",
      html: emailVerifTOkenTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending verification email: ", error);
    throw new Error("Error sending verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Welcome to our platform",
      html: emailWelcomeTemplate.replace("{name}", name),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending welcome email: ", error);
    throw new Error("Error sending welcome email");
  }
};
