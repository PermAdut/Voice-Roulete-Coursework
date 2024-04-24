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

function App() {

  const [isActive, setModalActive] = useState(false)

  const setActiveHandler = ():void => {
    setModalActive(!isActive)
  }

  return (
    <>
      <Header />
      <main className="px-5 sm:px-7 sm:py-8 py-20 bg-main bg-no-repeat bg-cover flex flex-grow">
        <Routes>
          <Route path="*" element={<Page404 />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/users" element={<UsersOnline />} />
          <Route path="/login" element={<LoginPage isActive={isActive} setActive={setActiveHandler}/>} />
        </Routes>
        {isActive ? <RegistrationPage isActive={isActive} setActive={setActiveHandler} /> : ""}
      </main>
      <Footer />
    </>
  );
}

export default App;
