export async function exchangeVKCode(code: string, deviceId: string) {
  const res = await fetch("https://id.vk.com/oauth2/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      device_id: deviceId,
      client_id: process.env.VK_CLIENT_ID,
      client_secret: process.env.VK_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`VK exchange error: ${res.status} ${text}`);
  }

  return await res.json();
}

export async function getVKUserInfo(accessToken: string) {
  const url = new URL("https://api.vk.com/method/users.get");
  url.searchParams.set("fields", "photo_400_orig,screen_name");
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("v", "5.131");

  const res = await fetch(url.toString(), {
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`VK user info error: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.response[0];
}
