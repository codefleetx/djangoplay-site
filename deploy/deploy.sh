#!/usr/bin/env bash
# deploy.sh — DjangoPlay Site Deploy
#
# Usage:
#   cd /var/www/djangoplay/landing
#   ./deploy/deploy.sh
#
# What it does:
#   1. Pulls latest from GitLab main branch
#   2. Sets correct file permissions for Nginx (www-data readable)
#   3. Prints a summary
#
# Prerequisites:
#   - SSH key for GitLab is configured on the server
#   - Script is executable: chmod +x deploy/deploy.sh
#
# This script does NOT restart Nginx — the files are served directly
# as static assets, so no restart is needed for content changes.
# If you update nginx-snippet.conf, reload Nginx manually:
#   sudo nginx -t && sudo systemctl reload nginx

set -euo pipefail

SITE_DIR="/var/www/djangoplay/landing"
BRANCH="main"

echo "━━━ DjangoPlay Site Deploy ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Directory : $SITE_DIR"
echo "  Branch    : $BRANCH"
echo "─────────────────────────────────────────────────────────"

cd "$SITE_DIR"

# Pull latest
echo "→ Pulling latest changes..."
git fetch origin
git reset --hard "origin/$BRANCH"
echo "  Done."

# Permissions: directories 755, files 644
echo "→ Setting file permissions..."
find "$SITE_DIR" -type d -exec chmod 755 {} \;
find "$SITE_DIR" -type f -exec chmod 644 {} \;
# Re-make deploy script executable
chmod +x "$SITE_DIR/deploy/deploy.sh"
echo "  Done."

# Summary
echo "─────────────────────────────────────────────────────────"
COMMIT=$(git log -1 --format="%h  %s  (%ar)")
echo "  Deployed : $COMMIT"
echo "  Site     : https://djangoplay.org/"
echo "  Portfolio: https://djangoplay.org/developer/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"