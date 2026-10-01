#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node --test tests/*.test.cjs
env QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= QT_QUICK_CONTROLS_STYLE=Fusion \
  /usr/lib/qt6/bin/qmltestrunner -input tests/tst_modelsync.qml -import .
omarchy plugin validate .
echo 'Notched tests and Omarchy manifest validation passed.'
