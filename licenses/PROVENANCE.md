# Third-party provenance

Retrieved 2026-10-23.

- MediaPipe tasks-vision 1.1.1: official npm package, Apache-2.0 per package metadata. WASM/JS files copied verbatim from its wasm directory. Runtime source: https://github.com/google-ai-edge/mediapipe . Full license retained as Apache-2.0.txt.
- Model bundle version 1 float16: https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task
- Model SHA-256: 64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff
- Official model list and cards: https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker . Cards identify Apache License 2.0; cards retained locally. The bundled blendshape model exists in the official asset, but output is disabled.
- API checked: https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js and installed vision.d.ts (timestamp argument is supplied).
- MediaPipe terms: https://developers.google.com/edge/mediapipe/legal/tos (April 7, 2026 revision on viewed page). These cover on-device input processing and Google metrics/server contacts.
- React/ReactDOM: MIT; Three.js: MIT. Other dependency license metadata and integrity hashes: npm-inventory.json and package-lock.json.
- All frame geometry is original procedural code in src/core/frame.ts. No brand assets, photographs, fonts or proprietary models.
