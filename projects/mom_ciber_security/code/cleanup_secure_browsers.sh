#!/bin/bash

# Cleanup Secure Browsers
# Removes all secure browser setup (use with caution)

USERNAME=$(whoami)
HOME_DIR="/home/$USERNAME"

echo "🧹 Secure Browser Cleanup"
echo "========================="
echo ""
echo "⚠️  WARNING: This will remove all secure browser setup"
echo "Including:"
echo "  - Secure Google profile and ALL saved passwords"
echo "  - Banking browser profile"
echo "  - Desktop icons"
echo "  - Security scripts"
echo "  - Custom icons"
echo ""

read -p "Are you sure you want to continue? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Cleanup cancelled"
    exit 0
fi

echo ""
echo "🗑️  Removing secure browser files..."

# Remove desktop icons
echo "Removing desktop icons..."
rm -f "$HOME_DIR/Desktop/Secure-Google.desktop"
rm -f "$HOME_DIR/Desktop/Secure-Banking.desktop"
echo "✅ Desktop icons removed"

# Remove scripts
echo "Removing security scripts..."
rm -f "$HOME_DIR/.local/bin/secure-google.sh"
rm -f "$HOME_DIR/.local/bin/banking-secure.sh"
echo "✅ Security scripts removed"

# Remove custom icons
echo "Removing custom icons..."
rm -f "$HOME_DIR/.local/share/icons/secure-google.svg"
rm -f "$HOME_DIR/.local/share/icons/secure-banking.svg"
echo "✅ Custom icons removed"

# Remove secure Chrome profile
echo ""
echo "⚠️  CRITICAL: About to remove secure Google Chrome profile"
echo "This will permanently delete:"
echo "  - ALL saved passwords in secure Google account"
echo "  - ALL browsing history"
echo "  - ALL bookmarks"
echo "  - ALL stored login sessions"
echo ""
read -p "Remove secure Google Chrome profile? (y/n): " DELETE_PROFILE

if [ "$DELETE_PROFILE" = "y" ] || [ "$DELETE_PROFILE" = "Y" ]; then
    echo "Removing secure Chrome profile..."
    rm -rf "$HOME_DIR/.chrome-secure-google"
    echo "✅ Secure Chrome profile removed"
    echo ""
    echo "⚠️  IMPORTANT: If mom was using this profile for banking:"
    echo "  - She will need to log back into all banking sites"
    echo "  - All saved passwords are gone"
    echo "  - She'll need to reset passwords if she doesn't remember them"
else
    echo "⏭️  Secure Chrome profile preserved"
    echo "Note: Profile still exists at: $HOME_DIR/.chrome-secure-google"
fi

# Refresh desktop
echo ""
echo "Refreshing desktop..."
killall nautilus 2>/dev/null
nautilus & disown 2>/dev/null

echo ""
echo "🧹 Cleanup complete"
echo ""
echo "Removed:"
echo "  ✅ Desktop security icons"
echo "  ✅ Security launch scripts"
echo "  ✅ Custom security icons"
if [ "$DELETE_PROFILE" = "y" ] || [ "$DELETE_PROFILE" = "Y" ]; then
    echo "  ✅ Secure browser profile and all data"
else
    echo "  ⏭️  Secure browser profile (preserved)"
fi
echo ""
echo "To reinstall secure browsers:"
echo "  ./setup-secure-browsers.sh"