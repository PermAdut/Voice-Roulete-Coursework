import { Route, Routes } from "react-router-dom";
import "./App.css";
import Page404 from "./routes/Page404/Page404.tsx";
import MainPage from "./routes/MainPage/MainPage.tsx";
import Footer from "./routes/Footer/Footer.tsx";
import Header from "./routes/Header/Header.tsx";
import LoginPage from "./routes/LoginPage/LoginPage.tsx";
import RegistrationPage from "./routes/RegistartionPage/RegistrationPage.tsx";
import { useState } from "react";
import UsersOnline from "./routes/UsersOnline/UsersOnline.tsx";
import Cookies from "js-cookie";

function App() {
  const [userLoginState, setUserLoginState] = useState({
    isLoggedIn: false,
    username: Cookies.get('loginState') ? JSON.parse(Cookies.get('loginState') as string) : undefined,
  });

  const [isActive, setModalActive] = useState(false);

  const setActiveHandler = (): void => {
    setModalActive(!isActive);
  };

  const handleLogin = () => {
    let username;
    if(Cookies.get('loginState') != undefined)
      username = JSON.parse(Cookies.get("loginState") as string);
    else
      username = ''
    setUserLoginState({
      isLoggedIn: true,
      username: username,
    });
  };

  const handleLogout = () => {
    Cookies.remove("userIdState");
    Cookies.remove("loginState");
    setUserLoginState({
      isLoggedIn: false,
      username: "",
    });
  };

  return (
    <>
      <Header
        isLoggedIn={userLoginState.isLoggedIn}
        username={userLoginState.username}
        handleLogout={handleLogout}
      />
      <main className="px-5 sm:px-7 sm:py-8 py-20 bg-main bg-no-repeat bg-cover flex flex-grow">
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/users" element={<UsersOnline />} />
          <Route
            path="/login"
            element={
              <LoginPage
                isActive={isActive}
                setActive={setActiveHandler}
                isLoggedIn={userLoginState.isLoggedIn}
                username={userLoginState.username}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
              />
            }
          />
        </Routes>
        {isActive ? (
          <RegistrationPage isActive={isActive} setActive={setActiveHandler} />
        ) : (
          ""
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
