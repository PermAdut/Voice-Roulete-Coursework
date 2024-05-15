import React from 'react';

const MainPageConnected: React.FC<ConnectedMainPageProps> = ({
  localStream,
  remoteAudioRef,
  terminateCall,
}) => {
  return (
    <>
    <section className="w-full h-full flex content-center items-center flex-col bg-cyan-500 mx-[500px] shadow-2xl shadow-black">
      <div className="flex flex-grow content-center items-center min-h-[200px] min-w-[200px] max-h-[200px] max-w-[200px]  mt-10">
        <div className="w-full h-full flex content-center  bg-anon bg-cover bg-no-repeat rounded-3xl "></div>
      </div>
      <div className="flex pb-10 hover:transition-all hover:opacity-80 flex-col items-center justify-center">
        <button
          onClick={() => {
            terminateCall();
          }}
          className="bg-red-300 rounded-3xl text-3xl w-[250px] h-[40px] mb-5 mt-80 text-white"
        >
          Отключиться
        </button>
        <p className="text-1xl">Количество пользователей онлайн:</p>
      </div>
      <div>
        {/* Кнопка для отключения звука */}
        <button
          onClick={() =>
            (remoteAudioRef.current!.muted = !remoteAudioRef.current!.muted)
          }
        >
          {remoteAudioRef.current && remoteAudioRef.current.muted
            ? "Включить звук"
            : "Выключить звук"}
        </button>
        {/* Кнопка для отключения микрофона */}
        <button
          onClick={() => {
            localStream
              ?.getAudioTracks()
              .forEach((track) => (track.enabled = !track.enabled));
          }}
        >
          {localStream &&
          localStream.getAudioTracks().every((track) => !track.enabled)
            ? "Включить микрофон"
            : "Выключить микрофон"}
        </button>
      </div>
    </section>
    <audio ref={remoteAudioRef} autoPlay />
    </>
  );
};

export default MainPageConnected;
