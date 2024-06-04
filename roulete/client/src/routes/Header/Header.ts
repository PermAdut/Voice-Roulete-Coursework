export interface HeaderProps extends HeaderLoginProps {
    isLoggedIn:boolean,
}

export interface HeaderLoginProps {
    username:string | undefined
} 