import { FC, useRef, useState, useEffect } from "react";
import { LoginProps } from "./LoginPage";
import LoginAsk from "./LoginAsk";
import Cookies from "js-cookie";
import LoginSuccess from "./LoginSuccess";

const LoginPage: FC<LoginProps> = ({
  isActive,
  setActive,
  isLoggedIn,
  username,
  handleLogin,
  handleLogout
}) => {

  return (
    <>
      <section className="w-full flex h-full flex-col items-center content-center pt-10 text-4xl mx-[500px] bg-cyan-500">
        {isLoggedIn ? (
          <LoginSuccess nickName={username} handleLogout={handleLogout}/>
        ) : (
          <LoginAsk
            isActive={isActive}
            setActive={setActive}
            username={username}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />
        )}
      </section>
    </>
  );
};

export default LoginPage;
