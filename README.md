# Browline Studio

Standalone personal prototype. Run `npm ci`, `npm run dev -- --port 5187 --strictPort`; open http://127.0.0.1:5187. Camera is off by default. The visitor checks the MediaPipe disclosure and presses Start; the browser controls permission. Stop releases tracks. No account, routing, analytics, recording, audio or frame uploads are implemented.

## Reuse

`src/core` has no React dependency: `createFrame()` returns an original Three.js Group; `TryOnRenderer(canvas)` exposes `resize(width,height)`, `render(result, calibration, preview?, timestamp?)`, `dispose()`. `createTracker(assetBase)` returns the MediaPipe FaceLandmarker, configured VIDEO / one face / matrices enabled / blendshapes disabled. Call `detectForVideo(video, monotonicMilliseconds)` only for new video frames and call `close()` on disposal. `CameraSession.start()/stop()` handles late permission responses safely.

`src/TryOn.tsx` is the React adapter: props are `active`, `calibration: {size,x,y}`, `mirror`, `onStatus`, `onError`, optional `assetBase` (origin-relative default). Hosts own consent and activation. Keep callbacks stable. Copy the core, wrapper, relevant layer styles, and self-hosted `/wasm` and `/models` assets into another site. `main.tsx` and `style.css` are a separate demo, with no idea.ai dependencies. No SaaS services or company repositories are involved.

Video is processed unmirrored; the paired canvas/video layers are mirrored together. Source aspect ratio is retained. Eye corner landmarks anchor scale/position; the facial transformation matrix supplies rotation. Calibration uses viewport fractions for x/y; positive y moves up. ResizeObserver updates the projection. Tracking loss hides the frame immediately. Rendering resources, observers, RAFs, video, tracks and tracker close on stop/unmount/error.

## Limits

This is a visual MVP, not optical sizing, pupillary-distance measurement, prescription advice or fit verification. No face occlusion mesh: temples can appear in front of the face. Orthographic overlay and heuristic eye anchoring require calibration and may drift in large poses; no real face/camera accuracy was tested by the agent. One original unbranded browline design, not a proprietary product reproduction. Main-thread synchronous inference is throttled to about 22 fps; move inference to a worker before a demanding commercial integration. Browser WebGL and camera availability vary. Use HTTPS or localhost for camera access.

Frames are processed on-device. The app does not upload or store them. This does **not** mean zero network or guaranteed offline operation: MediaPipe terms disclose Google performance/utilization metrics and occasional server contact. Hosts must review those terms and consent requirements. The demo shows a disclosure and explicit acknowledgement before Start. Model and WASM are self-hosted rather than loaded from a CDN.

## Validation

`npm run typecheck`, `npm run build`, `npm run lint`, `npm test`. Playwright uses a headless Chrome process and replaces getUserMedia before page load; it never requests the user's camera. Tests cover camera-off preview, desktop/mobile layout, calibration, permission denial, missing device, three synthetic start/stop cycles with actual local model loading, and stopping before a delayed permission result. Screenshots: `test-results/desktop.png`, `test-results/mobile.png`. Chrome path is configurable in `playwright.config.ts` for other machines. No screenshot contains a user's face.

## Provenance

See `licenses/PROVENANCE.md`, retained Apache license and model cards. Direct npm dependency versions are exact and transitive versions are locked in package-lock.json. Original application/frame code is MIT licensed (LICENSE). Third-party packages retain their respective licenses; `licenses/npm-inventory.json` records the locked package license metadata.

## Local 3D imports

Use **Choose 3D model** for `.glb` or self-contained `.gltf`, maximum 20 MiB. This is a browser-local, memory-only import: no upload endpoint, persistence, or shared product catalog. Refreshing clears it. Export a single scene with all buffers and PNG/JPEG/WebP textures embedded. External URIs, separate `.bin`/texture files, required compression/decoder extensions, and oversized geometry are rejected. Limits: 512 nodes, 128 meshes/materials, 64 textures, 200,000 rendered vertices/triangles, 4096-pixel texture dimensions. These are MVP limits, not a full untrusted-file security sandbox.

Defaults assume X = width, Y = up, +Z = front; the longest bounding dimension is normalized to the original frame's width and the bounds are centered. Use **Tilt X / Turn Y / Roll Z**, size and horizontal/vertical controls to correct orientation and alignment. Calibration resets on each import. **Restore original frame** releases imported geometry/materials/textures and returns the original browline. Source models should already be glasses; arbitrary 3D objects will not automatically become wearable frames. Animations are static, and only one scene is accepted.

Reusable API additions: `importModel(file)` validates and returns a normalized Three.js Group. `TryOnRenderer.setModel(group|null)` takes ownership and disposes the previous model; null restores the procedural frame. `Calibration` optionally includes `rx`, `ry`, `rz` in degrees. React `TryOn` additionally accepts `modelFile` and stable `onModelStatus` callback. Importing does not restart the camera.

## Production deployment

Personal public repository: https://github.com/rronaliu/browline-studio — production branch `main`.

GitHub Pages: https://rronaliu.github.io/browline-studio/ . `.github/workflows/deploy.yml` runs typecheck, lint, production build and synthetic Playwright tests before deploying the `dist` artifact. Pushes to `main` deploy after checks; pull requests targeting `main` check only. Other branches never deploy. A manual run deploys only when the selected ref is `main`. Relative assets support the repository URL path, including MediaPipe WASM/model files. No secrets or third-party deployment token are needed: GitHub's per-run OIDC permissions publish to Pages.

Zero-cost selection: public repository GitHub Pages and standard `ubuntu-latest` GitHub-hosted runners, documented as free by GitHub. No larger runners, paid plan, paid add-on, custom domain, or Netlify service was enabled. No npm dependency cache is stored; the Pages artifact is retained for one day. Platform limits can restrict availability; this is not a promise of unlimited usage. See https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages and https://docs.github.com/en/billing/concepts/product-billing/github-actions . Browser-downloadable compiled JS is public as on any static site; this repository's source is also public with the user's approval.
