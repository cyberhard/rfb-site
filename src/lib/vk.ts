import axios from "axios";

export async function exchangeVKCode(code: string, deviceId: string) {
  const res = await axios.post("https://id.vk.com/oauth2/auth", {
    grant_type: "authorization_code",
    code,
    device_id: deviceId,
    client_id: process.env.VK_CLIENT_ID,
    client_secret: process.env.VK_CLIENT_SECRET,
  });

  return res.data;
}

export async function getVKUserInfo(accessToken: string) {
  const res = await axios.get("https://api.vk.com/method/users.get", {
    params: {
      fields: "photo_400_orig,screen_name",
      access_token: accessToken,
      v: "5.131",
    },
  });

  return res.data.response[0];
}
