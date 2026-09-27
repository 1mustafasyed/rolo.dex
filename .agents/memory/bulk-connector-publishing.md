---
name: Bulk connector publishing
description: A reliable way to send many local project files to an external repository through a connector.
---

For bulk repository publishes through a connector, pass a short, delimiter-safe file listing between the durable shell callback and the impure sandbox, then read file bytes inside the impure sandbox.

**Why:** During a repository publish, large shell output lost its beginning despite no truncation warning, and tab-delimited listing output lost tabs. Passing the full base64 contents or tab-sensitive metadata caused parsing failures.

**How to apply:** Use a compact listing with an explicit printable delimiter, read local bytes with the impure sandbox's filesystem API, and verify a branch's current and final commit before reporting that it was updated.