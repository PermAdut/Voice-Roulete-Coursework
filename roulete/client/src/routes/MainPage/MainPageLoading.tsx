import "./MainPageLoading.css";

export default function MainPageLoading(props: IMainPageLoadingProps) {
  return (
    <section className="w-full h-full flex content-center items-center flex-col bg-cyan-500 mx-[500px] shadow-2xl shadow-black">
      <div className="flex flex-grow content-center items-center min-h-[200px] min-w-[200px] max-h-[200px] max-w-[200px] mb-36 mt-10">
        <div className="spin-wrapper">
          <div className="spinner"></div>
        </div>
      </div>
      <div className="flex pb-10 hover:transition-all hover:opacity-80 flex-col items-center justify-center">
        <h2 className="text-3xl">Идет поиск собеседника...</h2>
        <button
          onClick={props.cancelLoading}
          className="bg-red-300 rounded-3xl text-3xl w-[250px] h-[40px] mb-5 mt-40 text-white"
        >
          Отменить поиск
        </button>
      </div>
    </section>
  );
}
