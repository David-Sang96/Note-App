/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ErrorUI = ({ homePageError, message, fetchNotesData }) => {
  return (
    <main className="grid min-h-full px-6 py-24 bg-white place-items-center sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-2xl font-medium text-red-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-teal-700 sm:text-5xl">
          {message}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="flex items-center justify-center mt-10 gap-x-6">
          {homePageError ? (
            <button
              className="rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
              onClick={() => fetchNotesData()}
            >
              Try Again
            </button>
          ) : (
            <Link
              to={"/"}
              className="rounded-md bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
            >
              Go Back Home
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};

export default ErrorUI;
