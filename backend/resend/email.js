import { resend } from "./config.js";
import { emailVerifTOkenTemplate } from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email Address",
      html: emailVerifTOkenTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    });
    console.log("Email sent: ", data);
  } catch (error) {
    console.error("Error sending verif email: ", error);
    throw new Error("Error sending verification email");
  }
};
