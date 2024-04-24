interface UserInfo {
    nickName: string,
    currentNAT: string,
}


interface UsersOnlineProps{
    users: UserInfo[],
    count:number,
} 