# SSB Room2 Check

> A CLI tool to manually test room 2.0 features

## Usage

```
$ npx ssb-room2-check --help

ssb-room2-check [opts]

Options:
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  --whoami         Display info about the dummy SSB feed used here     [boolean]
  --consume-alias  Input an alias URL to connect to the alias's owner   [string]
  --sign-in        Input the multiserver address of server to login to  [string]
```

## Custom URI Setup

This tool can also be the target application for SSB URIs such as `ssb:experimental?action=consume-alias&.....`. However, this requires you to configure your desktop operating system.

### Linux

Create the file `~/.local/share/applications/ssb-room2-check.desktop`:

```
[Desktop Entry]
Version=1.1
Type=Application
Name=SsbRoom2Check
GenericName=SSB App
Comment=Check Room2 features
Icon=applications-other
Exec=npx ssb-room2-check %U
Terminal=true
MimeType=x-scheme-handler/ssb;
Categories=FileTransfer;Network;P2P;
```

Modify the file `~/.local/share/applications/defaults.list` (or, if that doesn't work, then `~/.local/share/applications/mimeapps.list`):

```diff
[Default Applications]
 x-scheme-handler/http=firefox.desktop;google-chrome.desktop
 x-scheme-handler/https=firefox.desktop;google-chrome.desktop
 x-scheme-handler/dat=appimagekit-beaker-browser.desktop
+x-scheme-handler/ssb=ssb-room2-check.desktop
```

### macOS

Not yet supported.

### Windows

Not yet supported.

## Roadmap

- [x] Alias consumption
  - [x] URI-spawn on `consume-alias`, then muxrpc-connect to the room, then tunnel-connect to the alias owner
  - [x] CLI cmd to input alias URL, which will then JSON fetch details, then muxrpc-connect to the room, then tunnel-connect to the alias owner
- [x] Sign-in with SSB
  - [x] CLI cmd to generate sign-in URL, then stay up for 2 minutes so the browser has time to log in
  - [x] URI-spawn on `start-http-auth`, then send solution to the server
- [ ] Invites
  - [ ] URI-spawn on `join-room`, then submit ID to `submissionUrl`, then muxrpc-connect to the room
  - [ ] CLI cmd to consume the invite URL, adds ?encoding=json, then muxrpc-connect to the room
- [ ] Instructions
  - [ ] 1st consume alias as a non-member
  - [ ] 2nd consume invite to become member
  - [ ] 3rd sign-in

## License

MIT
