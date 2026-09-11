#!/usr/bin/env bash
#
# remove-demo.sh - Remove the demo pages from this starter kit.
#
# Automates the "Removing both" contract documented in the README: it deletes
# the demo's three self-contained directories, restores the core /dashboard
# route, unregisters the demo service provider, removes the demo's navigation
# entry, drops the demo_vehicles table, and clears cached config and routes.
#
# It deliberately leaves chart.js in package.json - remove that yourself if you
# want it gone (npm uninstall chart.js). When it finishes, it deletes itself,
# because a starter kit with no demo has no use for a demo-removal script.
#
# Usage:
#   ./remove-demo.sh          # asks for confirmation first
#   ./remove-demo.sh --yes    # skip the confirmation prompt (-y)
#
set -euo pipefail

# Resolve this script's own path before we cd, so it can delete itself later.
script_path="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
cd "$(dirname "$script_path")"

# --- parse arguments -------------------------------------------------------
assume_yes=0
for arg in "$@"; do
    case "$arg" in
        -y|--yes) assume_yes=1 ;;
        -h|--help)
            awk 'NR>=3 { if ($0 !~ /^#/) exit; sub(/^# ?/, ""); print }' "$script_path"
            exit 0
            ;;
        *) echo "unknown option: $arg (try --help)" >&2; exit 1 ;;
    esac
done

# --- sanity checks ---------------------------------------------------------
if [[ ! -f artisan || ! -f composer.json ]]; then
    echo "error: run this from the project root (artisan/composer.json not found)." >&2
    exit 1
fi

if [[ ! -d app/Demo ]]; then
    echo "The demo looks already removed (app/Demo is gone). Nothing to do."
    exit 0
fi

# --- confirm ---------------------------------------------------------------
if [[ "$assume_yes" -ne 1 ]]; then
    cat <<'EOF'
This will permanently remove the demo from this starter kit:

  - delete   app/Demo, resources/js/Pages/Demo, tests/Feature/Demo
  - restore  the /dashboard route to DashboardController
  - remove   the demo service provider and the Vehicles nav entry
  - drop     the demo_vehicles database table
  - clear    cached config and routes

chart.js is left in package.json for you to remove.

EOF
    printf 'Continue? (yes/no) [no]: '
    read -r reply
    case "$reply" in
        yes|YES|y|Y) ;;
        *) echo "Aborted."; exit 1 ;;
    esac
fi

echo
echo "Removing the demo..."

# 1. Drop the demo table while the app can still boot. Best-effort: a fresh
#    clone that never migrated has no table, and that is fine.
if php artisan tinker --execute="Schema::dropIfExists('demo_vehicles');" >/dev/null 2>&1; then
    echo "  * Dropped the demo_vehicles table"
else
    echo "  ! Could not drop demo_vehicles automatically; drop it by hand if it exists."
fi

# 2. Delete the three self-contained demo directories.
rm -rf app/Demo resources/js/Pages/Demo tests/Feature/Demo
echo "  * Deleted the demo directories"

# 3. routes/web.php - drop the demo imports, restore the DashboardController
#    import, and collapse the demo dashboard + vehicles routes back to the one
#    core /dashboard route.
perl -0pi -e '
    s/^use App\\Demo\\DemoDashboardController;\n//m;
    s/^use App\\Demo\\VehicleController;\n//m;
    s/^(use App\\Http\\Controllers\\AvatarController;\n)/${1}use App\\Http\\Controllers\\DashboardController;\n/m;
    s/^[ \t]*\/\/ The demo dashboard owns this route.*?->name\(\x27vehicles\.update\x27\);\n/    Route::get(\x27\/dashboard\x27, DashboardController::class)->name(\x27dashboard\x27);\n/ms;
' routes/web.php
echo "  * Restored the /dashboard route"

# 4. bootstrap/providers.php - remove the demo service provider registration.
perl -0pi -e '
    s/^[ \t]*\/\/ Registered by the removable demo.*?App\\Demo\\DemoServiceProvider::class,\n//ms;
' bootstrap/providers.php
echo "  * Unregistered the demo service provider"

# 5. navigation.ts - remove the Vehicles nav entry and the now-unused Car icon.
perl -0pi -e '
    s/import \{ Car, /import { /;
    s/^[ \t]*\/\/ Added by the removable demo.*?\{ label: \x27Vehicles\x27.*?\},\n//ms;
' resources/js/components/app-shell/navigation.ts
echo "  * Removed the Vehicles navigation entry"

# 6. Clear cached config/routes so the deleted provider cannot linger in
#    bootstrap/cache/services.php. Best-effort.
if php artisan optimize:clear >/dev/null 2>&1; then
    echo "  * Cleared cached config and routes"
else
    echo "  ! Could not clear caches automatically; run 'php artisan optimize:clear' yourself."
fi

# 7. Guard: warn if anything outside bootstrap/cache still references the demo.
leftovers="$(grep -rIl 'App\\Demo' app bootstrap routes resources 2>/dev/null | grep -v 'bootstrap/cache' || true)"
if [[ -n "$leftovers" ]]; then
    echo
    echo "  ! Warning: these files still reference App\\Demo - please review:"
    echo "$leftovers" | sed 's/^/      /'
fi

cat <<'EOF'

Demo removed. Optional cleanup left for you:
  - chart.js is still in package.json (used only by the old demo):
      npm uninstall chart.js

Happy building!
EOF

# 8. Remove this script - its job is done.
rm -f "$script_path"
