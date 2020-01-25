import * as functions from 'firebase-functions';
import pop from './pop';

export const colorpop = functions
  .runWith({
    memory: '2GB',
  })
  .https
  .onRequest(async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Request method not allowed').end();
      return;
    }
    
    switch (req.get('content-type')) {
      case 'image/webp':
      case 'image/tiff':
      case 'image/jpeg':
      case 'image/png':
        const output = await pop(req.rawBody, {
          model: req.query.model || 'mobilenet',
        });
        const outputBuf = await output.toBuffer();
    
        res.set('Content-Type', 'image/jpeg');
        res.status(200).send(outputBuf);
        break;

      default:
        res.status(415).send('Unsupported image type').end();
    }
  });