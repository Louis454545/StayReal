<p align="center">
  <img width="100%" src=".github/assets/banner.svg" alt="Banner for StayReal.">
</p>
<p align="center">
  <b>An open-source, lightweight and privacy-focused BeReal alternative client.</b>
</p>
<p align="center">
  <a href="https://github.com/Vexcited/StayReal/actions/workflows/nightly.yml">
    <img src="https://github.com/Vexcited/StayReal/actions/workflows/nightly.yml/badge.svg?branch=main" alt="Nightly Build Badge">
  </a>
  <a href="https://github.com/Vexcited/StayReal/tree/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/Vexcited/StayReal.svg?color=green" alt="License Badge">
  </a>
</p>

## 📥 Download

<table align="center">
  <tr>
    <th><br>
      <img src=".github/assets/windows.svg" width="40%" align="center" />
      <br><br><p align="center" bottom="15px">Windows</p>
    </th>
    <th><br>
      <img src=".github/assets/apple.svg" width="40%" align="center" />
      <br><br><p align="center">macOS</p>
    </th>
    <th><br>
      <img src=".github/assets/linux.svg" width="30%" align="center" />
      <br><br><p align="center">Linux</p>
    </th>
  </tr>

  <tr>
    <td width="30%">
      <div align="center">
        <b>x86_64</b> : <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-x86_64-pc-windows-msvc-msi.zip">&nearr;&nbsp;MSI</a>, <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-x86_64-pc-windows-msvc-nsis.zip">&nearr;&nbsp;NSIS</a>
        <br>
        <b>aarch64</b> : <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-aarch64-pc-windows-msvc-nsis.zip">&nearr;&nbsp;NSIS</a>
      </div>
    </td>
    <td width="30%">
      <div align="center">
        <b>aarch64</b> : <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-aarch64-apple-darwin-dmg.zip">&nearr;&nbsp;DMG</a>
        <br>
        <b>x86_64</b> : <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-x86_64-apple-darwin-dmg.zip">&nearr;&nbsp;DMG</a>
      </div>
    </td>
    <td width="40%">
      <div align="center">
        <b>x86_64</b> : <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-x86_64-unknown-linux-gnu-deb.zip">&nearr;&nbsp;DEB</a>, <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-x86_64-unknown-linux-gnu-rpm.zip">&nearr;&nbsp;RPM</a>, <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-x86_64-unknown-linux-gnu-appimage.zip">&nearr;&nbsp;AppImage</a>
        <br>
        <b>aarch64</b> : <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-aarch64-unknown-linux-gnu-deb.zip">&nearr;&nbsp;DEB</a>, <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-aarch64-unknown-linux-gnu-rpm.zip">&nearr;&nbsp;RPM</a>
        <br>
        <b>armv7</b> : <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-armv7-unknown-linux-gnueabihf-deb.zip">&nearr;&nbsp;DEB</a>, <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-armv7-unknown-linux-gnueabihf-rpm.zip">&nearr;&nbsp;RPM</a>
      </div>
    </td>
  </tr>
</table>

<table align="center">
  <tr>
    <th><br>
      <img src=".github/assets/android.svg" width="20%" align="center" />
      <div>
        <br><p align="center">Android (<code>.apk</code>)<br><i>These builds are signed.</i></p>
      </div>
    </th>
    <th><br>
      <img src=".github/assets/apple.svg" width="20%" align="center" />
      <div>
        <br><p align="center">iOS (<code>.ipa</code>)<br><i>This build is signed.</i></p>
      </div>
    </th>
  </tr>

  <tr>
    <td width="50%">
      <div align="center">
        <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-android-aarch64-apk.zip">&nearr;&nbsp;aarch64</a>
        <br>
        <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-android-x86_64-apk.zip">&nearr;&nbsp;x86_64</a>
        <br>
        <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-android-armv7-apk.zip">&nearr;&nbsp;armv7</a>
        <br>
        <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-android-i686-apk.zip">&nearr;&nbsp;i686</a>
      </div>
    </td>
    <td width="50%">
      <div align="center">
        <a href="https://nightly.link/Vexcited/StayReal/workflows/nightly/main/stayreal-ios-aarch64-ipa.zip">&nearr;&nbsp;aarch64</a>
      </div>
    </td>
  </tr>
</table>

## ✨ Features

### Authentication

> Note that accounts with parental control are not supported, if you have one, please open an issue so we can work on it.

