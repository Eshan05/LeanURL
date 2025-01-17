import dbConnect from "@utils/db";
import Url from '@models/url';
import { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from 'nanoid'
import { SignJWT } from 'jose'
import { setCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { passcode } = req.body;
    try {
      await dbConnect();
      const url = await Url.findOne({ q: passcode });

      if (url) {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || '5322c9714a5e9451e84e9f4da58074b4d2af21cb9bafa65a2bbdf8de9f95e5b3');
        const payload = { passcode: url.q, uniqueId: nanoid() };

        const token = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('2h')
          .sign(secret)

        setCookie('authToken', token, {
          req,
          res,
          path: '/',
          maxAge: 7200,
          sameSite: 'strict',
          httpOnly: process.env.NODE_ENV === 'production', // Make false if not working
          secure: process.env.NODE_ENV === 'production', // Same
        });

        return res.status(200).json({ message: 'Authenticated successfully' });
      } else {
        return res.status(401).json({ message: 'Invalid passcode' });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
