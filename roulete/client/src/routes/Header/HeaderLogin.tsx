import React from "react";

export default function HeaderLogin(props: { nickName: string, setNickName:(arg:string)=>void }) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="bg-avatar w-[50px] h-[50px] bg-cover rounded-3xl  mb-1"></div>
          <p className="font-normal text-cyan-400">{props.nickName}</p>
        </div>
        <button onClick={()=>{props.setNickName('')}} className="bg-inherit w-[50px] h-[25px] text-red-500 ml-36">
          Выйти
        </button>
      </div>
    </>
  );
}
