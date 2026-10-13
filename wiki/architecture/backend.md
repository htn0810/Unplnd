# Backend Architecture

Spring Boot 4.1 / Java 21 services. Coding rules: [`CLAUDE.md` §6–7](../../CLAUDE.md).

## Build layout

```text
unplnd/
├── settings.gradle        include 'commons', 'identity-service'
├── gradlew, gradle/       single Gradle 9.7.1 wrapper — run everything from the root
├── commons/               java-library: ApiResponse<T>
└── identity-service/      Spring Boot app, implementation project(':commons')
```

- One Gradle build, but each service is its **own deployable** with its own database.
- `commons` holds cross-service building blocks only; never entities or business logic.
- Commands: `./gradlew build`, `./gradlew :identity-service:bootRun`.

## Service template

Layer packages under the service base package `com.htn.unplnd.<service>` (identity-service → `com.htn.unplnd.identity`):

```text
HTTP ─► controller/ ─► service/ ─► repository/ ─► DB
          │  @Valid dto/request        │  mapper/ (MapStruct)
          ▼                            ▼
     ApiResponse<T>              entity/
configuration/ (SecurityConfig) · validator/ (custom constraints) · exception/ (planned)
```

- Controllers are thin; services are concrete `@Service` classes holding the business rules.
- Cross-field validation via custom constraints (`@ValidateFieldMatch` + `@FieldMatch`).

## Responses and errors

```text
200/201  { "message": "...", "result": { ... } }
4xx/5xx  { "message": "..." }            (planned GlobalExceptionHandler)
```

`GlobalExceptionHandler` does not exist yet — validation errors and DB constraint violations currently surface as Spring's default error body.

## Security

```text
Client ─► Gateway (planned: JWT validation, rate limit, CORS, correlation id)
              ─► Service (authorization on every endpoint; current user from JWT only)
```

- identity-service: stateless (`STATELESS` sessions, CSRF/form login/basic auth off); `POST /auth/sign-up` and `/auth/sign-in` are public (sign-in is permitted but has no endpoint yet); everything else requires authentication, which nothing can provide until JWTs exist.
- JWT issuing / validation and OAuth2 login are planned — see [auth](../features/auth.md).

## Observability (planned)

Correlation id from the gateway through REST and Kafka headers into MDC; Actuator + Micrometer; structured JSON logs. Nothing wired yet.
