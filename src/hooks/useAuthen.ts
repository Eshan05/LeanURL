import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuthen = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const authCookie = cookies.find(cookie => cookie.startsWith('authenticated='));

    if (authCookie && authCookie.split('=')[1] === 'true') {
      setAuthenticated(true);
    } else {
      const redirectUrl = encodeURIComponent(router.asPath);
      router.push(`/login?redirect=${redirectUrl}`);
    }
  }, [router]);

  return authenticated;
};
