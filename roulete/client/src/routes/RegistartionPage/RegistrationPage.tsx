import { RegistrationProps } from "./Registartion";
import React, { FC, useState } from "react";
import RegistrationInput from "./RegistrationInput";
import { registration } from "../../actions/user";

const RegistrationPage: FC<RegistrationProps> = ({ isActive, setActive }) => {
  const [nickName, setNickName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [repeatPass, setRepeatPass] = useState<string>('')
  return (

    <>
      <div className="w-screen flex items-center flex-col justify-center fixed h-screen  bg-fix top-0 left-0">
        <div className="flex flex-col items-center content-center text-4xl bg-cyan-500 w-1/3 rounded-3xl">
          <div className="mb-10">
            <h2>Регистрация</h2>
          </div>
          <div className="flex flex-col items-center content-center gap-8">
            <RegistrationInput type='text' value={nickName} setValue={setNickName}  placeholder="Логин" />
            <RegistrationInput type='password' value={password} setValue={setPassword}  placeholder="Пароль" />
            <RegistrationInput type='password' value={repeatPass} setValue={setRepeatPass}  placeholder="Повторите" />
            <button
              onClick={() => {registration(nickName,password, repeatPass, setActive)}} 
              className="rounded-3xl text-3xl w-[250px] mb-10 h-[40px] uppercase text-white bg-green-300 hover:transition-all hover:opacity-80"
            >
              регистрация
            </button>
          </div>
        </div>
        <a onClick={setActive} className="bg-cross w-[50px] h-[50px] bg-no-repeat bg-cover absolute top-0 cursor-pointer right-0"></a>
      </div>
    </>
  );
};

export default RegistrationPage;
