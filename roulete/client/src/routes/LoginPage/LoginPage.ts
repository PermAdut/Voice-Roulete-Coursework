interface UserInfo {
    NickName:string,
    Password:string,
}

export interface LoginProps{
    isActive:boolean,
    setActive: () => void,
    isLoggedIn?:boolean,
    username:string,
    handleLogin:() => void,
    handleLogout:() => void,
}

export interface InputProps{
    value:string,
    type:string,
    placeholder:string,
    setValue:(value:string) => void
}