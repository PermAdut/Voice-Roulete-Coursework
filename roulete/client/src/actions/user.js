import axios from "axios";

export const registration = async (nickName, password) => {
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
