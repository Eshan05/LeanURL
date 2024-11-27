import dbConnect from '../../utils/db';
import Url from '../../models/url';

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === 'GET') {
      const urls = await Url.find({ q: { $exists: false } });
      return res.status(200).json(urls);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) { return res.status(400).json({ message: 'URL ID is required' }); }
      const result = await Url.findByIdAndDelete(id);
      if (!result) { return res.status(404).json({ message: 'URL not found' }); }
      return res.status(200).json({ message: 'URL deleted successfully' });
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
    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
