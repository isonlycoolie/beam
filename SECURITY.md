# Security Policy

Beam treats Figma credentials and design data as sensitive.

## Supported Versions

Beam is pre-1.0. Security fixes target the latest `main` branch until versioned releases begin.

## Reporting A Vulnerability

Please do not open public issues for vulnerabilities involving credentials, private design data, or unsafe file writes.

Report privately through GitHub Security Advisories for this repository.

## Security Expectations

- Figma tokens must stay in the user-local Beam credential store.
- Project files must not contain credentials.
- Logs must not include raw secrets.
- Beam must not claim to bypass Figma permissions or rate limits.
