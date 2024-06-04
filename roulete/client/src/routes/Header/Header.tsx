import { NavLink } from "react-router-dom";
import HeaderLogin from "./HeaderLogin";
import { FC } from "react";
import { HeaderProps } from "./Header";

const Header: FC<HeaderProps> = ({isLoggedIn, username}) => {
  return (
    <>
      <header className="flex px-5 py-4 bg-emerald-900 w-full flex-row flex-wrap justify-around items-center min-h-[160px]">
        <h1 className=" float-start text-7xl text-cyan-400 font-bold">
          <NavLink to={"/"}>FunRoulete</NavLink>
        </h1>
        <ul className="list-none flex flex-row gap-8 text-2xl font-normal text-cyan-400 uppercase">
          <li className="hover:underline hover:transition-all hover:opacity-80 ">
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { color: "rgb(134, 239, 172)", textDecoration: "underline" }
                  : {};
              }}
              to={"/"}
            >
              голосовой чат
            </NavLink>
          </li>
          <li className="hover:underline hover:transition-all hover:opacity-80">
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { color: "rgb(134, 239, 172)", textDecoration: "underline" }
                  : {};
              }}
              to={"/users"}
            >
              ваши разговоры
            </NavLink>
          </li>
          <li className="hover:underline hover:transition-all hover:opacity-80">
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { color: "rgb(134, 239, 172)", textDecoration: "underline" }
                  : {};
              }}
              to={"/login"}
            >
              вход
            </NavLink>
          </li>
        </ul>
        {isLoggedIn && <HeaderLogin username={username} />}
      </header>
    </>
  );
};

export default Header;
