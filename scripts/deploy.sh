#!/usr/bin/env bash
# deploy.sh — DjangoPlay Website Deployment
#
# PURPOSE:
#   This script automates the production deployment of the DjangoPlay Website.
#
# USAGE:
#   This script is designed to be triggered by GitLab CI, but can be run manually:
#   ssh {{server}} 'bash ~path/to/scripts/deploy.sh'
#
# WHERE TO RUN:
#   Production Server within the application root.
#
# PREREQUISITES:
#   - Provide [deploy_paths] site_dir
#   - NOPASSWD sudoers entry for 'systemctl restart {service_name}'.
#   - SSH key for GitLab configured

# This script does NOT restart Nginx — the files are served directly
# as static assets, so no restart is needed for content changes.
# If you update nginx-snippet.conf, reload Nginx manually:
#   sudo nginx -t && sudo systemctl reload nginx

set -euo pipefail

CONFIG_FILE="$HOME/.dplay/config.yaml"

# SAFE GUARD: Check if we are on a configured server
if [ ! -f "$CONFIG_FILE" ]; then
    echo "⚠️  Skipping deploy: Configuration file not found at $CONFIG_FILE."
    echo "This script is intended to run on the production server."
    exit 0
fi

get_config() {
    python3 -c "import yaml; print(yaml.safe_load(open('$CONFIG_FILE'))['deploy_paths']['$1'])"
}

# Pass 'site_dir' as the first argument
TARGET_KEY="${1:-site_dir}" 
TARGET_DIR=$(get_config "$TARGET_KEY")

echo "━━━ DjangoPlay Deploy: $TARGET_KEY ━━━━━━━━━━━━━━━━━━━━"
cd "$TARGET_DIR"

echo "→ Pulling latest changes..."
git fetch origin
git reset --hard "origin/main"

# Only run injection if repo uses compiled dist
if [ -f "inject_config.py" ]; then
    echo "→ Injecting environment configuration..."
    python3 inject_config.py
fi

echo "→ Setting permissions..."
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod +x scripts/deploy.sh

echo "─────────────────────────────────────────────────────────"
COMMIT=$(git log -1 --format="%h  %s  (%ar)")
echo "  Success: $TARGET_KEY updated to $COMMIT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"