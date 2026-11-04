# SuperJobGenie Maintenance & Long-Term Memory (v4.0.7+)

## Current Stable State (v4.0.7)
The extension is currently stable with robust ingestion for LinkedIn and Indeed. All critical bugs related to job lead overwriting, non-job text scraping, and incorrect company name formatting have been resolved.

## Maintenance Rules & Anti-Regression ("Little Ghosts" Prevention)

### 1. Ingestion Integrity
- **Unique ID Enforcement**: Never use simple `title::company` strings as keys. Always derive unique IDs (`jk` from Indeed, `currentJobId` from LinkedIn, etc.).
- **Selector Strictness**: When scanning lists, always apply explicit CSS exclusion rules to filter out details panes, description containers, or sidebar content that might masquerade as a job card.
- **Immediate Registration**: Always register a job lead in the `scannedLeadsRegistry` at the exact moment of interaction (click or view), not during a batch export.

### 2. Data Sanitization
- **Company Name Scrubbing**: Always use `cleanCompanyName` to strip metadata (locations, rating stars, "Posted X days ago", etc.). Never trust raw DOM text content.
- **Header/Footer Filtering**: During CSV/Markdown export, explicitly filter out rows that contain non-job header content (e.g., "About X", "Your skills").

### 3. Verification Protocol
- **Post-Change**: After any modification, ensure:
    - [ ] `npm run lint` passes.
    - [ ] Extension manifest version is bumped in `manifest.json`.
    - [ ] LinkedIn job list scan correctly ignores details pane content.
    - [ ] CSV output contains no junk metadata rows.

## Future-Proofing
If performance degrades or new job boards are integrated, prioritize implementing the same unique ID/sanitization patterns established in v4.0.7 before adding new features.
