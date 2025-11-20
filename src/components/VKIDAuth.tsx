'use client';

import { useEffect } from 'react';
import * as VKID from '@vkid/sdk';

async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  return await window.crypto.subtle.digest("SHA-256", msgBuffer);
}

function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomString(len = 64) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let str = "";
  const array = new Uint8Array(len);
  crypto.getRandomValues(array);
  for (let i = 0; i < len; i++) str += chars[array[i] % chars.length];
  return str;
}

export default function VKIDAuth() {
  useEffect(() => {
    (async () => {
      const state = randomString(16);
      const codeVerifier = randomString(64);

      const hash = await sha256(codeVerifier);
      const codeChallenge = base64UrlEncode(hash);

      sessionStorage.setItem("vkid_state", state);
      sessionStorage.setItem("vkid_code_verifier", codeVerifier);

      VKID.Config.init({
        app: 54294764,
        redirectUrl: "https://rusfurbal.ru/api/auth/callback/vk",
        state,
        codeChallenge,
        scope: "vkid.personal_info",
      });

      const result = await VKID.Auth.login();

      if (!result) return;

      const verifier = sessionStorage.getItem("vkid_code_verifier") || "";

      // Переходим на backend callback
      window.location.href =
        `/api/auth/callback/vk?code=${result.code}` +
        `&device_id=${result.device_id}` +
        `&state=${result.state}` +
        `&verifier=${verifier}`;
    })();
  }, []);

  return null;
}
