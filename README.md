# 🌈 Color Pop

The Color Pop(aka Color splash) effect makes the subject(usually a person) stand out from the rest of the image.
The subject remains in color, but the background is made black and white. This gives a pleasant look in most cases.

This app applies color pop effect on human subjects and supports images with many people.  
[Here's an article](https://medium.com/@AkashHamirwasia/color-pop-effect-using-bodypix-and-tensorflow-js-a584ddc48a02)
that I wrote explaining the working of this project at a basic level.

## Examples
### Image with one person
![Imgur](https://i.imgur.com/e9f0avV.jpg)
<p align="center">
  Original left, Color pop right.
</p>

### Image with many people
![Imgur](https://i.imgur.com/BwbQ57L.jpg)
<p align="center">
  Original left, Color pop right.
</p>

## Behind the scenes
It uses [Tensorflow.js](https://www.tensorflow.org/js) and the
[BodyPix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix) model to create segmentation masks
around people in images.

It can be accessed using the `colorpop` cloud function once the project is deployed on [Firebase](https://firebase.google.com).

## Deployment
Instructions to [deploy this project on Firebase](https://github.com/blenderskool/color-pop/tree/master/functions)

## Options for `colorpop` cloud function
The `colorpop` is an HTTP cloud function which can be accessed by making a `POST` request with the binary image data
as the body of the request, along with following optional query params

| Param | Expected data                    | Description |
|:-----:|:--------------------------------:| ----------- |
| model | `mobilenet`(default) or `resnet` | The model to use for segmentation.<br>Mobilenet is faster but less accurate.<br>Resnet is slower but more accurate |

#### Example cURL command
```bash
curl --location --request POST 'http://{CLOUD_FUNCTION_HOST_URL}/colorpop?model=mobilenet' \
--header 'Content-Type: image/jpeg' \
--data-binary 'test.jpg' \
--output 'output.jpeg'
```

## History
Achieving this effect manually is quite simple. It involves creating a mask around the subject and dropping the color
of the background ([Example using Photoshop](https://www.youtube.com/watch?v=OuObv9Agdow)).
While it is simple, doing this manually has the following issues:
- Tedious and time-consuming.
- Poor results for complex subjects.
- Not all applications(especially mobile apps) support masking.

Google announced the color pop effect for its Photos app in [Google IO 2018](https://www.youtube.com/watch?v=xjPEnpLwMUU&feature=youtu.be&t=2m53s)
and although it does an incredible job of detecting the subject and applying the effect, it applies it automatically
only to some images. Certain conditions have to be met before the color pop effect even shows up in the editing options
of the Photos app.

This inspired me to build this tool which makes it as easy as Google Photos to apply the color pop effect
on photos with people in it, without needing any manual work.