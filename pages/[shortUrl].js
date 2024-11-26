import dbConnect from '../utils/db';
import Url from '../models/url';

export async function getServerSideProps(context) {
  const { shortUrl } = context.params;
  await dbConnect();

  try {
    // Query
    const urlDocument = await Url.findOne({ shortenUrl: shortUrl });
    if (urlDocument) {
      if (!urlDocument.isActive) {
        return {
          notFound: true,
          // redirect: {
          //   destination: '/waiting',
          //   permanent: false,
          // }
        };
      }
      const currentTime = new Date();
      await Url.updateOne(
        { shortenUrl: shortUrl },
        {
          $inc: { 'accesses.count': 1 },
          $push: {
            'accesses.lastAccessed': {
              $each: [currentTime],
              $slice: -100,
            },
          }
        }
      );

      // if (!urlDocument.accesses) {
      //   urlDocument.accesses = { count: 0, lastAccessed: [] };
      //   console.log('no accesses');
      // }

      // urlDocument.accesses.count += 1;
      // urlDocument.accesses.lastAccessed.push(currentTime);
      // if (urlDocument.accesses.lastAccessed.length > 100)
      //   urlDocument.accesses.lastAccessed.shift();
      // await urlDocument.save();

      let originalUrl = urlDocument.originalUrl;
      if (!/^https?:\/\//i.test(originalUrl)) {
        originalUrl = `http://${originalUrl}`;  // Prepend http:// if missing
      }

      return {
        redirect: {
          destination: originalUrl,
          permanent: false,
        },
      };
    } else {
      // If no matching shortened URL
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error('Error fetching the shortened:', error);
    return {
      notFound: true,
    };
  }
}

const ShortUrlRedirect = () => {
  return <p>.</p>;
};

export default ShortUrlRedirect;
