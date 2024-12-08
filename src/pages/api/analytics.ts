import dbConnect from '@utils/db';
import Url from '@models/url';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const urls = await Url.find({ q: { $exists: false } });
      return res.status(200).json(urls);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const { permanent } = req.query;
      if (!id) { return res.status(400).json({ message: 'URL ID is required' }); }
      const url = await Url.findOne({ _id: id });
      if (!url) return res.status(404).json({ message: 'URL not found' });

      // Soft delete if permanent delete is not specified
      if (req.query.action !== 'permanent') {
        if (url.isDeleted) {
          return res.status(400).json({ message: 'URL has already been deleted' });
        }

        const updatedUrl = await Url.findOneAndUpdate(
          { _id: id },
          { $set: { isDeleted: true, deletedAt: new Date() } },
          { new: true }
        );

        if (!updatedUrl) return res.status(404).json({ message: 'URL not found' });
        return res.status(200).json({ message: 'URL deleted successfully' });
      }

      console.log('Permanent delete issued on URL ID:', id);
      const deleteResult = await Url.findByIdAndDelete(id);
      if (!deleteResult) return res.status(404).json({ message: 'URL not found' });
      return res.status(200).json({ message: 'URL permanently deleted' });
    }


    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id) { return res.status(400).json({ message: 'URL ID is required' }); }
      const { shortenUrl, expirationDate, scheduledDate } = req.body;

      if (!shortenUrl) { return res.status(400).json({ message: 'Shorten URL is required' }); }
      if (typeof shortenUrl !== 'string') {
        return res.status(400).json({ message: 'Shorten URL must be a string' });
      }

      const existingUrl = await Url.findOne({ shortenUrl });
      if (existingUrl && existingUrl._id.toString() !== id) {
        return res.status(400).json({ message: 'Shortened URL must be unique' });
      }

      const updateData = {
        shortenUrl,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      };


      const result = await Url.findByIdAndUpdate(id, updateData, { new: true });
      if (!result) { return res.status(404).json({ message: 'URL not found' }); }
      return res.status(200).json({ message: 'URL updated successfully' });
    }

    if (req.method === 'POST' && req.query.action === 'restore') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: 'URL ID is required' });
      }

      // Find the URL by ID
      const url = await Url.findById(id);
      if (!url) {
        return res.status(404).json({ message: 'URL not found' });
      }

      // Check if the URL has been soft deleted and if it's within the 1-hour grace period
      const now = new Date();
      if (url.deletedAt && now.getTime() - (url.deletedAt as Date).getTime() <= 60 * 60 * 1000) {
        // Restore the URL (soft restore)
        url.deletedAt = null;
        url.isDeleted = false;
        await url.save();
        return res.status(200).json({ message: 'URL restored successfully' });
      } else {
        return res.status(400).json({ message: 'URL is past the recovery window or not marked as deleted' });
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
