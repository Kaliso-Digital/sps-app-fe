import React, { useState, useEffect } from "react";
import { BASEURL } from "../Constants/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';

const mockSignInWithGoogle = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);
  const { email: emailFromParams, token: tokenFromParams } = useParams();

  useEffect(() => {
    // If email and token are present in the URL, move to step 2
    if (emailFromParams && tokenFromParams) {
      setEmail(emailFromParams);
      setStep(2);
    }
  }, [emailFromParams, tokenFromParams]);

  const navigate = useNavigate();

  const handleSignInWithGoogle = async () => {
    try {
      await mockSignInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error as Error);
    }
  };

  const [emailError, setEmailError] = useState("");

  const handleSendRecoveryEmail = async () => {
    try {
      if (!email) {
        setEmailError("Please enter your email address.");
        return;
      }

      setLoading(true);

      // Make actual backend call
      const response = await fetch(
        `${BASEURL}forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success(data.message ? data.message : 'Please check your inbox. If an email is associated with the provided email you will receive an  email.');
      } else {
        const data = await response.json();
        toast.error(data.message ? data.message : 'Something went wrong!');
      }
    } catch (error) {
      toast.error(`Something went wrong!${error}`)
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async () => {
    try {
      setLoading(true);

      if (newPassword !== confirmPassword || !newPassword || !confirmPassword) {
        setPasswordMismatchError(true);
        return;
      }
      // Make actual backend call
      const response = await fetch(
        `${BASEURL}reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailFromParams,
            token: tokenFromParams,
            password: newPassword,
            confirmPassword: confirmPassword,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        navigate("/");
      } else {
        const data = await response.json();
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(`Something went wrong!${error}`)
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;

    // Password strength validation (minimum 8 characters with at least one uppercase, one lowercase, one number, and one special character)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    } else {
      setPasswordError("");
    }

    // Update password state
    setNewPassword(newPassword);
  };

  const backgroundImageUrl = 'url("/Assets/onboarding/Desktop - 5.png")';

  return (
    <div
      className="flex font-satoshi"
      style={{
        backgroundImage: backgroundImageUrl,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer/>
      <div className="flex flex-row justify-end items-center h-screen w-full mr-[15%]">
        <form className="bg-white shadow rounded p-8 w-[26rem]">
          <div className="pb-4">
            <div className="flex flex-row items-center  text-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="#0D8FFD"
                className="w-6 h-6 items-center justify-center cursor-pointer"
                onClick={
                  step === 1
                    ? () => (window.location.href = "/")
                    : () => setStep(1)
                }
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              <div className="text-xl font-bold  items-center justify-center text-center">
                Forgot Password
              </div>
            </div>

            <span className="text-sm font-medium mb-4">
              {step === 1
                ? "Enter your account email address to send the recovery email to reset the account password."
                : "Enter your new password and confirm to access your account."}
            </span>
          </div>
          {step === 1 && (
            <div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none border border-neutral-400 border-opacity-20"
                  id="email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailError && (
                  <div className="text-sm text-red-500 mt-1">{emailError}</div>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-3 mb-6">
                <button
                  className="w-full text-white text-base font-semibold tracking-wide bg-[#0D8FFD] hover:bg-blue-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleSendRecoveryEmail}
                  disabled={loading}
                >
                  Send Recovery Email
                </button>
              </div>
              <div className="w-full flex items-center justify-center text-center ">
                <hr className="flex-grow border-t border-gray-300 mr-4" />
                <span className="text-xs font-medium text-center">OR</span>
                <hr className="flex-grow border-t border-gray-300 ml-4" />
              </div>
              <div className="mt-6 w-full flex flex-col items-center justify-center">
                <img
                  className="w-6 h-6 "
                  src="/Assets/onboarding/search.png"
                  alt="Google Logo"
                />
                <button
                  className="flex items-center text-base font-medium  rounded-md p-2 hover:shadow-md border-none outline-none shadow-none"
                  type="button"
                  onClick={handleSignInWithGoogle}
                  disabled={loading}
                >
                  Sign In with Google
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    className={`appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none border ${
                      passwordError ? "border-red-500" : "border-neutral-400"
                    } border-opacity-20`}
                    id="newPassword"
                    type={passwordVisible ? "text" : "password"}
                    placeholder=""
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke={passwordVisible ? "blue" : "currentColor"}
                      className="w-4 h-4 transition-colors duration-300 ease-in-out"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
                {passwordError && (
                  <div className="text-sm text-red-500 mt-1">
                    {passwordError}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    className={`appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none border ${
                      passwordMismatchError
                        ? "border-red-500"
                        : "border-neutral-400"
                    } border-opacity-20`}
                    id="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder=""
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke={confirmPasswordVisible ? "blue" : "currentColor"}
                      className="w-4 h-4 transition-colors duration-300 ease-in-out"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
                {passwordMismatchError && (
                  <div className="text-red-500 text-sm mt-1">
                    Passwords do not match.
                  </div>
                )}
              </div>
              <div className="mt-5 flex flex-col gap-3 mb-6">
                <button
                  className="w-full text-white text-base font-semibold tracking-wide bg-[#0D8FFD] hover:bg-blue-700 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  Reset Password
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
