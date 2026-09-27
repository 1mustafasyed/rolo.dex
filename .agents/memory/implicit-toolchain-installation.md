---
name: Implicit toolchain installation
description: Temporary shell analysis with an absent language can change the Replit toolchain configuration.
---

Running a language command that is not already configured may implicitly add its runtime to the workspace. For one-off analysis, prefer an installed runtime; if an unrelated runtime is added, remove it through the package-management tool instead of leaving an incidental environment change.

**Why:** A temporary Python analysis command automatically added a Python module to the workspace configuration even though the product is a Node.js app. Direct edits to that configuration were disallowed; the package-management removal restored it.

**How to apply:** After using a new language command for temporary inspection, check the workspace configuration for an unintended module and use the package-management removal flow if appropriate.