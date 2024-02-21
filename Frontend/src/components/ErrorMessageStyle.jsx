/* eslint-disable react/prop-types */
import { ErrorMessage } from "formik";

const ErrorMessageStyle = ({ name }) => {
  return (
    <div className="font-mono text-sm font-bold text-red-600 md:text-base">
      <ErrorMessage name={name} />
    </div>
  );
};

export default ErrorMessageStyle;
