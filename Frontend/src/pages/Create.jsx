import { useContext } from "react";
import { Navigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { UserContext } from "../contexts/UserContext";

const Create = () => {
  const { token } = useContext(UserContext);
  return (
    <section>
      {token ? <NoteForm isCreate={true} /> : <Navigate to={"/login"} />}
    </section>
  );
};

export default Create;
