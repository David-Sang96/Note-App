import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorUI from "./components/ErrorUI";
import Main from "./layouts/Main";
import Create from "./pages/Create";
import Details from "./pages/Details";
import Edit from "./pages/Edit";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import isLoginLoader from "./utils/isLogin";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Main />,
      // loader: isLoginLoader,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/create",
          element: <Create />,
          loader: isLoginLoader,
        },
        {
          path: "/edit/:id",
          element: <Edit />,
          loader: isLoginLoader,
        },
        {
          path: "/notes/:id",
          element: <Details />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "*",
          element: <ErrorUI />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
