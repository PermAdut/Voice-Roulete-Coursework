import React from "react";
import Cookies from "js-cookie";

export default function HeaderLogin(props:{username:string, handleLogout:() => void}) {

  const exitClickHandler = () => {
    Cookies.remove('userIdState');
    Cookies.remove('loginState')
    props.handleLogout()
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="bg-avatar w-[50px] h-[50px] bg-cover rounded-3xl  mb-1"></div>
          <p className="font-normal text-cyan-400">{props.username}</p>
        </div>
        <button onClick={exitClickHandler} className="bg-inherit w-[50px] h-[25px] text-red-500 ml-36">
          Выйти
        </button>
      </div>
    </>
  );
}
