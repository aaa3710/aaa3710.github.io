#!/bin/sh
set -eu
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
runtime_dir="/Users/minatosuzuki/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
export PATH="$runtime_dir:$PATH"
exec "$project_dir/work/wordpress-cli/node_modules/.bin/studio" "$@"
