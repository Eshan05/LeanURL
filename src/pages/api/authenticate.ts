import dbConnect from "@utils/db";
import Url from '@models/url';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { passcode } = req.body;
    try {
      await dbConnect();
      const url = await Url.findOne({ q: passcode });

      if (url) {
        res.setHeader('Set-Cookie', 'authenticated=true; Path=/; Max-Age=3600; SameSite=Strict');
        // res.setHeader('Set-Cookie', 'authenticated=true; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Strict');

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
