# SOCIOS Service Integration Notes

## Runtime config
Use Expo public env vars:

- `EXPO_PUBLIC_SOCIOS_USE_MOCK`
  - `true` (default) -> use in-app mock service
  - `false` -> call backend API
- `EXPO_PUBLIC_SOCIOS_API_BASE_URL`
  - Example: `https://api.your-domain.com`

## API behavior expected by app
The app expects endpoints and schemas defined in `contracts.ts`:
- `POST /socios/enroll`
- `GET /socios/card`
- `POST /socios/pass-token`

Pass token must be short-lived (<= 90s) and validated server-side at cashier redemption.

## Pass QR payload format
The QR payload is JSON built by `passPayload.ts`:

```json
{
  "v": 1,
  "t": "TOKEN",
  "n": "NONCE",
  "l": "LOYALTY_ID",
  "e": "ISO_EXPIRY"
}
```

## Manual test sequence
1. Open `Socios` tab and wait card to load.
2. Update phone and confirm enroll flow.
3. Tap `Presenter en caisse`.
4. Verify QR appears and countdown decreases every second.
5. Wait expiration and verify fallback message appears.
6. Tap `Regenerer un pass` and confirm a new token is issued.

## Common failure checks
- If card is missing, pass generation must be blocked.
- If pass expired, QR should not be shown as valid.
- Buttons should be disabled during async actions to avoid duplicate requests.
