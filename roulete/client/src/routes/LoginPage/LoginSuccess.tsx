import Cookies from "js-cookie";

export default function LoginSuccess(props: {
  nickName: string | undefined;
  handleLogout: () => void;
}) {
  const exitClickHandler = () => {
    Cookies.remove("userIdState");
    Cookies.remove("loginState");
    props.handleLogout();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-inherit">
      <div className="max-w-md w-full mx-auto rounded-lg border border-gray-200 shadow-md p-6">
        <div className="flex mb-4">
          <div className="bg-avatar w-24 h-24 bg-cover bg-center rounded-full border-2 border-gray-300"></div>
          <div className="ml-4">
            <h3 className="text-2xl text-gray-700 mt-2">Логин: {props.nickName}</h3>
            <button
              onClick={exitClickHandler}
              className="mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md focus:outline-none"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}