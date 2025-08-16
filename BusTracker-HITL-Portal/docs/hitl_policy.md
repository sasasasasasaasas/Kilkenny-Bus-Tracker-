# HITL Policy

This project includes simple Human-in-the-Loop (HITL) endpoints and illustrative workers. In production, ensure human review of high-severity events before taking actions.

## Principles
- Human oversight on any automated alert with severity ≥ 7
- Clear audit trail of incidents and resolutions
- Privacy-respecting monitoring; avoid PII where possible

## Workflow
1. AI or rules engine sends an event to `/api/hitl/incident`
2. Incident is recorded and status flips to `alert` if severity ≥ 7
3. A human operator reviews the incident, takes appropriate action
4. Once resolved, the incident can be removed or marked resolved

## Data Retention
- Keep minimal necessary data and purge regularly
- Redact PII before storage

## Security
- Protect endpoints with authentication in production
- Rate-limit event creation
- Encrypt secrets and API tokens