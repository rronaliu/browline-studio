# Production setup

- Personal owner: `rronaliu` (GitHub owner type User).
- Scoped repository: `rronaliu/browline-studio`, public with explicit user approval.
- Branch: `main`.
- Workflow: `.github/workflows/deploy.yml`.
- Pages build type: `workflow`; HTTPS enforced.
- Target: https://rronaliu.github.io/browline-studio/ .
- No credentials committed. GitHub Actions uses ephemeral GITHUB_TOKEN/OIDC permissions.
- Checks precede deployment; pull requests and feature branches cannot deploy.
- Standard Ubuntu runner only; no paid hosting, larger runners, custom domains, or paid add-ons provisioned.
- GitHub rejected private Pages under the existing account plan; only after user approval for public source was the empty repository switched public and Pages enabled successfully.
- Netlify was inspected only to its login page; no account change, login, provisioning, or billable setup performed.

Static site visitors are still subject to MediaPipe terms/metrics disclosure. Imported models remain browser-session-only. Uploaded files are never added to this repository or deployment.
