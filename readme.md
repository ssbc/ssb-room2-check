# SSB Room2 Check

> A CLI tool to manually test room 2.0 features

Uses your SSB ID at `~/.ssb`, so make sure you don't have other SSB apps open at the same time.

## Usage

```
$ npx ssb-room2-check --help

ssb-room2-check <command>

Commands:
  ssb-room2-check whoami                    Display info about the SSB feed used
                                            here
  ssb-room2-check claim <invite>            Claim an HTTP invite to become a
                                            member of the room
  ssb-room2-check sign-in <roomid>          Input the SSB ID of the room where
                                            to sign in
  ssb-room2-check sign-out <roomid>         Input the SSB ID of the room where
                                            to sign out
  ssb-room2-check alias-consume <alias>     Input an alias URL to connect to the
                                            alias's owner
  ssb-room2-check alias-register <roomid>   Input the SSB ID of the room and the
  <alias>                                   desired alias
  ssb-room2-check alias-revoke <roomid>     Input the SSB ID of the room and
  <alias>                                   your alias to be deleted

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]]
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


## Examples

Please notice that the sample data in these examples are fictitious and most likely will not work.

### First, let's consume some user's alias

```
$ npx ssb-room2-check alias-consume alice.scuttlebutt.eu

Consuming alias...
Success
```

Alternatively, you can also click on the SSB URI when visiting the page `alice.scuttlebutt.eu` in your browser.

### Then, let's claim an invite link to become a member

```
$ npx ssb-room2-check claim https://scuttlebutt.eu/join?invite=39c0ac1850ec9af14f1bb73

Claiming invite...
Connecting to the room...
Storing the room's address in ConnDB...
Success
```

Alternatively, instead of using the CLI, you can go to the invite link in your browser, and then click the SSB URI that it displays.

### Finally, let's sign-in with SSB

```
$ npx ssb-room2-check sign-in @zz+n7zuFc4wofIgKeEpXgB+/XQZB43Xj2rrWyD0QM2M=.ed25519

Connecting to the room...
Producing Sign-in URL...
Success. Open the following link in your browser within the next 2 minutes:


https://scuttlebutt.eu/login?cid=%40NGxQWnDZG0XNlfXRuENiJmdsjzGqty%2BjxF1enIHGL5M%3D.ed25519&cc=Mjk1GLG3zmhMzwN6GY7JTFIMYEc%2BygXcunMfj4vx%2Fw8%3D
```

Then, click the URL that was generated, and you should now be logged-in.

Alternatively, instead of using the CLI, you can go to the room's sign-in page, input your SSB ID (run `npx ssb-room2-check --whoami`) or alias, and then click the SSB URI that it displays.

### We can also sign-out

The following command should clear previous browser sessions:

```
$ npx ssb-room2-check sign-out @zz+n7zuFc4wofIgKeEpXgB+/XQZB43Xj2rrWyD0QM2M=.ed25519

Connecting to the room...
Invalidate all tokens...
Success
```

## License

MIT
