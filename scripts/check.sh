#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node --test tests/*.test.cjs
omarchy plugin validate .
echo 'Notched tests and Omarchy manifest validation passed.'
