/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react";
import { IoMdLogIn } from "react-icons/io";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import CreateBtn from "./CreateBtn";
import Theme from "./Theme";

const Nav = () => {
  const { token, updateToken } = useContext(UserContext);

  const handleLogout = () => {
    updateToken(null);
  };

  return (
    <nav className="sticky top-0 z-10 px-2 py-3 backdrop-blur-sm bg-white/30 dark:bg-slate-800 dark:text-white">
      <div className="flex items-center justify-between">
        <Link
          to={"/"}
          className="mb-2 text-2xl text-teal-600 md:text-3xl textShadow"
        >
          DNOTE.io
        </Link>
        <div className="flex items-center gap-3">
          {token && token.username && (
            <p className="items-center hidden text-lg font-medium text-teal-700 md:flex dark:text-gray-300">
              <span className="font-bold ">LogIn as -</span>
              {token.username}
            </p>
          )}
          <Theme />
          {token ? (
            <button
              className="flex items-center gap-1 p-1 px-3 text-white bg-teal-600 rounded-md md:text-lg md:me-40"
              onClick={handleLogout}
            >
              <IoMdLogIn />
              LogOut
            </button>
          ) : (
            <Link
              to={"/login"}
              className="flex items-center gap-1 p-1 px-3 text-white bg-teal-600 rounded-md md:text-lg md:me-40 "
            >
              <IoMdLogIn />
              Login
            </Link>
          )}
        </div>
      </div>

      {token && token.username && (
        <p className="items-center font-medium text-teal-700 md:hidden text-md dark:text-gray-300">
          <span className="font-bold ">LogIn as -</span>
          {token.username}
        </p>
      )}

      {token && (
        <div className="hidden md:block">
          <CreateBtn mobile={false} />
        </div>
      )}
    </nav>
  );
};

export default Nav;
