# 3d-css-scene

## Run this project

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm start
```

## Development

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

This should be enough to test this dependency within another project. You can optionally add `3d-css-scene` to your dependencies in `package.json`. The `npm link 3d-css-scene` command would override the package from the npm registry.
