#!/bin/sh
set -eu
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
"$project_dir/scripts/studio.sh" site start --path "$project_dir/work/wordpress/site" --skip-browser --skip-log-details
/Users/minatosuzuki/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node "$project_dir/scripts/wordpress-snapshot.mjs"
open "$project_dir/work/wordpress/exports"
