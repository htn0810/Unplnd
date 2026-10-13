# Module: profile-service

> **Status: Planned** — will be built after identity-service.

- *Planned:* owns *the person*: display name, avatar, friends, friend requests, preferences.
- *Planned:* MySQL (`profiles`, `friendships`, `friend_requests`, `user_preferences`), keyed by the identity `userId` (JWT `sub`).
- *Planned:* creates a profile on `USER_REGISTERED`; produces USER_UPDATED, FRIEND_REQUEST_SENT/ACCEPTED; consumes PLAN_COMPLETED (activity history).
- **Does NOT belong here:** credentials or tokens (identity-service).
