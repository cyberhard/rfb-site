'use client'

import { useEffect, useRef } from "react"
import * as VKID from "@vkid/sdk"

// SHA-256 → S256
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message)
  return await window.crypto.subtle.digest("SHA-256", msgBuffer)
}

function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function generateRandomString(length = 64) {
  const array = new Uint8Array(length)
  window.crypto.getRandomValues(array)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
  let str = ""
  for (let i = 0; i < length; i++) {
    str += chars[array[i] % chars.length]
  }
  return str
}

export default function VKIDAuth() {
  const floatingRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    async function setup() {
      const state = generateRandomString(16)
      const codeVerifier = generateRandomString(64)

      const hashed = await sha256(codeVerifier)
      const codeChallenge = base64UrlEncode(hashed)

      sessionStorage.setItem("vkid_code_verifier", codeVerifier)
      sessionStorage.setItem("vkid_state", state)

      // ИНИЦИАЛИЗАЦИЯ VK ID
      VKID.Config.init({
        app: 54294764,
        redirectUrl: "https://rusfurbal.ru/api/auth/callback/vk",
        responseMode: "callback", // ВАЖНО
        state,
        codeChallenge,
        scope: "",
      })

      const floatingOneTap = new VKID.FloatingOneTap()
      floatingRef.current = floatingOneTap

      // 👉 правильный обработчик успеха
      floatingOneTap.on("auth", ({ code, device_id, state }) => {
        const verifier = sessionStorage.getItem("vkid_code_verifier") ?? ""

        // Переброс на наш backend
        window.location.href =
          `/api/auth/callback/vk?` +
          new URLSearchParams({
            code,
            device_id,
            state,
            verifier,
          }).toString()
      })

      if (!mounted) return

      floatingOneTap.render({
        scheme: "dark",
        contentId: 2,
        appName: "RusFurBal",
        showAlternativeLogin: true,
        indent: { top: 108, right: 44, bottom: 38 },
      })
    }

    setup()

    return () => {
      mounted = false
      floatingRef.current?.close?.()
    }
  }, [])

  return null
}
