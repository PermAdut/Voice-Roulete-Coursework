import axios from "axios";
import Cookies from "js-cookie";

export const registration = async (nickName, password, repeatPass, callback) => {
  if(password !== repeatPass){
    alert('Неправильное подтверждение пароля')
  }
  else
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/registration",
      { nickName, password }
    );
    callback()
    alert(response.data.message);
  } catch (e) {
    alert(e);
  }
};



export const login = async (nickName, password, callback) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      { nickName, password }
    );
    Cookies.set('loginState', JSON.stringify(nickName), {expires:7})
    callback(nickName)
  } catch (e) {
    alert(e);
  }
};
