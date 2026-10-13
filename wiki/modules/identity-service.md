# Module: identity-service

## Why it exists

Knows *who you are*: credentials, linked social accounts, tokens. The only service that will issue JWTs. Everything about the person (name, avatar, friends) belongs to [profile-service](profile-service.md).

## Status

**Partial** — email/password sign-up only. Runs on port 8081 under context path `/identity`, MySQL `unplnd-identity`.

## Owns

| Data | Notes |
|---|---|
| `accounts` | `id` (UUID, the userId), `email` (unique), `password_hash` (Argon2, `{id}`-prefixed) |
| *planned:* oauth_accounts, refresh_tokens | Google/Facebook links by (`provider`, `providerUserId`) |

## Exposes

| Endpoint | Status |
|---|---|
| `POST /identity/auth/sign-up` | Implemented — `{email, password, confirmPassword}` → `ApiResponse<Account>` |
| `POST /identity/auth/sign-in` | Permitted in security config, **no endpoint yet** |
| refresh, sign-out, Google/Facebook OAuth2 | Planned |
| Event `USER_REGISTERED` | Planned |

## Consumes

Nothing yet. Depends on `commons` (`ApiResponse`).

## Who depends on it

Web sign-in/sign-up (once wired), gateway JWT validation (public key/JWKS), profile-service (via `USER_REGISTERED`).

## Does NOT belong here

Profile fields, friends, preferences, user settings — profile-service.

## Known issues

See [knowledge → pitfalls](../knowledge.md#common-pitfalls): entity (with password hash) returned from sign-up; duplicate email → 500; `ddl-auto=update` without Flyway; credentials in `application.properties`.
