#!/bin/sh
set -eu
umask 077
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
origin='http://localhost:8881'
log_file="$project_dir/work/wordpress/launcher.log"
mkdir -p "$project_dir/work/wordpress"
ready() {
  /usr/bin/curl --fail --silent --max-time 3 "$origin/wp-login.php" > /dev/null 2>&1
}
if ! ready; then
  "$project_dir/scripts/studio.sh" site start --path "$project_dir/work/wordpress/site" --skip-browser --skip-log-details > "$log_file" 2>&1 || {
    printf '%s\n' 'WordPressの起動に失敗しました。' >&2
    exit 1
  }
fi
attempt=0
until ready; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 30 ]; then
    printf '%s\n' 'WordPressの起動を確認できませんでした。' >&2
    exit 1
  fi
  sleep 1
done
/usr/bin/open -a 'Google Chrome' "$origin/studio-auto-login?redirect_to=%2Fwp-admin%2Fadmin.php%3Fpage%3Dapps-editor"
