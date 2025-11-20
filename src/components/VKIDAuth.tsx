'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    VKIDSDK: any;
  }
}

interface VKIDAuthProps {
  scheme?: 'light' | 'dark';
  showAlternativeLogin?: boolean;
}

export default function VKIDAuth({ 
  scheme = 'dark',
  showAlternativeLogin = true 
}: VKIDAuthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const oneTapRef = useRef<any>(null);
  const { login } = useAuth();

  useEffect(() => {
    const loadScript = () => {
      return new Promise((resolve, reject) => {
        if (window.VKIDSDK) return resolve(true);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load VKID SDK'));
        document.head.appendChild(script);
      });
    };

    const vkidOnSuccess = async (payload: any) => {
      try {
        const accessToken = payload.access_token;
        if (!accessToken) throw new Error('No access token');

        // 1️⃣ Получаем инфу о пользователе напрямую с VK
        const res = await fetch(
          `https://api.vk.com/method/account.getProfileInfo?access_token=${accessToken}&v=5.131`
        );
        const data = await res.json();
        if (!data.response) throw new Error('Invalid VK response');

        const vkUser = data.response;

        // 2️⃣ Формируем полезную нагрузку для сервера
        const userPayload = {
          vkId: vkUser.id,
          firstName: vkUser.first_name,
          lastName: vkUser.last_name,
          screenName: vkUser.screen_name,
          avatarUrl: vkUser.photo_200 || vkUser.photo_400_orig,
          email: vkUser.email, // если нужно
        };

        // 3️⃣ Вызываем login из хука
        await login(userPayload);
      } catch (err) {
        console.error('VKID login failed:', err);
      }
    };

    const vkidOnError = (error: any) => {
      console.error('VKID error:', error);
    };

    const initWidget = async () => {
      try {
        await loadScript();
        if (!window.VKIDSDK || !containerRef.current) return;

        const VKID = window.VKIDSDK;

        VKID.Config.init({
          app: 54294764,
          redirectUrl: 'https://rusfurbal.ru/api/auth/callback/vk',
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
          scope: 'email',
        });

        oneTapRef.current = new VKID.OneTap();

        oneTapRef.current
          .render({
            container: containerRef.current,
            scheme,
            showAlternativeLogin,
          })
          .on(VKID.WidgetEvents.ERROR, vkidOnError)
          .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, vkidOnSuccess);

      } catch (error) {
        console.error('Failed to initialize VKID widget:', error);
      }
    };

    initWidget();

    return () => {
      if (oneTapRef.current) {
        try { oneTapRef.current.destroy(); } 
        catch (error) { console.error('Error destroying VKID widget:', error); }
      }
    };
  }, [login, scheme, showAlternativeLogin]);

  return <div ref={containerRef} />;
}
