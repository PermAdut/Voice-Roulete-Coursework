import { HeaderLoginProps } from "./Header";
export default function HeaderLogin({ username }: HeaderLoginProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="bg-avatar w-[50px] h-[50px] bg-cover rounded-3xl mb-1"></div>
          <p className="font-normal text-cyan-400">{username}</p>
        </div>
      </div>
    </>
  );
}
