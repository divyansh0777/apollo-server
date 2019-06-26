export default function checkAuthorization(token) {
  if (token === "token") {
    return true;
  } else {
    return false;
  }
}
