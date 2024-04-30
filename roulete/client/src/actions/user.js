import axios from "axios";


export const registration = async (nickName, password, repeatPass) => {
  if(password !== repeatPass){
    alert('Неправильное подтверждение пароля')
  }
  else
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/registration",
      { nickName, password }
    );
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
    callback(nickName)
    alert(response);
  } catch (e) {
    alert(e);
  }
};
