// components/VKIDAuthWithHook.tsx
'use client';

import VKIDAuth from './VKIDAuth';
import { useAuth } from '@/hooks/useAuth';

export default function VKIDAuthWithHook() {
  const { login } = useAuth();

  const handleSuccess = async (data: any) => {
    console.log('VKID returned:', data);
    // вызываем login из хука
    await login(data);
  };

  const handleError = (error: any) => {
    console.error('VKID login failed:', error);
  };

  return (
    <VKIDAuth
      onSuccess={handleSuccess}
      onError={handleError}
      scheme="dark"
      showAlternativeLogin={true}
    />
  );
}
