import { Route, Routes } from "react-router-dom";
import "./App.css"
import Page404 from "./routes/Page404/Page404.tsx";
import MainPage from "./routes/MainPage/MainPage.tsx";


function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="*" element={<Page404 />} />
        <Route path="/" element={<MainPage />}/>
      </Routes>
    </div>
  );
}

export default App;