- [ ] Automatically convert your phone number to international format
- [x] Send OTP
- [x] Verify OTP
- [x] Logout
- [x] Account creation
- [x] Account deletion (with 15 days cooldown)
- [x] Revert account deletion on login (within 15 days)
- [x] Keep user logged in (through a refresh token)

### User Profile

- [x] Informations
- [x] Realmojis
- [ ] Memories
- [ ] Pinned

### Others Profile

- [ ] Informations
- [ ] Pinned

### Upload

- [x] Post a new BeReal
- [ ] Flip camera
- [x] Take a photo from A side (primary image), wait for a few seconds, then take a photo from B side (secondary image)
- [ ] Caption
- [ ] Location
- [ ] Retry count

### Feed

- [x] See my posts in small view
- [ ] See comments on my posts (you can only see count)
- [ ] See reactions on my posts (you can only see a sample)
- [x] Comment under a post
- [x] See posts in large view (as a swiper of multiple posts)
- [x] See comments under a post (you can only see a sample)
- [x] See reactions on a post (you can only see a sample)
- [x] React to a post with your Realmojis
- [x] Open primary/secondary image in your browser (through image URL)

### Relationships

- [x] Search
- [x] Listing of friends
- [x] See sent friend requests
- [x] Unsend a sent friend request
- [x] See received friend requests
- [x] Accept a received friend request
- [x] Reject a received friend request
- [x] Send a friend request
- [ ] Unfriend someone
- [ ] Suggestions (mutuals, contacts, ...)

### Settings

- [ ] Notifications (removed, waiting for a proper solution)
- [ ] Update region for moments

### Advanced

Some advanced features that are not in the original application.

- [ ] Light mode
- [ ] Upload from gallery
- [ ] Manual camera (remove delay between primary image and secondary image, letting you to manually take the secondary image)
- [x] Cache today's feed data to device `localStorage` (for faster reloading), this is a temporary solution until we implement the task below
- [ ] Cache data to device local database (for faster reloading and offline access)

### Privacy

Only the necessary data is stored on the device, and the application does not collect any personal information.

- [x] No tracking
- [x] No analytics
- [x] No ads

## 🛠️ Development

### Prerequisites

Follow the instructions on the [&nearr;&nbsp;Tauri documentation](https://tauri.app/start/prerequisites/) to setup your environment depending on your operating system and target platform.

Also, make sure you have [&nearr;&nbsp;pnpm](https://pnpm.io) installed since it's the package manager used in this project.

### Quick start

```bash
git clone https://github.com/Vexcited/StayReal && cd StayReal

# Install dependencies
pnpm install

# Build internal-api
cd internal-api
pnpm install
pnpm build
cd ..

# Start development on desktop
pnpm tauri dev

# Start development on Android
pnpm tauri android dev

# Start development on iOS, only available on macOS
pnpm tauri ios dev
```

### Build for release

```bash
# Build for desktop
pnpm tauri build

# Build for Android
pnpm tauri android build

# Build for iOS, only available on macOS
pnpm tauri ios build
```

If you want to know more about the pipeline used to build the application, you can check the [&nearr;&nbsp;GitHub Actions workflow](.github/workflows/nightly.yml).

### Publication to stores

Every release, publication to stores, is triggered by [`pnpx tauri-version <bump> -m "chore: release v%s"`](https://github.com/s3xysteak/tauri-version) followed by `git push --follow-tags` so the [&nearr;&nbsp;release workflow](.github/workflows/release.yml) gets triggered by the tag push.

## 🙏 Acknowledgments

A lot of similar projects and researches have been made, and we would like to thank the authors for their work.

- [&nearr;&nbsp;BeFake, a BeReal Python API wrapper](https://github.com/Smart123s/BeFake)
- [&nearr;&nbsp;TooFake, an alternative web client](https://github.com/s-alad/toofake)
- [&nearr;&nbsp;BeUnblurred, an alternative web client](https://github.com/macedonga/beunblurred)
- [&nearr;&nbsp;Fowled's researches on the app](https://bereal.fowled.dev)
- [&nearr;&nbsp;userbradley's researches on the API](https://github.com/userbradley/BeReal)


## 📄 License

StayReal is licensed under the [&nearr;&nbsp;GNU General Public License v3.0 (GPL-3.0)](./LICENSE.md), a copyleft license that ensures users’ freedom to run, study, share, and modify the software. Licensed works, modifications, and larger works must also be distributed under GPL-3.0, and source code must be provided or made available.
