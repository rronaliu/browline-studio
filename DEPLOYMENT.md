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

Verified first successful deployment: https://github.com/rronaliu/browline-studio/actions/runs/39985346466 . HTTPS root returns 200; production browser smoke passes with synthetic stream, local MediaPipe loading, self-contained model import and reset. First-run Ubuntu compatibility failure was corrected by pinning standard `ubuntu-24.04`.

GitHub Pages limits checked in official docs: published site <=1 GB, soft bandwidth 100 GB/month, potential throttling. This deployment is a prototype demo; Pages is not a free business/SaaS hosting commitment. No paid account settings or automatic overage settings were enabled or changed. Official limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits .
