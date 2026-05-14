# Sample Electron App

This repository contains a minimal [Electron](https://www.electronjs.org/) desktop application scaffolded from scratch. It uses the latest Electron release and demonstrates a safe separation between the main and renderer processes via a small preload bridge.

## Getting started

```bash
npm install
npm start
```

The `start` script launches the Electron runtime and loads the window defined in `main.js`.

## Project structure

- `main.js` – boots the Electron app and creates the browser window.
- `preload.js` – exposes a minimal API (`window.sampleApi`) to the renderer using the secure [`contextBridge`](https://www.electronjs.org/docs/latest/api/context-bridge).
- `index.html`, `styles.css`, `renderer.js` – renderer-side UI.

## Next steps

- Update the HTML/CSS/JS in the renderer to match your app's UI.
- Extend `preload.js` with more functions to communicate with the main process.
- Add build tooling (`electron-builder`, `electron-forge`, etc.) when you're ready to package the app.

## Release automation

- Build locally with `npm run dist:linux` or `npm run dist:win` (requires the matching OS) to generate installable packages in `dist/`.
- When you're ready to publish, create and push a tag that follows the `v*` pattern (for example `git tag v1.0` followed by `git push origin v1.0`). GitHub Actions will build `.deb` and `.exe` installers and attach them to the release automatically.
- The release workflow runs inside the [`electronuserland/builder:wine`](https://hub.docker.com/r/electronuserland/builder) Docker image so a single Linux runner can cross-build both packages. To reproduce the same setup locally, mount the repository and run `docker run --rm -it -v "$PWD":/workspace -w /workspace electronuserland/builder:wine bash -lc "npm install && npm run dist:all"`.
- If you run the workflow on a self-hosted runner, ensure Docker is installed and adjust the `runs-on` label in `.github/workflows/release.yml` to match your runner (for example `[self-hosted, linux]`)..
