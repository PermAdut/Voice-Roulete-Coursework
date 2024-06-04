import io from "socket.io-client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import MainPageLoading from "./MainPageLoading";
import MainPageConnected from "./MainPageConnected";
import MainPageDefault from "./MainPageDefault";
import MainPageDisconnected from "./MainPageDisconnected";
import config from "../../config/config.json"

const socket = io(`https://${config.hostname}:${config.port}`);
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function MainPage() {
  const [localStream, setLocalStream] = useState<LocalStream>();
  const [infoSocket, setInfoSocket] = useState<setInfoSocket>();
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>(
    new RTCPeerConnection(configuration)
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isDisconnected, setDisconnected] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<LocalRecorder>(undefined);
  const [recordedChunks, setRecordedChunks] = useState<Blob>();

  const localStreamRef = useRef<LocalStream>(undefined);
  const infoSocketRef = useRef<setInfoSocket>();
  const infoSocketRefPrev = useRef<setInfoSocket>();
  const loadingRef = useRef<boolean>();
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<LocalRecorder>(undefined);
  const recordedChunksRef = useRef<Blob>();

  useEffect(() => {
    peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        remoteAudioRef.current!.srcObject = event.streams[0];
      }
    };

    socket.on("connection", (data) => {
      console.log(localStreamRef.current);
      setLoading(false);
      startRecording(localStreamRef.current);
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
        console.log(`emit answer to ${infoSocketRef.current}`);
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
      infoSocketRefPrev.current = infoSocketRef.current;
      stopRecording().then(async (audioBlob) => {
        const formData = new FormData();
        console.log(audioBlob);
        formData.append(
          "audioFile",
          audioBlob,
          `Conv${infoSocketRefPrev.current?.userID}and${infoSocketRefPrev.current?.connectedUserID}`
        );
        formData.append(
          "userId",
          infoSocketRefPrev.current?.userID as string,
        )
        formData.forEach((el) => {
          console.log(el);
        });
        try {
          const response = await axios.post(
            `https://${config.hostname}:${config.port}/api/files/upload_recording`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(response.status);
        } catch (err) {
          console.error(err);
        }
      });
      setInfoSocket({});
      infoSocketRef.current = {};
      setLocalStream(undefined);
      localStreamRef.current = undefined;
      setDisconnected(true);
      mediaRecorder?.stop();
    });

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      mediaRecorder?.stop();
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

  const getMedia = async (id: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setLoading(true);
      setLocalStream(stream);
    } catch (err) {
      setLoading(false);
      loadingRef.current = false;
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
        console.log("track");
        peerConnection.addTrack(track, stream);
      });
    } catch (error) {
      console.error("Ошибка создания или установки предложения.", error);
      setLoading(false);
      loadingRef.current = false;
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
        socket.emit("candidate", {
          candidate: event.candidate,
          target: infoSocketRef.current?.connectedUserSocketID,
        });
      }
    };
  };

  const startRecording = (stream: LocalStream) => {
    if (stream) {
      const mediaRecorderInstance = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorderInstance;

      mediaRecorderInstance.ondataavailable = (event) => {
        console.log(event.data.size, event.data);
        if (event.data.size > 0) {
          setRecordedChunks(event.data);
          recordedChunksRef.current = event.data;
          console.log("here");
        }
      };

      mediaRecorderInstance.start();
      setMediaRecorder(mediaRecorderInstance);
      console.log("Recording started");
    }
  };

  const stopRecording = () => {
    return new Promise<Blob>((resolve, reject) => {
      console.log(infoSocketRef.current);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current!.onstop = () => {
          console.log(recordedChunksRef.current);
          recordedChunksRef.current
            ? resolve(recordedChunksRef.current)
            : reject("empty recording");
        };
        mediaRecorderRef.current!.stop();
        console.log("Recording stopped");
      }
    });
  };

  const cancelLoading = () => {
    setLoading(false);
    loadingRef.current = false;
    socket.emit("endCall", infoSocketRef.current);
  };

  const terminateCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(undefined);
      localStreamRef.current = undefined;
    }
    if (peerConnection) {
      peerConnection.setLocalDescription(undefined);
    }
    setLoading(false);
    loadingRef.current = false;
    socket.emit("endCall", infoSocketRef.current);
    setDisconnected(true);
  };

  return (
    <>
      {isDisconnected ? (
        <MainPageDisconnected returnBack={setDisconnected} />
      ) : loadingRef.current ? (
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
