/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import format from "date-fns/format";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { WiTime8 } from "react-icons/wi";
import { Link, useParams } from "react-router-dom";
import ErrorUI from "../components/ErrorUI";
import Loader from "../components/Loader";

const Details = () => {
  const { id } = useParams();
  const [note, setNote] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const { title, content, createdAt, cover_image: photo, author } = note;

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getNote();
  }, []);

  const getNote = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/notes/${id}`);
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const data = await res.json();
      setNote(data);
      setLoading(false);
      setIsError(null);
    } catch (err) {
      setIsError(err.message);
      setLoading(false);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorUI homePageError={false} message={isError} />;

  return (
    <div className="p-3 pb-5 border border-t-4 rounded-md shadow-lg border-t-teal-600 md:w-1/2 md:mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-medium">{title}</h3>
        <Link to={"/"}>
          <IoMdArrowRoundBack className="p-1 text-2xl text-white bg-teal-600 rounded-md" />
        </Link>
      </div>

      <p className="flex items-center gap-1 mb-2">
        <FaUserAlt /> - {author?.username}
      </p>
      <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
        {content}
      </p>

      {photo && (
        <img
          src={`${API}/${photo}`}
          alt="image"
          className={`object-cover w-full rounded-lg ${photo ? "mt-5" : ""}`}
        />
      )}

      {createdAt && (
        <div className="flex justify-between mt-5">
          <div className="flex items-center gap-1">
            <SlCalender />
            <p className="text-sm md:text-base">
              {format(new Date(createdAt), "yyyy-MM-dd")}
            </p>
          </div>

          <div className="flex items-center">
            <WiTime8 className="text-xl" />
            <p className="text-sm md:text-base">
              {format(new Date(createdAt), "h:mm a")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
