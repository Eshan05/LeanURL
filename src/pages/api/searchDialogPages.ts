import dbConnect from '@utils/db';
import Url from '@models/url';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    if (req.method === 'GET') {
      const { search } = req.query;

      // If there's a search query, perform a case-insensitive search by originalUrl or shortenUrl
      if (search && typeof search === 'string') {
        const regex = new RegExp(search, 'i');
        const urls = await Url.find({
          $or: [
            { originalUrl: { $regex: regex } },
            { shortenUrl: { $regex: regex } }
          ]
        }).exec();

        return res.status(200).json(urls);
      }

      // If no search query, fetch only the 10 most recent URLs
      const urls = await Url.find({ q: { $exists: false } })
        .sort({ createdAt: -1 })
        .limit(10)
        .exec();

      return res.status(200).json(urls);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
