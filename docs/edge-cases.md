# SwiftDrop Edge Cases Covered

1. Oversell protection under simultaneous purchase requests
- Redis Lua `DECR` is atomic per item key.
- Requests beyond stock return `SOLD_OUT`.

2. Duplicate purchase attempts by same user
- Backend rejects second purchase for same `userId + eventId + itemId` unless previous order was cancelled.

3. Event not live purchase attempts
- Backend checks event status before reservation and rejects with clear message.

4. Sold-out state propagation
- Live stock updates are emitted via Socket.IO.
- When all event items reach zero stock, event transitions to `SOLD_OUT`.

5. Payment cancellation after reservation
- Cancel endpoint releases stock back to Redis immediately.

6. Auth/session misuse
- Protected routes require valid JWT cookie.
- Logged-out tokens are blacklisted in Redis until expiration.
- Deactivated users are blocked on protected API access.

7. Admin authorization enforcement
- Admin endpoints enforce `requireAdmin` guard.

8. Structured API error responses
- All errors return JSON shape (`success`, `message`, `code`).
