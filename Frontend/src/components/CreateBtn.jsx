/* eslint-disable react/prop-types */
import { IoAddOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const CreateBtn = ({ mobile }) => {
  return (
    <Link
      to={"/create"}
      className="fixed p-1 text-2xl text-white bg-teal-600 rounded-md bottom-4 md:bottom-2 right-5 md:py-1 md:px-3 md:text-lg md:mb-2"
    >
      {!mobile ? (
        <div className="flex items-center ">
          <span> New Note </span>
          <IoAddOutline className="md:text-2xl" />
        </div>
      ) : (
        <IoAddOutline />
      )}
    </Link>
  );
};

export default CreateBtn;
