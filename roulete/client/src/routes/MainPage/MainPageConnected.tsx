import React, {useState, useEffect} from 'react';

const MainPageConnected: React.FC<ConnectedMainPageProps> = ({
  localStream,
  remoteAudioRef,
  terminateCall,
}) => {
  const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false);

  const toggleRemoteAudio = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !remoteAudioRef.current.muted;
      setIsRemoteAudioMuted(remoteAudioRef.current.muted);
    }
  };

  useEffect(() => {
    if(remoteAudioRef.current) {
      setIsRemoteAudioMuted(remoteAudioRef.current.muted);
    }
  }, [remoteAudioRef]);

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
      </div>
      <div>
      <button onClick={toggleRemoteAudio}>
          {isRemoteAudioMuted ? "Включить звук" : "Выключить звук"}
        </button>
        <br />
      </div>
    </section>
    <audio ref={remoteAudioRef} autoPlay/>
    </>
  );
};

export default MainPageConnected;
