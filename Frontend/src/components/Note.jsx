/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import formatISO9075 from "date-fns/formatISO9075";
import { useContext } from "react";
import { BiEdit } from "react-icons/bi";
import { GiSemiClosedEye } from "react-icons/gi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { UserContext } from "../contexts/UserContext";

const Note = ({ note, fetchNotesData, customAlert }) => {
  const { _id: id, title, content, createdAt, author } = note;
  const { token } = useContext(UserContext);
  console.log(note);

  const handelDeleteNote = async (id) => {
    const localToken = JSON.parse(localStorage.getItem("token"));

    if (!localToken) {
      localStorage.setItem("token", null);
      window.location.reload(false);
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/status`, {
      headers: {
        Authorization: `Bearer ${localToken.token}`,
      },
    });

    if (res.status === 401) {
      localStorage.setItem("token", null);
      window.location.reload(false);
    } else {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      console.log(res);
      if (res.ok) {
        customAlert("Note Deleted.", toast.success);
        fetchNotesData();
      } else {
        customAlert("Access required", toast.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="p-3 border border-t-4 rounded-md shadow-lg border-t-teal-600 h-fit dark:shadow-teal-300 dark:shadow-md">
        <h3 className="mb-2 text-xl font-medium">{title}</h3>
        {/* <p className="mb-2">Author - {author?.username}</p> */}
        <p className="text-sm">{content.slice(0, 120)}</p>
        <div className="flex items-center justify-between pt-2 mt-1 border-t">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {formatISO9075(new Date(createdAt), { representation: "date" })}
          </p>
          <div className="flex justify-end text-xl gap-7 ">
            {token && token.userId === note.author.toString() && (
              <>
                <RiDeleteBin2Line
                  className="text-red-600 cursor-pointer"
                  title="delete"
                  onClick={() => handelDeleteNote(id)}
                />
                <Link to={`/edit/${id}`} title="edit">
                  <BiEdit className="text-teal-600" />
                </Link>
              </>
            )}
            <Link to={`/notes/${id}`} title="see more">
              <GiSemiClosedEye
                className="text-slate-600 dark:text-slate-300"
                fetchNotesData={fetchNotesData}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Note;
