import React from "react";

export default function MainPage() {
  return (
    <>
      <section className="w-full h-full flex content-center items-center flex-col bg-cyan-500 mx-[500px] shadow-2xl shadow-black">
        <div className="flex flex-grow content-center items-center min-h-[200px] min-w-[200px] max-h-[200px] max-w-[200px]  mt-10">
          <div className="w-full h-full flex content-center  bg-anon bg-cover bg-no-repeat rounded-3xl "></div>
        </div>
        <div className="flex pb-10 hover:transition-all hover:opacity-80 flex-col items-center justify-center">
          <button className="bg-green-300 rounded-3xl text-3xl w-[200px] h-[40px] mb-5 mt-80">
            Начать поиск
          </button>
          <p className="text-1xl">Количество пользователей онлайн:</p>
        </div>
      </section>
    </>
  );
}
