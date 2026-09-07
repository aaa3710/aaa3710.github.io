#!/bin/sh
set -eu
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
"$project_dir/scripts/studio.sh" site start --path "$project_dir/work/wordpress/site" --skip-browser --skip-log-details
open -a 'Google Chrome' 'http://localhost:8881/studio-auto-login?redirect_to=%2Fwp-admin%2Fadmin.php%3Fpage%3Dapps-editor'
