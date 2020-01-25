import * as functions from 'firebase-functions';
import pop from './pop';

export const colorpop = functions
  .runWith({
    memory: '2GB',
  })
  .https
  .onRequest(async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).send('Request method not allowed').end();
    }
    
    switch (req.get('content-type')) {
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
        break;
    }
  });