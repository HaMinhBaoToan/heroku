export default function authHeader(accessToken) {
  if (accessToken) {
    return { "x-access-token": accessToken };
  } else {
    return {};
  }
}
