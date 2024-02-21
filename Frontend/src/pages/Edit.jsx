import { useContext } from "react";
import { Navigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { UserContext } from "../contexts/UserContext";

const Edit = () => {
  const { token } = useContext(UserContext);
  return (
    <section>
      {token ? <NoteForm isCreate={false} /> : <Navigate to={"/login"} />}
    </section>
  );
};

export default Edit;
