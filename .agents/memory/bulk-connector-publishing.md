---
name: Bulk connector publishing
description: A reliable way to send many local project files to an external repository through a connector.
---

For bulk repository publishes through a connector, pass a short, delimiter-safe file listing between the durable shell callback and the impure sandbox, then read file bytes inside the impure sandbox.

**Why:** During a repository publish, large shell output lost its beginning despite no truncation warning, and tab-delimited listing output lost tabs. Passing the full base64 contents or tab-sensitive metadata caused parsing failures.

When the workspace's local Git history and the destination repository do not share an ancestor, preserve the destination's history by creating a snapshot commit on its current branch through the connector; never force-push over its existing commits.

**Why:** A connected GitHub repository may contain its own initial commit while the local workspace has only an internal backup remote; regular Git push may also lack authentication even though the connector is usable.

**How to apply:** Use a compact listing with an explicit printable delimiter, read local bytes with the impure sandbox's filesystem API, verify the remote branch has not advanced before updating it, and verify its final commit. For an unrelated history, build a tree on the remote's current tree and create a non-forced descendant commit through the connector.