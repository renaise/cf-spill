# Cracked → TestFlight

TestFlight will not take a PWA. It distributes signed native binaries only, so the
web app has to be wrapped in a real iOS app before any of this applies.

Read the three blockers first. Two of them are product work, not paperwork, and one
of them is the reason to think hard about whether the App Store is wanted at all.

---

## Blockers, before you spend the $99

**1. Guideline 1.2 — user-generated content.** Any app carrying UGC must ship four
things: a way to filter objectionable content, a mechanism for users to report it,
a way to block abusive users, and published contact information for the developer.
Apple enforces this and the expectation is that reports are acted on within 24 hours.

Cracked currently has none of them. A report button and a named takedown process are
prerequisites for submission, not follow-ups. Budget this as real work.

**2. Guideline 4.2 — minimum functionality.** An app that is a web view wrapped around
a website gets rejected as not providing app-like experience. The wrapper needs genuine
native capability to clear it: push notifications when a record you filed gets a source,
a share extension so a claim can be sent to Cracked from Twitter, offline reading of the
archive. The share extension is the strongest one and also the best product feature, so
build that.

**3. Platform risk, which is the strategic one.** Apple has removed apps that facilitate
harassment of named individuals. Cracked publishes checkable claims about real founders,
and a named subject with a lawyer has an obvious lever: complain to Apple rather than sue
you. The PWA has no such lever, which is why it stays the primary surface regardless of
what happens with the native build. **Do not let the native app become the only way in.**

---

## Faster paths that skip all of this

**Your own phone, right now, zero dollars.** Open the PWA in Safari, Share, Add to Home
Screen. It installs with the icon, launches without browser chrome, and works offline.
For dogfooding this is the whole job.

**Your own device natively, free.** Xcode free provisioning signs a build onto a device
you own with a 7-day certificate. No Developer Program, no review. Good for testing
native capability before paying.

TestFlight is only necessary when you need the build on other people's phones.

---

## The actual steps

### 1. Apple Developer Program
Enroll at developer.apple.com, $99/year. Individual is fine to start, but note the
app will be published under your personal legal name if you do. An organization
enrollment publishes under Codex Foundry and requires a D-U-N-S number, which takes
one to two weeks. **If the entity matters here, and it does, start the D-U-N-S now
because it is the long pole.**

### 2. Wrap it with Capacitor

```bash
cd ~/afxhq/Websites/cf-spill
npm init -y
npm i @capacitor/core @capacitor/cli @capacitor/ios
npx cap init Cracked com.codexfoundry.cracked --web-dir=app
npx cap add ios
npx cap sync
npx cap open ios
```

`--web-dir=app` points Capacitor at the existing PWA directory, so there is no build
step and no duplicate copy of the UI. The bundle ID `com.codexfoundry.cracked` must
match what you register in App Store Connect exactly, and it cannot be changed later.

### 3. Xcode configuration
In the opened project, select the target, then Signing & Capabilities. Pick your team
and let Xcode manage signing. Set the display name to Cracked, set version to 0.1.0 and
build to 1. Add the icon set from `app/icon-512.png`.

Set the deployment target to iOS 15 or later. Confirm the status bar is light, since the
UI is black.

### 4. Create the App Store Connect record
At appstoreconnect.apple.com, My Apps, new app. Select the same bundle ID. This record
must exist before a build can be uploaded to it.

### 5. Archive and upload
In Xcode set the destination to Any iOS Device, then Product, Archive. When the
Organizer opens, Distribute App, TestFlight & App Store, Upload. Processing takes
roughly five to thirty minutes.

You will be asked about export compliance. The app uses only standard HTTPS, which is
exempt, so answer accordingly. Adding `ITSAppUsesNonExemptEncryption` set to `false` in
Info.plist stops it asking on every build.

### 6. Distribute

**Internal testers.** Up to 100 people, each of whom must hold a role on your App Store
Connect team. **No Beta App Review.** The build is available within minutes of finishing
processing. This is the path for you and anyone you trust.

**External testers.** Up to 10,000 people via a public link. **Requires Beta App Review**,
usually 24 to 48 hours. Lighter than full App Store review but it is still a human
reading your app, and Guideline 1.2 is exactly what they check on a UGC app. Do not
attempt external distribution until the report-and-takedown mechanism is real.

### 7. Know the expiry
TestFlight builds stop working after 90 days. Upload a fresh build before then or your
testers are locked out with no warning.

---

## Order of operations

1. Ship the PWA and get it on your own home screen. Done.
2. Add the report mechanism and the takedown process. Required for any App Store path.
3. Build the share extension. It clears Guideline 4.2 and it is the best feature anyway.
4. Start the D-U-N-S number if the app should belong to Codex Foundry rather than to you.
5. Only then wrap, archive, and upload.
