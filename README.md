# 3d-css-scene

## Installation

Using npm:
```shell
npm i --save 3d-css-scene
```

You may enjoy tools like [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/) to import and use the 3d-css-scene making sure your ECMAScript code remains compatible with older browsers.

Importing 3d-css-scene in you whatever.js file and adding a room:
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

> This should be enough to test this dependency within another project. You can optionally add `3d-css-scene` to your dependencies in `package.json`. The `npm link 3d-css-scene` command would override the package from the npm registry.

This library is exported in it's `dist` mode for better performance and avoid babel syntax problemas when importing. Any time you make changes to this library you'd want to see them reflected in your project. Then you can run the following, to rebuild the library at any given time:

```bash
npm run build:watch
```

Changes should be reflected in any project linked to this library, whenever you change a file.
