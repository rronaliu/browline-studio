# Validation — 2026-10-23

- TypeScript: pass (`npm run typecheck`).
- Production build: pass (`npm run build`); Vite notes a large 840 kB JS chunk (232 kB gzip), expected for bundled Three.js + MediaPipe. Code splitting is a later optimization.
- ESLint: pass (`npm run lint`), first-party source/config/tests checked; vendored WASM loader code excluded.
- Playwright: 6/6 pass in headless installed Chrome. No hardware camera; getUserMedia replaced before load.
- Synthetic tests: no-camera preview/calibration/responsive layout; denied permission; absent device; 3 complete synthetic start-stop cycles with real MediaPipe local model initialization; late permission stream stopped; synthetic eye landmarks and identity transformation matrix render visible geometry and empty results hide it.
- Desktop/mobile PNGs visually inspected after fixing orthographic depth clipping. No horizontal mobile overflow.
- npm full dependency audit after Vite 7.3.7 update: 0 vulnerabilities. Production audit also 0.
- Loopback endpoint returns HTTP 200, listening only 127.0.0.1:5187, PID 16341 at completion.
- Real camera, real-face accuracy, Safari/mobile device performance not tested. User controls any subsequent camera session.

## Import/deployment update

- Typecheck, build and ESLint pass after local import support.
- 14/14 local Playwright tests pass: prior six tests plus GLB/glTF synthetic imports, orientation/reset/re-import, external/relative URI rejection before fetch, malformed/oversized/empty/wrong-type files, and geometry/material/texture disposal.
- Camera hardware was never accessed. Import tests explicitly replace camera access with a throwing stub.
- Credential-pattern scan of scoped staged source/docs/assets found only upstream MediaPipe logger API symbol names, no credentials. No unrelated project files, node_modules, generated screenshots, environment files or personal models staged.
- Public repository and HTTPS-enforced Pages build_type=workflow verified via GitHub API before first push. Workflow uses standard Ubuntu runners and main-only deploy gate.

- GitHub Actions checks and Pages deploy succeeded at run 39985346466 on `ubuntu-24.04`.
- Live HTTPS returned HTTP/2 200. Headless Chrome live smoke passed camera-off preview, synthetic capture stream with real self-hosted MediaPipe model/WASM, import and original reset. Screenshot: test-results/live-production.png.
- Reproducible verification scripts are in scripts/. They replace real camera access before navigation. Mac Chrome path is used by verify-live; verify-mobile uses Playwright WebKit (install its pinned browser first).
- WebKit 26 (pinned Playwright browser) passed live iPhone 13 emulation: HTTPS preview, no mobile overflow, muted/inline playback flags, front-camera/audio-off constraints, mocked permission denial and recovery. Real iPhone hardware/camera remains untested. The WebKit test now replaces the whole navigator.mediaDevices object and asserts the mock identity before Start; the initial per-method hook did not reliably persist in WebKit and was corrected.
