// main types
type LocalStream = MediaStream | undefined;
type LocalRecorder = MediaRecorder | undefined;


interface setInfoSocket{
    socketID?: string,
    userID?: string,
    connectedUserSocketID?: string,
    connectedUserID?: string,
    isSendingOffer?:boolean,
}

interface IMainPageLoadingProps{
    cancelLoading:() => void
}

interface CallInterfaceProps {
    getUserId: () => void;
    localStream: MediaStream | undefined;
    remoteAudioRef: React.RefObject<HTMLAudioElement>;
}

interface IConnectedMainPageProps extends CallInterfaceProps{
    terminateCall: () => void,
} 

type ConnectedMainPageProps = Omit<IConnectedMainPageProps, 'getUserId'>

interface DisconnectedMainPageProps {
    returnBack: (arg:boolean) => void,
}
