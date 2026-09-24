# Security

Worldline Board is intentionally a **client-only visualizer**.

Never commit provider API keys, production traces containing private user data, authorization headers, private workflow rules, or internal routing thresholds.

The CI pipeline runs a public-boundary scan for common secret/provider coupling patterns.

Please report sensitive security issues privately to the repository owner instead of opening a public issue with secret material.
