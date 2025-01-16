import dbConnect from '@utils/db';
import Url from '@models/url';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { return res.status(405).json({ message: 'Method not allowed' }); }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized: Missing authorization header' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: Missing token' });

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    await jwtVerify(token, secret, { algorithms: ['HS256'] });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  const { originalUrl, alias, expirationDate, scheduledDate } = req.body;
  // console.log(req.body);
  if (!originalUrl) { return res.status(400).json({ message: 'Original URL is required' }); }
  const dotCount = (originalUrl.match(/\./g) || []).length;
  if (dotCount <= 0) { return res.status(400).json({ message: 'Invalid URL or Domain' }); }

  await dbConnect();
  try {
    // const existingUrl = await Url.findOne({ originalUrl });
    // if (existingUrl) { return res.status(400).json({ message: 'This URL has already been shortened' }); }

    // Check if alias already exists (Only if alias is provided)
    if (alias) {
      const existingAlias = await Url.findOne({ alias });
      if (existingAlias) {
        return res.status(400).json({ message: 'Custom alias already in use' });
      }
    }

    if (expirationDate && new Date(expirationDate) > new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000)) {
      return res.status(400).json({ message: 'Expiration date cannot be more than 2 years from the current date' });
    }

    const expiration = expirationDate;
    const scheduled = scheduledDate;

    let isActive = true;
    const now = new Date();

    // If there is a scheduledDate and it's in the past, set isActive to false
    if (scheduled || scheduled <= now) {
      isActive = false;
    }

    const shortenUrl = alias || nanoid(6);
    const newUrl = await Url.create({
      originalUrl,
      shortenUrl,
      alias: alias || undefined,
      expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      isActive: isActive,
    });

    const createdUrl = await Url.findById(newUrl._id);
    // console.log(createdUrl);

    res.status(201).json({ shortenUrl: `${process.env.BASE_URL}/${shortenUrl}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
