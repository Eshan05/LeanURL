import dbConnect from "../../utils/db"; // Import the database connection utility

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { passcode } = req.body;
    try {
      await dbConnect();

      const { db } = await dbConnect();
      const url = await db.collection('urls').findOne({ q: passcode });

      if (url) {
        res.setHeader('Set-Cookie', 'authenticated=true; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Strict');

        return res.status(200).json({ message: 'Authenticated successfully' });
      } else {
        return res.status(401).json({ message: 'Invalid passcode' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
