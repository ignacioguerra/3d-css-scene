# 3d-css-scene

Inspired by [Keith Clark's](https://keithclark.co.uk/) [CSS 3D Engine](https://keithclark.co.uk/labs/css-fps/)

## Installation

Using npm:

```shell
npm i --save 3d-css-scene
```

You may enjoy tools like [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/) to import and use the 3d-css-scene making sure your ECMAScript code remains compatible with older browsers.

### The `Scene` object

Importing 3d-css-scene in your `whatever.js` file and adding a room:

```js
// Load the main object. Constructor will instantiate the camera and allow for objects creation.
import { Scene } from '3d-css-scene'
// Load required css styling for the scene.
import '3d-css-scene/dist/app.css'

// Instantiate the Scene object
const scene = new Scene()

// Add a room to your scene
const room = scene.createRoom('room', 3600, 1080, 3000)
room.translateZ(-200)
room.update()
```

Scene allows the instanciation of the main object and the creation of the following objects, via dedicated functions, where `className` is a `string` and every scaleX|Y|Z is a `number`:

- Room with `scene.createRoom(className, scaleX, scaleY, scaleZ)`
- Plane with `scene.createPlane(className, scaleX, scaleY)`
- Box with `scene.createBox(className, scaleX, scaleY, scaleZ)`
- Avatar with `scene.createAvatar(className, scaleX, scaleY)`

### `SpacializedAudio`

You can optionally use the `SpacializedAudio` function to initialise an [audio context](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) listener to an audio source. Accessing the scene, the `SpacializedAudio` context handles the `Camera` object updates to set a new [orientation](https://developer.mozilla.org/en-US/docs/Web/API/AudioListener/setOrientation) on time intervals.

The `SpacializedAudio` function takes a `Scene` instance as parameter and returns a function that takes a media element (audio or video node) to initialise the listener. This modularized way allows you to create and use the `Scene` object with the `SpacializedAudio` function from a js module but use the initialisation function from another module.

This usage example assumes there's an audio element in your DOM.

```js
import { Scene, SpacializedAudio } from '3d-css-scene'
import '3d-css-scene/dist/app.css'

// Instantiate the Scene object
const scene = new Scene()
// Get the initialisation function
const initSpacializedAudio = SpacializedAudio(scene)
// Capture an audio or video node from the DOM
const mediaElement = document.querySelector('audio)
// Initialise the audio context listener
SpacializedAudio(mediaElement)
// Play the media element and walk around
mediaElement.play()
```

## Development

### Run this project

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm start
```

### Local test with npm link

To locally test this library you must first expose this library to your node installation directory. This wil install all dependencies and finally output a symlink message.

```bash
npm link

/your-node-path/node/v12.18.1/lib/node_modules/3d-css-scene-test -> /path-to-this-project/3d-css-scene
```

Then, navigate to  another npm project you should link your dependencies to this library. Another symlink message will appear

```bash
npm link 3d-css-scene

/path-to-this-project/3d-css-test-app/node_modules/3d-css-scene -> /your-node-path/node/v12.18.1/lib/node_modules/3d-css-scene -> /path-to-3d-css-scene-project/3d-css-scene
```

> ‎
> This should be enough to test this dependency within another project. You can optionally add `3d-css-scene` to your dependencies in `package.json`. The `npm link 3d-css-scene` command would override the package from the npm registry. Otherwise you can simply temporarily import the full path of your `3d-css-scene` project and import objects from there to test them. E.g.:
>
> ```js
> import { Scene } from '/home/user/Documents/3d-css-scene'
> ```
>‎

This library is exported in it's `dist` mode for better performance and avoid babel syntax problemas when importing. Any time you make changes to this library you'd want to see them reflected in your project. Then you can run the following, to rebuild the library at any given time:

```bash
npm run build:watch
```

Changes should be reflected in any project linked to this library, whenever you change a file.
