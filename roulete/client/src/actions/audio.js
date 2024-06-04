import axios from "axios";
import config from "../config/config.json"


export const getRecordings = async(
    userId,
    callback
) => {
    try{
        const response = await axios.get(`https://${config.hostname}:${config.port}/api/files/get_recordings/${userId}`)
        console.log(response.data)
        callback(response.data)
    } catch(e){
        alert(e)
    }
}