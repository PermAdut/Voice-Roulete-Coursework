export interface RegistrationProps{
    isActive:boolean,
    setActive: () => void,
}

export interface InputProps{
    value:string,
    type:string,
    placeholder:string,
    setValue:(value:string) => void
}