import {useState, FC} from "react";
import LoginInput from "./LoginInput";
import { LoginProps } from "./LoginPage";
import { login } from "../../actions/user";

const LoginAsk: FC<LoginProps> = ({ isActive, setActive, handleLogin }) => {
    const [nickName, setNickName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
  return (
    <>
      <div className="mb-10 mt-10">
        <h2>Аутентификация</h2>
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
        <button
          onClick={() => login(nickName, password, handleLogin)}
          className="rounded-3xl text-3xl w-[250px] h-[40px] uppercase text-white bg-green-300 hover:transition-all hover:opacity-80"
        >
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
    </>
  );
}

export default LoginAsk
