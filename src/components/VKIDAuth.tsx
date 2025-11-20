'use client';

import { useEffect, useRef } from 'react';
import * as VKID from '@vkid/sdk';

// Утилиты для PKCE (S256)
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  return await window.crypto.subtle.digest('SHA-256', msgBuffer);
}

function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function generateRandomString(length = 64) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars[array[i] % chars.length];
  }
  return str;
}

export default function VKIDAuth() {
  const floatingRef = useRef<any | null>(null);

  useEffect(() => {
    let mounted = true;

    async function setup() {
      const state = generateRandomString(16);
      const codeVerifier = generateRandomString(64);

      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64UrlEncode(hashed);

      try {
        sessionStorage.setItem('vkid_code_verifier', codeVerifier);
        sessionStorage.setItem('vkid_state', state);
      } catch (e) {
        // ignore
      }

      VKID.Config.init({
        app: 54294764,
        redirectUrl: 'https://rusfurbal.ru/api/auth/callback/vk',
        state,
        codeChallenge,
        scope: '',
      });

      const floatingOneTap = new VKID.FloatingOneTap();
      floatingRef.current = floatingOneTap;
      if (!mounted) return;

      floatingOneTap.render({
        scheme: 'dark',
        contentId: 2,
        appName: 'RusFurBal',
        showAlternativeLogin: true,
        indent: { top: 108, right: 44, bottom: 38 },
      });
    }

    setup();

    return () => {
      mounted = false;
      if (floatingRef.current && typeof floatingRef.current.close === 'function') {
        try {
          floatingRef.current.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  return null;
}