# Feature: Auth

**Status: Partial** — backend sign-up implemented; web screens mocked; sign-in, tokens and social login planned.

## Business purpose

Let people create an account and sign in with email/password, Google or Facebook, so plans, votes and memories belong to a real user.

## User workflow

`/sign-up` → fill credentials (or Google/Facebook) → account created → signed in. `/sign-in` for returning users; each page links to the other.

## Data flow

```text
Web (mock today)                         identity-service (implemented)
SignUpForm ─► useSignUp ─► authService   POST /identity/auth/sign-up
   (fake 900 ms delay, no request)          ─► @Valid SignUpRequest
                                            ─► AccountMapper → Account
                                            ─► Argon2 hash → accounts (MySQL)
                                            ◄─ ApiResponse<Account>
Planned: web ─► gateway /api/v1/auth/sign-up ─► identity-service ─► USER_REGISTERED ─► profile-service
```

## Business rules (from code)

| Rule | Where |
|---|---|
| Email required, valid format, unique | backend (`@Email`, DB unique key) |
| Password required, ≥ 6 chars | backend |
| Confirm password must equal password | backend (`@FieldMatch`), web (zod refine) |
| Password stored Argon2-hashed; BCrypt hashes still accepted | backend `SecurityConfig` |
| Sign-up / sign-in endpoints public; everything else authenticated | backend |

⚠️ The web form validates a **username** (3–20 chars `[a-zA-Z0-9._]`) and password **≥ 8 with a letter and a digit** — different from the backend. Align before wiring ([spec gaps](../knowledge.md#spec-gaps)).

## Planned

- Sign-in issuing UNPLND JWT + refresh token; refresh and sign-out.
- Google and Facebook OAuth2 login; one account per (`provider`, `providerUserId`), same JWT as password login.
- Gateway validates JWTs; web gets an auth guard (none today).
- `USER_REGISTERED` event so profile-service creates the profile.

## Modules

[identity-service](../modules/identity-service.md) · [web](../modules/web.md) · [profile-service](../modules/profile-service.md) *(planned)*
