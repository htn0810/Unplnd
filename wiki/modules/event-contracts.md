# Module: event-contracts

> **Status: Planned** — no `packages/event-contracts/` yet.

- *Planned:* JSON Schemas for every Kafka event, shared by backend producers/consumers and frontend types.
- *Planned:* envelope `eventId, eventType, occurredAt, producer, version, payload` — see [kafka-events](../architecture/kafka-events.md).
- Rule: events are immutable past-tense facts; breaking payload change → bump `version`.
