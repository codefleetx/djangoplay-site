import yaml
import json
import os
from pathlib import Path

def inject():
    # 1. Load source of truth from your home directory
    config_path = Path.home() / ".dplay" / "config.yaml"
    
    if not config_path.exists():
        print(f"❌ Error: {config_path} not found.")
        return

    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)

    # 2. Extract site details
    site_cfg = config.get('site', {})
    protocol = site_cfg.get('protocol', 'https')
    host = site_cfg.get('host', 'localhost')
    port = site_cfg.get('port', '')

    # 3. Construct base host string (handle port for localhost)
    is_local = host in ['localhost', '127.0.0.1']
    host_suffix = f"{host}:{port}" if is_local and port else host

    # 4. Construct URLs
    # Docs: https://docs.localhost:9999/ (Docs domain)
    docs_url = f"{protocol}://docs.{host_suffix}/"
    
    # Platform: https://localhost:9999/ (Main domain)
    platform_url = f"{protocol}://{host_suffix}/accounts/login/"
    
    # Issues: https://issues.localhost:9999/ (Issues domain)
    issues_url = f"{protocol}://issues.{host_suffix}/"
    
    # Website: https://djangoplay.org (Production)
    website_url = f"https://djangoplay.org/"

    # 5. Save to a JSON file the website can fetch
    output_data = {                
        "PLATFORM_URL": platform_url,
        "WEBSITE_URL": website_url,
        "DOCS_URL": docs_url,
        "ISSUES_URL": issues_url,
    }

    # Ensure the directory exists
    output_path = Path("assets/json/site_config.json")
    os.makedirs(output_path.parent, exist_ok=True)

    with open(output_path, 'w') as f:
        json.dump(output_data, f, indent=2)

    print(f"✅ Website config synced from YAML.")
    print(f"   Website: {website_url}")
    print(f"   Platform Base: {platform_url}")
    print(f"   Docs: {docs_url}")
    print(f"   Issues: {issues_url}")

if __name__ == "__main__":
    inject()