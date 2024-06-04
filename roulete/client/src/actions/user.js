import axios from "axios";
import Cookies from "js-cookie";
import config from "../config/config.json"

export const registration = async (
  nickName,
  password,
  repeatPass,
  callback
) => {
  if (password !== repeatPass) {
    alert("Неправильное подтверждение пароля");
  } else
    try {
      const response = await axios.post(
        `https://${config.hostname}:${config.port}/api/auth/registration`,

        { nickName, password }
      );
      callback();
      alert(response.data.message);
    } catch (e) {
      alert(e);
    }
};

export const login = async (nickName, password, callback) => {
  try {
    const response = await axios.post(
      `https://${config.hostname}:${config.port}/api/auth/login`,
      {
        nickName,
        password,
      }
    );
    const id = response.data.user.id;
    Cookies.set("userIdState", JSON.stringify(id), { expires: 7 });
    Cookies.set("loginState", JSON.stringify(nickName), { expires: 7 });
    callback();
  } catch (e) {
    alert(e);
  }
};
