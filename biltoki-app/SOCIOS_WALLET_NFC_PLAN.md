# SOCIOS Wallet + NFC Implementation Plan

## Goal
Build a production-ready digital loyalty card for SOCIOS with a safe rollout:
1. MVP pass usable in store quickly
2. Native Wallet integration (Apple Wallet / Google Wallet)
3. Native NFC tap flow at checkout

This plan is designed for Expo + React Native app and Netlify web deployment, with a backend API (to be hosted separately from Netlify static web hosting).

## Current State
- App has SOCIOS UI and wallet-style card mock in `app/(tabs)/profil.tsx`
- Phone + OTP enrollment exists in the app
- Local session persistence exists in the app, bound to the current device
- No real backend identity/token service yet
- No signed Wallet pass generation yet
- No native NFC scanning/writing flow yet

## Account Creation Strategy
The customer account creation flow should be secured with phone verification:
- User enters phone number
- App requests a one-time SMS OTP
- User confirms the OTP
- Only then is the SOCIOS account enrolled/linked

This avoids fake account creation from arbitrary phone input on a mobile device.

## Session Security Strategy
After OTP verification, the backend should issue a device-bound session:
- Store a short-lived access token plus a refresh token
- Bind the session to a generated device identifier
- Allow only one active session per customer by default
- When a second phone logs in, revoke the previous session
- Keep the app logged in until logout, expiry, or server revocation

This gives the user a persistent login on one phone without enabling casual account sharing across multiple phones.

## Phase 1 - MVP Pass (QR first)
### Scope
- Add a real unique customer loyalty id (UUID format)
- Add a rotating short-lived pass token (JWT or signed opaque token)
- Show QR code in app for cashier scan
- Cashier endpoint validates token and credits points

### Why first
- Fastest way to go live in all stores
- Works on iOS/Android/web without native NFC complexity
- Gives transactional audit trail from day 1

### Backend requirements
- `POST /socios/enroll` -> create or bind customer by phone
- `GET /socios/card` -> returns card metadata + current points + reward tier
- `POST /socios/pass-token` -> returns short-lived signed token (30-90 sec)
- `POST /socios/scan-redeem` -> cashier system validates token and links bar ticket

### Security
- Token TTL <= 90 sec
- One-time nonce + replay protection
- Signature verification server-side only
- Rate limit by account + device
- Session is device-bound and revocable

### App tasks
- Add auth/session binding for customer id
- Add QR card modal from SOCIOS screen
- Poll card balance after successful scan
- Add error states: expired token, network lost, already used

### Estimation
- Backend: 4-6 dev days
- App: 2-3 dev days
- QA + pilot in one hall: 2 dev days
- Total: ~2 weeks

## Phase 2 - Wallet Native Passes
### Scope
- Apple Wallet pass generation (`.pkpass`) with signing certificate
- Google Wallet pass object/class creation
- In-app CTA: Add to Wallet
- Pass fields: name, loyalty id, points, tier, hall favorite, dynamic update timestamp

### Why second
- Better user retention and quick access from lock screen/wallet
- Reduces friction at checkout

### Backend requirements
- `POST /wallet/apple/pass` -> signed pkpass binary
- `POST /wallet/google/object` -> create/update wallet object and return save link
- Webhook/update job for points sync to wallet providers

### Platform setup
- Apple Developer pass type id + certificate chain
- Google Wallet issuer account and service credentials
- Secrets in secure vault (not in client)

### App tasks
- Detect platform and route to Apple/Google add flow
- Show wallet state in SOCIOS card section
- Retry + fallback to QR if wallet add fails

### Estimation
- Backend + credentials setup: 5-8 dev days
- App integration: 2-3 dev days
- End-to-end validation: 2 dev days
- Total: ~2 to 3 weeks

## Phase 3 - Native NFC
### Scope
- Tap phone at cashier NFC reader (or phone-to-terminal compatible flow)
- Secure payload exchange with backend validation
- Fallback automatically to QR if NFC unavailable

### Technical note
NFC in Expo usually needs native modules/workflow for full control.
Recommended path: prebuild or custom dev client when implementing production NFC.

### Backend requirements
- Challenge-response API for NFC sessions
- Device trust and anti-relay checks
- Event log per tap with hall/cashier metadata

### App tasks
- Integrate NFC module in native workflow
- UX states: ready to tap, reading, success, failed
- Feature flags by hall (pilot activation)

### Estimation
- Native app + backend: 8-12 dev days
- Store pilot + hardware validation: 4-6 dev days
- Total: ~3 to 4 weeks

## Suggested Data Model (minimal)
- `customer`: id, phone, createdAt, hallFavorite, consentFlags
- `loyalty_account`: customerId, pointsBalance, tier, lastAccrualAt
- `loyalty_event`: id, customerId, hallId, ticketId, amountEur, pointsDelta, source, createdAt
- `pass_token`: jti, customerId, expiresAt, usedAt, issuedDevice
- `wallet_binding`: customerId, platform, walletObjectId, status, updatedAt
- `nfc_event`: id, customerId, terminalId, challengeId, status, createdAt

## Rollout Strategy
1. Pilot 1 hall with QR only
2. Expand to all halls with QR stable
3. Enable Wallet add gradually
4. Launch NFC in 1-2 halls with compatible terminals
5. Generalize after success metrics

## Success Metrics
- Enrollment rate (% bar customers joining SOCIOS)
- Scan success rate at first attempt
- Average checkout time impact
- Wallet add conversion rate
- NFC success rate and fallback rate
- Fraud/replay incidents (target 0)

## Immediate Next Sprint (recommended)
1. Define API contracts for Phase 1
2. Build token service + scan validation endpoint
3. Add QR modal in SOCIOS screen
4. Pilot with one hall and cashier workflow

## Risks and Mitigations
- Terminal compatibility risk: start with QR baseline
- Wallet credential setup delay: parallelize with backend MVP
- NFC device variance: rollout via feature flags and hall pilots
- Fraud/replay risk: short TTL + nonce + server validation

## Done Criteria for Phase 1
- User can open SOCIOS card and present scannable QR
- Cashier scan credits points reliably
- Duplicate/replay scan blocked
- User sees updated points in app within seconds
- Support team can audit events by customer/ticket

## Quality Gates and Error Controls
Use this checklist before each release candidate:

### App-side checks
- Buttons guarded against double taps while async calls are pending
- Expired pass token cannot be displayed as valid QR
- Pass modal close clears stale token state
- Card loading state does not block full screen interaction unexpectedly
- Fallback message shown when pass generation fails

### API-side checks
- Pass token TTL enforced server-side regardless of client timer
- Replay protection validated by `jti`/nonce uniqueness
- Reject malformed payloads and unknown loyalty ids
- Rate limiting active on pass generation and redemption
- Structured logs emitted for enroll/token/redeem outcomes

### Security checks
- No signing secret in client code
- HTTPS only for all SOCIOS API calls
- CORS and auth controls validated for cashier endpoints
- Audit event includes hallId, terminalId, ticketId, and actor metadata

### Operational checks
- Pilot hall dry-run with real cashier sequence completed
- Recovery procedure documented for network outage at checkout
- Dashboard alerts configured for elevated redeem failures
- Rollback switch available (force QR-only and/or mock fallback off)
