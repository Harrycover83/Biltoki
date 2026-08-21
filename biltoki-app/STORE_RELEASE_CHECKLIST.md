# Store Release Checklist (iOS + Android)

## 1. Identity and versioning
- Keep `expo.version` in `app.json` synced with product release version.
- iOS build number is auto-incremented by EAS (`eas.json` production profile).
- Android versionCode is auto-incremented by EAS (`eas.json` production profile).
- Bundle ids/packages must stay stable:
  - iOS: `com.biltoki.app`
  - Android: `com.biltoki.app`

## 2. Env configuration
- For store builds, set `EXPO_PUBLIC_SOCIOS_USE_MOCK=false`.
- Set `EXPO_PUBLIC_SOCIOS_API_BASE_URL` to production API.
- Keep secrets server-side only (no signing keys in client).

## 3. Mandatory store assets
- App icon (already set): `assets/icon.png`
- Android adaptive icons (already set): foreground/background/monochrome
- Splash icon (already present): `assets/splash-icon.png`
- Create App Store and Play screenshots (phone and optionally tablet).
- Prepare privacy policy URL and support URL.

## 4. Compliance and legal
- Verify permission usage text is clear and justified:
  - Location is already declared for nearest halles.
- Confirm data processing declarations for loyalty account, phone number, and analytics.
- App Store privacy nutrition labels and Google Data safety must match actual behavior.

## 5. Build commands
- Login once: `npx eas login`
- Configure project: `npx eas init`
- Production Android build: `npx eas build --platform android --profile production`
- Production iOS build: `npx eas build --platform ios --profile production`

## 6. Submit commands
- Android submit: `npx eas submit --platform android --profile production`
- iOS submit: `npx eas submit --platform ios --profile production`

## 7. Release gate before submit
- Run local checks:
  - `npm run build:web`
  - app smoke test on physical iOS and Android devices
- SOCIOS flow checks:
  - enroll by phone
  - generate pass
  - pass expiration/regeneration
  - no duplicate request on rapid taps

## 8. Post-release
- Monitor crashes and ANR rate (Android vitals, App Store diagnostics).
- Monitor pass generation error rate and API latency.
- Roll out gradually on Play (staged rollout) when possible.

## 9. Known remaining scope (planned later)
- Native Wallet pass integration (Apple/Google).
- Native NFC cashier tap integration.
- Cash register backend connection and token redemption endpoint.
