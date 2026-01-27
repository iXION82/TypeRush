import { setAccessToken } from "../auth/tokenService";

function logout() {
  setAccessToken(null);
  localStorage.removeItem("userId");
  window.location.href = "/home";
}

export default logout;