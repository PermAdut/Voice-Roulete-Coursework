import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

const socket = io("https://192.168.0.114:5000");
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function MainPage() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [infoSocket, setInfoSocket] = useState<setInfoSocket>();
  const [peerConnection, setPeerconnction] = useState<RTCPeerConnection>(
    new RTCPeerConnection(configuration)
  );

  const localStreamRef = useRef<MediaStream>();
  const infoSocketRef = useRef<setInfoSocket>();

  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    peerConnection.ontrack = (event) => {
      console.log("123");
      if (event.streams && event.streams[0]) {
        remoteAudioRef.current!.srcObject = event.streams[0];
      }
    };

    socket.on("connection", (data) => {
      setInfoSocket((prevState) => {
        return {
          ...prevState,
          connectedUserID: data.userID,
          connectedUserSocketID: data.socketID,
          isSendingOffer: data.isSendingOffer,
        };
      });
      infoSocketRef.current = {
        ...infoSocketRef.current,
        connectedUserID: data.userID,
        connectedUserSocketID: data.socketID,
        isSendingOffer: data.isSendingOffer,
      };
    });

    socket.on("candidate", (data) => {
      peerConnection
        .addIceCandidate(data.candidate)
        .then(() => {
          console.log("added Candidate", data.candidate, "from ", data.sender);
        })
        .catch((error) => console.log("Ошибка установки ICE кандидата", error));
    });

    socket.on("answer", async (data) => {
      const answer = new RTCSessionDescription({
        type: data.type,
        sdp: data.sdp,
      });

      try {
        await peerConnection.setRemoteDescription(answer);
        console.log("Удаленное описание ответа установлено успешно.");
      } catch (error) {
        console.error(
          "Ошибка при установке удаленного описания ответа:",
          error
        );
      }
    });

    socket.on("offer", async (data) => {
      const offer = new RTCSessionDescription({
        type: data.type,
        sdp: data.sdp,
      });

      try {
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.emit("answer", {
          type: "answer",
          sdp: peerConnection.localDescription?.sdp,
          infoSocket: infoSocketRef.current,
        });
      } catch (error) {
        console.error(
          "Ошибка при установке удаленного описания предложения:",
          error
        );
      }
    });

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      socket.off("connection");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, []);

  const getUserId = () => {
    const id = Cookies.get("userIdState");
    if (id === undefined) {
      alert("Сначала войдите в аккаунт");
      return;
    }
    socket.emit("auth", id); // auth send to server
    setInfoSocket((prevState) => {
      return { ...prevState, socketID: socket.id, userID: id };
    });
    infoSocketRef.current = {
      ...infoSocketRef.current,
      socketID: socket.id,
      userID: id,
    };
    getMedia(id);
  };

  // Запрашиваем доступ к микрофону при монтировании компонента
  const getMedia = async (id: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
    } catch (err) {
      console.error("Не удалось получить доступ к микрофону", err);
    }
  };

  useEffect(() => {
    if (infoSocket?.userID) {
      getMedia(infoSocket.userID);
    }
  }, [infoSocket?.userID]);

  useEffect(() => {
    if (localStream && !localStreamRef.current) {
      startCall(localStream);
      localStreamRef.current = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (infoSocket?.isSendingOffer) {
      createOffer();
    }
    sendIceCandidates();
  }, [infoSocket?.connectedUserID]);

  // Функция для старта WebRTC соединения
  const startCall = async (stream: MediaStream) => {
    const offer = await peerConnection.createOffer();
    socket.emit("searchForAUser", infoSocket?.userID);

    // Добавляем треки в peerConnection
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });
  };

  const createOffer = async () => {
    const offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer).then(() => {
      socket.emit("offer", {
        type: "offer",
        sdp: peerConnection.localDescription?.sdp,
        infoSocket: infoSocketRef.current,
      });
    });
  };

  const sendIceCandidates = async () => {
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("allmycandidates", event.candidate);
        socket.emit("candidate", {
          candidate: event.candidate,
          target: infoSocketRef.current?.connectedUserSocketID,
        });
      }
    };
  };

  return (
    <>
      <section className="w-full h-full flex content-center items-center flex-col bg-cyan-500 mx-[500px] shadow-2xl shadow-black">
        <div className="flex flex-grow content-center items-center min-h-[200px] min-w-[200px] max-h-[200px] max-w-[200px]  mt-10">
          <div className="w-full h-full flex content-center  bg-anon bg-cover bg-no-repeat rounded-3xl "></div>
        </div>
        <div className="flex pb-10 hover:transition-all hover:opacity-80 flex-col items-center justify-center">
          <button
            onClick={() => {
              getUserId();
            }}
            className="bg-green-300 rounded-3xl text-3xl w-[250px] h-[40px] mb-5 mt-80 text-white"
          >
            Начать поиск
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
}
