interface UserInfo {
    NickName:string,
    Password:string,
}

export interface LoginProps{
    isActive:boolean,
    setActive: () => void,
    callback: (nickName:string) => void,
}

export interface InputProps{
    value:string,
    type:string,
    placeholder:string,
    setValue:(value:string) => void
}