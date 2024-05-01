import React from "react";
import io from "socket.io-client"
const socket = io("http://localhost:5000")
import { useEffect, useState } from "react";





export default function MainPage() {

  const [stream, setStream] = useState<MediaStream>();

  async function getMedia(constrains : MediaStreamConstraints){
    try{
      const mediaStream = await navigator.mediaDevices.getUserMedia(constrains);
      setStream(mediaStream)
      handleMedia(mediaStream)
    } 
    catch (err){
      console.log(err)
      alert('Не удалось получить доступ к микрофону')
    }
  }

  function handleMedia(stream:MediaStream){
    const mediaRecorder = new MediaRecorder(stream)
    const timeSlice = 1000
    mediaRecorder.start(timeSlice)
  
    mediaRecorder.ondataavailable = function(event) {
      if(event.data.size > 0){
        socket.emit('audioMessage', event.data)
      }
    }
  }

  useEffect(() => {
    socket.on('audioMessage', (audioData) => {
      console.log(audioData)
      const audioBlob = new Blob([audioData], {type: 'audio/mpeg'});
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio();
      audio.src = audioUrl;
      const playPromise = audio.play();
    
      if(playPromise != undefined){
        playPromise.then(_ => {
          console.log('132')
        }).catch(err => {
          alert('Запрещено пользователем')
        })
      }

    });

    return () => {
      socket.off('audioMessage');
    };
  },[])

  return (
    <>
      <section className="w-full h-full flex content-center items-center flex-col bg-cyan-500 mx-[500px] shadow-2xl shadow-black">
        <div className="flex flex-grow content-center items-center min-h-[200px] min-w-[200px] max-h-[200px] max-w-[200px]  mt-10">
          <div className="w-full h-full flex content-center  bg-anon bg-cover bg-no-repeat rounded-3xl "></div>
        </div>
        <div className="flex pb-10 hover:transition-all hover:opacity-80 flex-col items-center justify-center">
          <button onClick={ () => {getMedia({audio:true})}} className="bg-green-300 rounded-3xl text-3xl w-[250px] h-[40px] mb-5 mt-80 text-white">
            Начать поиск
          </button>
          <p className="text-1xl">Количество пользователей онлайн:</p>
        </div>
      </section>
    </>
  );
}


