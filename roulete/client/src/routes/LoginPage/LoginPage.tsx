import { FC, useEffect, useState } from "react";
import { LoginProps } from "./LoginPage";
import LoginAsk from "./LoginAsk";
import Cookies from "js-cookie";
import LoginSuccess from "./LoginSuccess";

const LoginPage: FC<LoginProps> = ({ isActive, setActive, callback }) => {
  const [nickName, setNickName] = useState<string>('')
  let isLogged = false;
  
  useEffect(() => {
    const savedState = Cookies.get("loginState");
    if (savedState) {isLogged = true;
      setNickName(JSON.parse(savedState))
    }
  }, []);

  return (
    <>
      <section className="w-full flex h-full flex-col items-center content-center pt-10 text-4xl mx-[500px] bg-cyan-500">
        {!isLogged ? <LoginAsk
          isActive={isActive}
          setActive={setActive}
          callback={callback}
        /> : <LoginSuccess nickName={nickName} />} 
      </section>
    </>
  );
};

export default LoginPage;
