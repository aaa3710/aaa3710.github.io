#!/bin/sh
set -eu
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
application="$HOME/Applications/Webサイト編集.app"
desktop_entry="$HOME/Desktop/Webサイト編集.app"
if [ -e "$application" ] || [ -e "$desktop_entry" ] || [ -L "$desktop_entry" ]; then
  printf '%s\n' '既存のWebサイト編集の入口があります。上書きせず終了します。' >&2
  exit 1
fi
mkdir -p "$HOME/Applications"
staging=$(mktemp -d)
trap 'rm -rf "$staging"' EXIT
# osacompile stores only the launcher path; no login credentials are embedded.
/usr/bin/osascript - "$project_dir/scripts/open-wordpress.sh" > "$staging/launcher.applescript" <<'APPLESCRIPT'
on run argv
  set launcherPath to item 1 of argv
  set shellCommand to "/bin/sh " & quoted form of launcherPath
  set escapedCommand to my replaceText("\\", "\\\\", shellCommand)
  set escapedCommand to my replaceText("\"", "\\\"", escapedCommand)
  return "on run\n  try\n    do shell script \"" & escapedCommand & "\"\n  on error\n    display alert \"WordPressを開けませんでした\" message \"Codexに「Webサイト編集が開かない」と伝えてください。編集した内容はこのMac内に保存されています。\" as warning\n  end try\nend run\non reopen\n  run\nend reopen\n"
end run
on replaceText(needle, replacement, original)
  set AppleScript's text item delimiters to needle
  set pieces to text items of original
  set AppleScript's text item delimiters to replacement
  set resultText to pieces as text
  set AppleScript's text item delimiters to ""
  return resultText
end replaceText
APPLESCRIPT
/usr/bin/osacompile -o "$staging/Webサイト編集.app" "$staging/launcher.applescript"
/usr/libexec/PlistBuddy -c 'Add :CFBundleIdentifier string local.minato.wordpress-editor-launcher' "$staging/Webサイト編集.app/Contents/Info.plist"
/usr/libexec/PlistBuddy -c 'Add :LSUIElement bool true' "$staging/Webサイト編集.app/Contents/Info.plist"
/usr/bin/codesign --force --sign - --timestamp=none "$staging/Webサイト編集.app"
cp -R "$staging/Webサイト編集.app" "$application"
ln -s "$application" "$desktop_entry"
printf '%s\n' 'デスクトップとアプリケーションに「Webサイト編集」を作成しました。'
