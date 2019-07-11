export default function CheckAuthorization(token) {
  if(token) {
    return true;
  }
  return false
}
