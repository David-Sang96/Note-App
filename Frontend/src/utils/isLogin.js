/* eslint-disable react-hooks/rules-of-hooks */
import { redirect } from "react-router-dom";

const isLogin = async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) return redirect("/");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/status`, {
    headers: {
      Authorization: `Bearer ${token.token}`,
    },
  });

  if (res.status === 401) {
    localStorage.setItem("token", null);
    window.location.reload(false);
    return redirect("/");
  } else {
    return null;
  }
};

export default isLogin;
