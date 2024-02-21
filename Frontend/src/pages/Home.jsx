/* eslint-disable react-hooks/exhaustive-deps */

import { useContext, useEffect, useState } from "react";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateBtn from "../components/CreateBtn";
import ErrorUI from "../components/ErrorUI";
import Loader from "../components/Loader";
import Note from "../components/Note";
import { UserContext } from "../contexts/UserContext";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const { token } = useContext(UserContext);

  useEffect(() => {
    fetchNotesData();
  }, [currentPage]);

  const fetchNotesData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/notes?page=${currentPage}`
      );
      if (!res.ok) {
        throw new Error("Something went wrong in getting Data");
      }
      const { notes, totalPages } = await res.json();
      setNotes(notes);
      setTotalPages(totalPages);
      setIsLoading(false);
      setIsError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setIsError(err.message);
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const customAlert = (message, status) => {
    status(message, {
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

  if (isError)
    return (
      <ErrorUI
        homePageError={true}
        message={isError}
        fetchNotesData={fetchNotesData}
      />
    );

  return (
    <>
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
      <section className="grid gap-3 pb-4 md:pb-6 md:space-y-0 md:grid-cols-3 ">
        {isLoading && <Loader />}
        {!isLoading && !notes.length && (
          <>
            <div className=" threeD text-2xl pl-[12px] pt-[10rem]  md:pl-[70px] lg:pl-[200px] xl:pl-[340px] 2xl:pl-[400px] md:text-5xl ">
              <h2 className="text-shadows ">
                Share Your Notes Here! <br />
                What are you waiting for ?
              </h2>
            </div>
            {token && (
              <div className="block md:hidden">
                <CreateBtn mobile={true} />
              </div>
            )}
          </>
        )}

        {!isLoading && !!notes.length && (
          <>
            {notes.map((note) => (
              <Note
                note={note}
                key={note._id}
                fetchNotesData={fetchNotesData}
                customAlert={customAlert}
              />
            ))}

            {token && (
              <div className="block md:hidden">
                <CreateBtn mobile={true} />
              </div>
            )}
          </>
        )}
      </section>

      {!isLoading && !!notes.length && (
        <div className="pb-5 space-x-3 text-center md:mb-0 ">
          {currentPage > 1 && (
            <button
              className="px-2 py-1 text-white bg-teal-600 rounded-md"
              onClick={handlePrevious}
            >
              Prev Page
            </button>
          )}
          {currentPage < totalPages && (
            <button
              className="px-2 py-1 text-white bg-teal-600 rounded-md "
              onClick={handleNext}
            >
              Next Page
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
