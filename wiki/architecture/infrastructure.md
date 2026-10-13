# Infrastructure

> **Status: Planned** — no Docker Compose, CI/CD, or deployment config exists yet. Local dev today: `npm run dev` in `webapp/`, `./gradlew :identity-service:bootRun` against a locally installed MySQL on 3306.

## Planned (spec §20–22)

- **Docker Compose** (`infrastructure/docker/docker-compose.yml`): web, api-gateway, identity/profile/plan/place/notification services, mysql, mongodb, redis, kafka (KRaft), kafka-ui.
- **CI (GitHub Actions)** on PR: frontend lint + tests, backend unit + Testcontainers integration tests, build. On merge to main: build Docker images, push to GHCR, deploy.
- **Deploy stages:** single VPS with Docker + reverse proxy → Kubernetes (ingress, HPA, ConfigMaps/Secrets, Kafka) later.
- **Monitoring:** Actuator/Micrometer first; Prometheus, Grafana, OpenTelemetry later.

## Present today

- Root `.gitignore` covers webapp + all services (no per-project files).
- `.github/` contains only tool output (`modernize/`), no workflows.
- Web PWA bits: `public/sw.js` (offline fallback page), production only.
