# Spill → TestFlight

TestFlight will not take a PWA. It distributes signed native binaries only, so the
web app has to be wrapped in a real iOS app before any of this applies.

**The wrapper now exists.** `ios/` is a Capacitor project that builds and runs. What
remains is an Apple account, signing, and the upload. Steps 2 and 3 below are done;
start at step 1, then skip to step 4.

The three blockers below gate **external** distribution and the App Store. They do not
gate internal TestFlight, which takes no Beta App Review (see step 6). So they are not
a reason to delay getting a build onto your own team's phones.

---

## Blockers, before you spend the $99

**1. Guideline 1.2 — user-generated content.** Any app carrying UGC must ship four
things: a way to filter objectionable content, a mechanism for users to report it,
a way to block abusive users, and published contact information for the developer.
Apple enforces this and the expectation is that reports are acted on within 24 hours.

Spill currently has none of them. A report button and a named takedown process are
prerequisites for submission, not follow-ups. Budget this as real work.

**2. Guideline 4.2 — minimum functionality.** An app that is a web view wrapped around
a website gets rejected as not providing app-like experience. The wrapper needs genuine
native capability to clear it: push notifications when a record you filed gets a source,
a share extension so a claim can be sent to Spill from Twitter, offline reading of the
archive. The share extension is the strongest one and also the best product feature, so
build that.

**3. Platform risk, which is the strategic one.** Apple has removed apps that facilitate
harassment of named individuals. Spill publishes checkable claims about real founders,
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

### 2. Wrap it with Capacitor — DONE

`capacitor.config.json` points `webDir` at `app/`, so the native shell serves the same
files GitHub Pages does. There is no build step and no second copy of the UI. After any
change to `app/`, run:

```bash
npx cap sync ios
```

The bundle ID is `com.codexfoundry.spill`. It must match the App Store Connect record
exactly and it cannot be changed later.

Capacitor 7 uses Swift Package Manager, so there is no Podfile and no `pod install`.

### 3. Xcode configuration — DONE

Set in `ios/App/App/Info.plist` and the project file, verified by a simulator build:

- Display name Spill, version 1.0, build 1, deployment target iOS 15.
- Portrait only on both iPhone and iPad. The feed is a vertical pager; landscape has
  no design.
- Light status bar text, set globally rather than per view controller.
- Launch screen black. The Capacitor default was `systemBackgroundColor`, which
  flashed white before the shell painted.
- `arm64` in `UIRequiredDeviceCapabilities`, replacing the template's `armv7`.
- `ITSAppUsesNonExemptEncryption` false, so uploads stop asking about export
  compliance.
- App icon and splash generated at 1024 and 2732 from the Spill mark.

**What is not done, and only you can do it:** Signing & Capabilities needs your team
selected. That requires the Apple Developer account from step 1.

To build it yourself:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer   # once, if needed
npx cap open ios
```

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
2. Wrap it natively so there is something to sign. Done.
3. Enroll in the Developer Program, and start the D-U-N-S number if the app should
   belong to Codex Foundry rather than to you. The D-U-N-S is the long pole at one to
   two weeks, so start it first even though it blocks nothing else here.
4. Archive and upload to **internal** TestFlight. No review, so this can happen the
   day the account clears.
5. Add the report mechanism and a named takedown process. Required before external.
6. Build the share extension. It clears Guideline 4.2 and it is the best feature anyway.
7. Only then open external testing.
