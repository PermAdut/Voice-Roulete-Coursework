import React from "react";

const MainPageDisconnected: React.FC<DisconnectedMainPageProps> = ({
  returnBack
}) => {

    const handleBack = () => {
        returnBack(false)
    }

    return (
        <section className="w-full h-full flex items-center justify-center flex-col bg-cyan-500 mx-[500px] shadow-2xl shadow-black">
          <div className="text-center shadow-2xl shadow-black rounded-lg overflow-hidden max-w-md w-full">
            <div className="bg-white py-10 px-6">
              <h2 className="text-4xl font-semibold mb-4">Звонок завершен</h2>
              <p className="text-gray-600">Спасибо за использование нашего сервиса!</p>
            </div>
            <div className="p-4 hover:opacity-80 transition-opacity">
              <button
                onClick={handleBack}
                className="bg-red-300 rounded-3xl text-3xl w-[250px] h-[40px] text-white"
              >
                Вернуться назад
              </button>
            </div>
          </div>
        </section>
      );
};

export default MainPageDisconnected;
