/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import { useContext } from "react";
import { IoMdLogIn } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { UserContext } from "../contexts/UserContext";
import ErrorMessageStyle from "./ErrorMessageStyle";

const AuthForm = ({ isLogin }) => {
  const { updateToken } = useContext(UserContext);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
    email: "",
  };

  const submitHandler = async (values) => {
    const API = `${import.meta.env.VITE_API_URL}`;
    const { username, email, password } = values;
    let route = `${API}/register`;

    if (isLogin) {
      route = `${API}/login`;
    }
    const res = await fetch(route, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const toastAlert = (message) => {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
    };

    const responseData = await res.json();
    if (res.status === 201) {
      navigate("/login");
    } else if (res.status === 200) {
      updateToken(responseData);
      navigate("/");
    } else if (res.status === 400) {
      const registerErrorMessage = responseData.errorMessage[0].msg;
      toastAlert(registerErrorMessage);
    } else if (res.status === 401) {
      toastAlert(responseData.message);
    }
  };

  const AuthFormSchema = Yup.object({
    username: isLogin
      ? ""
      : Yup.string()
          .min(3, "Username is too short!")
          .max(15, "Username is too long!")
          .required("Username is Required!"),
    email: Yup.string()
      .required("Email is Required!")
      .email("Please enter a valid email!"),
    password: Yup.string()
      .min(4, "Password is too short!")
      .required("Password is Required!"),
  });

  return (
    <section className="px-3 mx-auto md:w-2/4 2xl:w-1/4 md:px-0 dark:text-black">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
      <h1 className="mb-5 text-xl font-medium text-center text-teal-500 md:text-2xl md:mb-4">
        {isLogin ? "Login Form" : "Register Form"}
      </h1>
      <Formik
        initialValues={initialValues}
        onSubmit={submitHandler}
        validationSchema={AuthFormSchema}
      >
        {({ isSubmitting }) => (
          <Form
            className="space-y-2 md:space-y-4"
            encType="multipart/form-data"
          >
            {!isLogin && (
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="font-medium text-teal-500 md:text-xl"
                >
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  className="w-full py-1 text-sm border-2 border-teal-500 rounded-lg outline-none ps-1 md:py-2"
                />
                <ErrorMessageStyle name="username" />
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="font-medium text-teal-500 md:text-xl"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                className="w-full py-1 text-sm border-2 border-teal-500 rounded-lg outline-none ps-1 md:py-2"
              />
              <ErrorMessageStyle name="email" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="font-medium text-teal-500 md:text-xl"
              >
                Password
              </label>
              <Field
                type="password"
                name="password"
                className="w-full py-1 text-sm border-2 border-teal-500 rounded-lg outline-none ps-1 md:py-2"
              />
              <ErrorMessageStyle name="password" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-teal-500 md:text-base">
                {isLogin ? "Don't Have Account?" : "Already Have Account?"}
              </p>
              <Link to={`${isLogin ? "/register" : "/login"}`}>
                <p className="text-sm text-teal-500 md:text-base">
                  {isLogin ? "Register Here" : "LogIn Here "}
                </p>
              </Link>
            </div>
            <div className="flex justify-center pt-2 md:pt-0">
              <button
                className="flex items-center gap-1 px-5 py-1 text-white bg-teal-600 rounded-full text-md md:text-xl md:py-1 md:px-8"
                type="submit"
                disabled={isSubmitting}
              >
                <IoMdLogIn />
                <span>
                  {isLogin
                    ? `${isSubmitting ? "Submitting" : "Login"}`
                    : `${isSubmitting ? "Submitting" : "Register"}`}
                </span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default AuthForm;
