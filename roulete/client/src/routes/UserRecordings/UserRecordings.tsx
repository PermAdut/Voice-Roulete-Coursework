import { FC, useEffect, useState } from "react";
import { getRecordings } from "../../actions/audio";
import Cookies from "js-cookie";
import config from "../../config/config.json";

const UserRecordings: FC = () => {
  const [filesArray, setFilesArray] = useState([]);

  useEffect(() => {
    if (Cookies.get("userIdState")) {
      getRecordings(Cookies.get("userIdState"), setFilesArray);
    }
  }, []);

  return (
    <>
      {
      filesArray.length > 0 ? (
        <section className="flex flex-wrap flex-col text-white items-center gap-8 w-full">
          {filesArray.map((recording:any) => (
            <div key={recording.id} className="grid grid-flow-col w-full h-[100px] items-center rounded-lg bg-cyan-500 justify-items-center gap-4 md:gap-12 lg:gap-56">
              <a
                href={`https://${config.hostname}:${config.port}/api/files/download/${recording._id}`}
                className="h-[80px] w-[80px] bg-white"
                download={recording.filename}
              ></a>
              <h2 className="text-black text-2xl">{recording.filename}</h2>

              <h4 className="text-gray-600 text-xl">{recording.length} Байт</h4>
            </div>
          ))}
        </section>
      ) : (
        <section className="flex flex-wrap flex-col text-white items-center gap-8 w-full">
        <div className="grid grid-flow-col w-full h-[100px] items-center justify-items-center rounded-lg bg-cyan-500">
          <h2 className="text-black text-2xl">Записей нет</h2>
        </div>
        </section>
      )
    }
    </>
  );
};

export default UserRecordings;
