#!/bin/sh
set -eu
umask 077
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
backup_directory="$project_dir/work/wordpress/backups"
mkdir -p "$backup_directory"
backup_file="$backup_directory/$(date '+%Y-%m-%d_%H-%M-%S')-complete.tar.gz"
/Users/minatosuzuki/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node "$project_dir/scripts/wordpress-backup.mjs" --path "$project_dir/work/wordpress/site" --output "$backup_file"
open "$backup_directory"
