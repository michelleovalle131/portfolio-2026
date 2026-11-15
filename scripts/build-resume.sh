#!/bin/sh
# Prints resume/resume.html to public/Michelle_Ovalle_Resume.pdf with
# headless Chrome (US Letter; margins and size come from the page's CSS).
set -e
cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT="public/Michelle_Ovalle_Resume.pdf"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --allow-file-access-from-files \
  --no-pdf-header-footer \
  --virtual-time-budget=3000 \
  --print-to-pdf="$OUT" \
  "file://$PWD/resume/resume.html" 2>/dev/null

echo "Wrote $OUT"
