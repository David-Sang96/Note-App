import { Outlet, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Nav from "../components/Nav";

const Main = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen dark:bg-slate-800 dark:text-white">
      <section className=" md:container md:mx-auto">
        <Nav />
        <SwitchTransition>
          <CSSTransition
            key={location.pathname}
            timeout={200}
            classNames={"fade"}
          >
            <div className="px-2 mt-5 ">
              <Outlet />
            </div>
          </CSSTransition>
        </SwitchTransition>
      </section>
    </div>
  );
};

export default Main;
