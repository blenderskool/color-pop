import * as tf from '@tensorflow/tfjs-node';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as sharp from 'sharp';

interface PopConfig {
  readonly model: 'mobilenet' | 'resnet',
}

/**
 * Loads an image from buffer and resizes it to max 1080px width/height
 * @param buffer Buffer data for image to load
 * @returns Resized image as a Sharp instance
 */
function loadImage(buffer: Buffer): sharp.Sharp {
  return sharp(buffer)
    .resize(1080, 1080, {
      fit: 'inside',
    });
}

let bpMobilenet: bodyPix.BodyPix, bpResnet: bodyPix.BodyPix;
/**
 * Loads the specified bodyPix model
 * @param model Name of the model
 */
async function loadModel(model: string): Promise<bodyPix.BodyPix> {
  switch (model) {
    case 'mobilenet':
      if (!bpMobilenet) {
        bpMobilenet = await bodyPix.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          quantBytes: 4,
        });
      }
      return bpMobilenet;

    case 'resnet':
      if (!bpResnet) {
        bpResnet = await bodyPix.load({
          architecture: 'ResNet50',
          outputStride: 16,
          quantBytes: 2,
        });
      }
      return bpResnet;

    default:
      throw 'Invalid model';
  }
}

/**
 * Creates a segmentation map of all people found in the image
 * @param image Image to segment
 * @param config Configuration settings
 * @returns Segmentation map image as a raw buffer
 */
async function segment(image: sharp.Sharp, config: PopConfig = {
  model: 'mobilenet',
}): Promise<Buffer> {

  const net = await loadModel(config.model);
  const mask: number[] = [];
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const input = tf.tensor3d(data, [ info.height, info.width, info.channels ]);

  const results = await net.segmentMultiPerson(input, {
    internalResolution: 'full',
  });

  results.forEach(result => {
    result.data.forEach((value, i) => {

      if (!mask[i * 3]) {
        for(let c=0; c<3; c++)
          mask[i * 3 + c] = value;
      }
    });
  });

  return Buffer.from(mask);
}

/**
 * Applies color pop operation to the image. Color pop keeps the people in color
 * and makes the background of the image black and white
 * @param imageBuf Buffer data of image to apply color pop to
 * @param config Configuration settings
 * @returns Image with color pop operation as Sharp instance
 */
async function pop(imageBuf: Buffer, config?: PopConfig): Promise<sharp.Sharp> {
  const image = loadImage(imageBuf);
  const mask = await segment(image, config);

  const popImage = await image.raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data: buffer, info }) => {

      for(let i=0; i < buffer.length; i += 3) {
        const [ r, g, b ] = [ buffer[i], buffer[i+1], buffer[i+2] ];
        const gray = Math.trunc((0.3 * r) + (0.59 * g) + (0.11 * b));

        [ buffer[i], buffer[i+1], buffer[i+2] ] = mask[i] === 0 ? [ gray, gray, gray ] : [ r, g, b ];
      }
    
      return sharp(buffer, {
        raw: {
          width: info.width,
          height: info.height,
          channels: 3,
        }
      });
    });

  return popImage
    .gamma(2)
    .modulate({
      saturation: 1.1,
    })
    .jpeg({ quality: 90 });
}

export default pop;