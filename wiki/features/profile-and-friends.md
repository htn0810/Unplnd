# Feature: Profile & Friends

**Status: Implemented on mock data** (web). profile-service planned.

## Today

`/profile` shows the current user's profile (mock `me.json` / `profile.json`); Home shows "friends around". Data via `useMe`, `useProfile`, `useFriendsAround`.

## Planned

- *Planned:* profile-service owns display name, avatar, friends, friend requests, preferences, keyed by the identity `userId`.
- *Planned:* profile created on `USER_REGISTERED`; friend actions emit FRIEND_REQUEST_SENT/ACCEPTED → notifications.
- Credentials and tokens stay in identity-service — see [auth](auth.md).

## Modules

[web](../modules/web.md) · [profile-service](../modules/profile-service.md) *(planned)*
