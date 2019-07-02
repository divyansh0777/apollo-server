export default function CheckAuthorization(token) {
  if(token) {
    return true;
  } else {
    return false;
  }
}
