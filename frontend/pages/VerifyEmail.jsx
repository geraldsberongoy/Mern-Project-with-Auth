import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const {
    verifyEmail,
    isLoading,
    error: authError,
    email,
    resendEmailCode,
  } = useAuthStore();
  const [stringOtp, setStringOtp] = useState("");
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const hiddenEmail = email.replace(/(?<=.{3}).(?=[^@]*?.@)/g, "*");

  const handleChange = (index, value) => {
    if (value.length > 1 || isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input if the current input is filled
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          const newOtp = [...otp];
          newOtp[index - 1] = "";
          setOtp(newOtp);
          document.getElementById(`otp-input-${index - 1}`).focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (otp.includes("")) {
      setError("Please fill in the OTP");
      return;
    }

    setStringOtp(otp.join(""));
    console.log(stringOtp);

    await verifyEmail(stringOtp);
    toast.success("Email verified successfully!");
    navigate("/login");
  };

  const handleResend = async () => {
    setTimer(60);
    try {
      await resendEmailCode(email);
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    return () => {
      setError(null);
    };
  }, [error]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  return (
    <div className="bg-base-300 flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="card bg-base-100 w-96 p-6 text-center shadow-2xl">
        <h2 className="text-primary mb-2 text-2xl font-bold">
          OTP Verification
        </h2>
        <p className="text-base-content">An OTP has been sent to:</p>
        <p className="mb-4 text-base font-semibold">{hiddenEmail}</p>
        <form onSubmit={handleVerifyEmail}>
          <div className="mb-4 flex justify-center gap-2 py-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
                className="focus:border-primary h-12 w-12 rounded-lg border border-gray-400 text-center text-xl focus:outline-none"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button type="submit" className="btn btn-primary mb-2 w-full">
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Verify"
            )}
          </button>
        </form>

        <button
          onClick={handleResend}
          className="btn btn-link"
          disabled={timer > 0}
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
