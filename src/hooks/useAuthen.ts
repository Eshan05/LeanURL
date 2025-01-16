import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtVerify } from 'jose';
import { getCookie } from 'cookies-next';

export const useAuthen = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getCookie('authToken');
      // console.log(token)

      if (token && typeof token === 'string' && token.trim() !== '') {
        try {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET || '5322c9714a5e9451e84e9f4da58074b4d2af21cb9bafa65a2bbdf8de9f95e5b3');
          await jwtVerify(token, secret, { algorithms: ['HS256'] });
          setAuthenticated(true);
        } catch (error) {
          // console.error("T:", error);
          setAuthenticated(false);
          router.push(`/`);
        }
      } else {
        // console.log("No token found");
        setAuthenticated(false);
        router.push(`/`);
      }
    };

    checkAuthentication();
  }, [router.pathname]);

  return authenticated;
};