export interface LoginProps{
    isActive:boolean,
    setActive: () => void,
    isLoggedIn?:boolean,
    username:string | undefined,
    handleLogin:() => void,
    handleLogout:() => void,
}

export interface InputProps{
    value:string,
    type:string,
    placeholder:string,
    setValue:(value:string) => void
}