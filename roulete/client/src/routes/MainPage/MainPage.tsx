
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import MainPageLoading from "./MainPageLoading";
import MainPageConnected from "./MainPageConnected";
import MainPageDefault from "./MainPageDefault";

const socket = io("http://localhost:5000");
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function MainPage() {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>();
  const [infoSocket, setInfoSocket] = useState<setInfoSocket>();
  const [peerConnection, setPeerconnction] = useState<RTCPeerConnection>(
    new RTCPeerConnection(configuration)
  );
  const [isLoading, setLoading] = useState<boolean>(false);

  const localStreamRef = useRef<MediaStream | undefined>(undefined);
  const infoSocketRef = useRef<setInfoSocket>();
  const loadingRef = useRef<boolean>();
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        remoteAudioRef.current!.srcObject = event.streams[0];
      }
    };

    socket.on("connection", (data) => {
      setLoading(false);
      loadingRef.current = false;
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
        setLoading(false);
        loadingRef.current = false;
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
        setLoading(false);
        loadingRef.current = false;
        console.error(
          "Ошибка при установке удаленного описания предложения:",
          error
        );
      }
    });

    socket.on("endCall", () => {
      console.log("disconnect");
      setInfoSocket({});
      infoSocketRef.current = {};
      console.log(infoSocketRef.current)
      setLocalStream(undefined)
      localStreamRef.current = undefined
    });

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      socket.off("connection");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
      socket.off("endCall");
    };
  }, []);

  const getUserId = () => {
    const id = Cookies.get("userIdState");
    if (id === undefined) {
      alert("Сначала войдите в аккаунт");
      return;
    }
    setLoading(true);
    loadingRef.current = true;
    socket.emit("auth", id);
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
      setLoading(false);
      loadingRef.current = false
      console.error("Не удалось получить доступ к микрофону", err);
    }
  };

  useEffect(() => {
    if (infoSocket?.userID) {
      getMedia(infoSocket.userID);
    }
  }, [infoSocket?.userID]);

  useEffect(() => {
    if (localStream && localStreamRef.current === undefined) {
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

  const startCall = async (stream: MediaStream) => {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("searchForAUser", infoSocket?.userID);

      // Добавляем треки в peerConnection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });
    } catch (error) {
      console.error("Ошибка создания или установки предложения.", error);
      setLoading(false);
      loadingRef.current = false
    }
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

  const cancelLoading = () => {
    setLoading(false);
    loadingRef.current = false
    socket.emit("endCall", infoSocketRef.current);
  };

  const terminateCall = () => {
    loadingRef.current = false
    socket.emit("endCall", infoSocketRef.current);
  }

  return (
    <>
      {loadingRef.current ? (
        <MainPageLoading cancelLoading={cancelLoading} />
      ) : infoSocket?.connectedUserID ? (
        <MainPageConnected
          localStream={localStream}
          remoteAudioRef={remoteAudioRef}
          terminateCall={terminateCall}
        />
      ) : (
        <MainPageDefault
          getUserId={getUserId}
          localStream={localStream}
          remoteAudioRef={remoteAudioRef}
        />
      )}
    </>
  );
}
