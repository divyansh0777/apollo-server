export function CheckAuthorization(token) {
  if(token === 'token') {
    return true;
  } else {
    return false;
  }
}
