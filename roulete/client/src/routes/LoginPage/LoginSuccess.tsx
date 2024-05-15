import Cookies from "js-cookie";
export default function LoginSuccess(props: {
  nickName: string;
  handleLogout: () => void;
}) {
  const exitClickHandler = () => {
    Cookies.remove("userIdState");
    Cookies.remove("loginState");
    props.handleLogout();
  };

  return (
    <>
      <div className="mb-10 mt-10 w-full h-full flex">
        <div className="bg-avatar w-[150px] h-[150px] bg-cover bg-no-repeat rounded-3xl ml-5"></div>
        <div className="flex flex-col content-center">
          <h3 className="text-4xl text-white">Логин: {props.nickName}</h3>
          <button
            onClick={exitClickHandler}
            className="bg-inherit w-[50px] h-[25px] text-red-500 ml-36"
          >
            Выйти
          </button>
        </div>
      </div>
    </>
  );
}
