#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Applies the GCP-billing-independence patch to your two projects.
#
# USAGE (run from inside this extracted "patch" folder):
#   ./apply-patch.sh /path/to/your/"Exam is Near" /path/to/your/cloudflare-worker
#
# Example (drag-and-drop the folders instead of typing paths):
#   ./apply-patch.sh /Users/you/Projects/Exam\ is\ Near /Users/you/Projects/cloudflare-worker
#
# What it does:
#   - Copies 4 files into your Firebase project (public/js/core + features)
#   - Copies 2 files into your Cloudflare Worker project (src/ + wrangler.toml)
#   - Backs up every file it overwrites as <filename>.bak-YYYYMMDD-HHMMSS
#     first, so nothing is ever lost — you can always undo by hand.
#   - Does NOT run wrangler deploy or firebase deploy — you still need
#     to do that yourself afterward, see the checklist you were given.
# ─────────────────────────────────────────────────────────────────
set -e

EIN_ROOT="$1"
WORKER_ROOT="$2"

if [ -z "$EIN_ROOT" ] || [ -z "$WORKER_ROOT" ]; then
  echo "Usage: ./apply-patch.sh <path-to-Exam-is-Near-folder> <path-to-cloudflare-worker-folder>"
  echo ""
  echo "Tip: you can drag each folder from your file explorer into the terminal"
  echo "     after typing ./apply-patch.sh and a space, instead of typing the path."
  exit 1
fi

if [ ! -d "$EIN_ROOT/public/js" ]; then
  echo "❌ '$EIN_ROOT' doesn't look like your Exam Is Near project (no public/js folder found)."
  exit 1
fi
if [ ! -f "$WORKER_ROOT/wrangler.toml" ]; then
  echo "❌ '$WORKER_ROOT' doesn't look like your Worker project (no wrangler.toml found)."
  exit 1
fi

STAMP=$(date +%Y%m%d-%H%M%S)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

backup_and_copy () {
  SRC="$1"
  DEST="$2"
  if [ -f "$DEST" ]; then
    cp "$DEST" "$DEST.bak-$STAMP"
    echo "  ↳ backed up existing file to $(basename "$DEST").bak-$STAMP"
  fi
  cp "$SRC" "$DEST"
  echo "  ✅ wrote $DEST"
}

echo "── Patching Exam Is Near frontend ──"
backup_and_copy "$SCRIPT_DIR/exam-is-near/public/js/core/app-state.js"        "$EIN_ROOT/public/js/core/app-state.js"
backup_and_copy "$SCRIPT_DIR/exam-is-near/public/js/core/firebase-sync.js"    "$EIN_ROOT/public/js/core/firebase-sync.js"
backup_and_copy "$SCRIPT_DIR/exam-is-near/public/js/features/payments-pro.js"     "$EIN_ROOT/public/js/features/payments-pro.js"
backup_and_copy "$SCRIPT_DIR/exam-is-near/public/js/features/files-materials.js" "$EIN_ROOT/public/js/features/files-materials.js"

echo ""
echo "── Patching Cloudflare Worker ──"
backup_and_copy "$SCRIPT_DIR/cloudflare-worker/src/index.js"    "$WORKER_ROOT/src/index.js"
backup_and_copy "$SCRIPT_DIR/cloudflare-worker/wrangler.toml"   "$WORKER_ROOT/wrangler.toml"

echo ""
echo "✅ All 6 files patched. Nothing was deployed yet — still to do:"
echo "   1. cd \"$WORKER_ROOT\" && npx wrangler r2 bucket create exam-is-near-files"
echo "   2. npx wrangler secret put RZP_KEY_ID"
echo "   3. npx wrangler secret put RZP_KEY_SECRET"
echo "   4. npx wrangler deploy"
echo "   5. cd \"$EIN_ROOT\" && firebase deploy --only hosting"
