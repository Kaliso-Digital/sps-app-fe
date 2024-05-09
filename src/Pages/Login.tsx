import React from "react";
import { useState } from "react";
import { useSignIn, useIsAuthenticated } from "react-auth-kit";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../Service/api";
import { useUserStore } from "../Service/userStore";
import { ToastContainer } from "react-toastify";
import PrimaryButton from "../Components/PrimaryButton";
import PrimaryButtonOutlined from "../Components/PrimaryButtonOutlined";
import HollowButton from "../Components/HollowButton";
import { usePermissions } from "../Service/PermissionsContext";
import * as yup from "yup";

const mockSignInWithGoogle = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const backgroundImageUrl = 'url("../Assets/onboarding/SignInBackground.jpg")';
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  if (isAuthenticated()){
    // Redirect to Dashboard
    navigate('/inquiries');
  }

  const signIn = useSignIn();
  const setUser = useUserStore((state) => state.setUserData);
  const { setPermissions } = usePermissions();
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      await validationSchema.validateAt(e.target.name, formData);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: "",
      }));
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: (error as { message: string }).message,
      }));
    }
  };

  // Handle Sign In action
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const responseData = await makeRequest('post',
                                           'login',
                                           {email: formData.email,
                                            password: formData.password});
    
      if (responseData.result) {
        signIn({
          token: responseData.data.token,
          expiresIn: 60, // 60*60*24*7,
          tokenType: 'Bearer',
          authState: { email: formData.email },
        })

        setUser(responseData.data);
        setPermissions(responseData.data.permissions);
        navigate('/inquiries', {replace: true});
      } else {
        // Perform Error Action
      }
    } catch (validationError) {
      // Handle validation errors
      const newErrors: { email?: string; password?: string } = {};
      (validationError as yup.ValidationError).inner.forEach(
        (error: yup.ValidationError) => {
          newErrors[error.path as keyof typeof newErrors] = error.message;
        }
      );

      // Update the state with the correct structure
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }

    setLoading(false);
  };

  const handleSignInWithGoogle = async () => {
    try {
      await mockSignInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error as Error);
    }
  };

  return (
    <div
      className=" flex font-satoshi "
      style={{
        backgroundImage: backgroundImageUrl,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer />
      <div className="flex flex-row justify-end items-center h-screen w-full mr-[15%]">
        <form
          className="bg-white shadow rounded px-8 pt-6 pb-8 mb-4 w-96"
          onSubmit={handleSignIn}
        >
          <div className="pb-4">
            <span className="text-xl font-bold mb-4">Sign in</span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              className={`appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
              border border-neutral-400 border-opacity-20 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder=""
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-2">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className={`appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                  border border-neutral-400 border-opacity-20 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                type={showPasswordToggle ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPasswordToggle(!showPasswordToggle)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke={showPasswordToggle ? "blue" : "currentColor"}
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
          </div>
          <div className="flex items-center justify-start">
            <div>
              <Link
                className="text-[#0D8FFD] text-sm font-medium hover:underline"
                to={"/resetpassword"}
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 mb-6">
            <PrimaryButton onClick={() => {}} text="Sign In" buttonType="submit" disabled={loading} fullWidth={true}/>
            <PrimaryButtonOutlined onClick={() => navigate('/register')} text="Don't have an account? Register here" buttonType="button"/>
          </div>
          <div className="w-full flex items-center justify-center text-center ">
            <hr className="flex-grow border-t border-gray-300 mr-4" />
            <span className="text-xs font-medium text-center">OR</span>
            <hr className="flex-grow border-t border-gray-300 ml-4" />
          </div>
          <div className="mt-6 w-full flex flex-col items-center justify-center">
            <img
              className="w-6 h-6 "
              src="./Assets/onboarding/search.png"
              alt="Google Logo"
            />
            <HollowButton onClick={handleSignInWithGoogle} text="Sign In with Google" buttonType="button"/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
