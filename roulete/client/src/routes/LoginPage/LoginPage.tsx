import { FC, useState } from "react";
import LoginInput from "./LoginInput";
import { login } from "../../actions/user";
import { LoginProps } from "./LoginPage";

const LoginPage: FC<LoginProps> = ({ isActive, setActive, callback }) => {
  const [nickName, setNickName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <>
      <section className="w-full flex h-full flex-col items-center content-center pt-10 text-4xl mx-[500px] bg-cyan-500">
        <div className="mb-10">
          <h2>Авторизация</h2>
        </div>
        <div className="flex flex-col items-center content-center gap-8">
          <LoginInput
            type="text"
            value={nickName}
            setValue={setNickName}
            placeholder="Логин"
          />
          <LoginInput
            type="password"
            value={password}
            setValue={setPassword}
            placeholder="Пароль"
          />
          <button onClick={ () => login(nickName,password,callback)}
           className="rounded-3xl text-3xl w-[250px] h-[40px] uppercase text-white bg-green-300 hover:transition-all hover:opacity-80">
            войти
          </button>
        </div>
        <div className="text-xs">
          Нет аккаунта?{" "}
          <a
            onClick={setActive}
            className="cursor-pointer hover:transition-all hover:opacity-80"
          >
            Регистрация
          </a>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
