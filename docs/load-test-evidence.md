# Load / Stress Test Evidence

This file is the submission evidence placeholder for NFR-01..NFR-04.

## Recommended Tooling
- k6 or Artillery for HTTP load.
- Optional: `docker stats` + app logs during runs.

## Required Scenarios
1. 1,000 simultaneous purchase requests on a single item with limited stock.
- Expected: zero oversell, deterministic confirmed order count <= stock.

2. 30-second sustained pressure test (with Nginx + 2 backend instances).
- Expected: uptime >= 95%, no server crash.

3. Excess traffic behavior test.
- Expected: structured `RATE_LIMITED` responses, no raw 5xx crash output.

4. Normal-load latency test (<= 100 concurrent users).
- Expected: purchase endpoint p95 <= 2s.

## Evidence To Attach
- Command/scripts used.
- Summary table of results.
- Screenshots or exported reports.
- Final integrity check query (orders vs stock).
