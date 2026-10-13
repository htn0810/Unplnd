# Feature: Notifications

**Status: Implemented on mock data** (web). Backend planned.

## Today

`/notifications` lists mock notifications grouped Today / Earlier with read/unread state and mark-as-read actions. Types: PLAN_VOTE_CAST, PLAN_MEMBER_JOINED, PLAN_CONFIRMED, PLAN_COMPLETED, FRIEND_REQUEST_SENT, FRIEND_REQUEST_ACCEPTED. The header bell shows an unread count.

## Planned

- *Planned:* notification-service consumes plan and friend events, stores them in MongoDB, pushes `NOTIFICATION_CREATED` to `/user/queue/...`.
- *Planned:* notification preferences; email/push later.

## Modules

[web](../modules/web.md) · [notification-service](../modules/notification-service.md) *(planned)*
