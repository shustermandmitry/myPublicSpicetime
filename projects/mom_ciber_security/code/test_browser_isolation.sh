#!/bin/bash

# Test Browser Isolation
# Verifies that secure browsers are properly isolated

USERNAME=$(whoami)
HOME_DIR="/home/$USERNAME"
SECURE_PROFILE="$HOME_DIR/.chrome-secure-google"
REGULAR_PROFILE="$HOME_DIR/.config/google-chrome"

echo "🔍 Testing Browser Isolation"
echo "============================"
echo ""

# Test 1: Check if secure profile exists
echo "Test 1: Secure profile directory"
if [ -d "$SECURE_PROFILE" ]; then
    echo "✅ Secure profile directory exists: $SECURE_PROFILE"
else
    echo "❌ Secure profile directory missing: $SECURE_PROFILE"
fi
echo ""

# Test 2: Check profile separation
echo "Test 2: Profile separation"
if [ -d "$REGULAR_PROFILE" ] && [ -d "$SECURE_PROFILE" ]; then
    REGULAR_SIZE=$(du -s "$REGULAR_PROFILE" 2>/dev/null | cut -f1)
    SECURE_SIZE=$(du -s "$SECURE_PROFILE" 2>/dev/null | cut -f1)
    echo "Regular profile size: ${REGULAR_SIZE:-0} KB"
    echo "Secure profile size: ${SECURE_SIZE:-0} KB"
    echo "✅ Profiles are separate"
else
    echo "❌ Cannot verify profile separation"
fi
echo ""

# Test 3: Check for cross-contamination
echo "Test 3: Cross-contamination check"
CONTAMINATION=false

# Check for banking bookmarks in regular profile
if [ -f "$REGULAR_PROFILE/Default/Bookmarks" ]; then
    if grep -q "bankofamerica\|chase\|wellsfargo\|citibank" "$REGULAR_PROFILE/Default/Bookmarks" 2>/dev/null; then
        echo "⚠️  WARNING: Banking bookmarks found in regular profile"
        CONTAMINATION=true
    fi
fi

# Check for social media in secure profile
if [ -f "$SECURE_PROFILE/Default/Bookmarks" ]; then
    if grep -q "facebook\|twitter\|instagram\|tiktok" "$SECURE_PROFILE/Default/Bookmarks" 2>/dev/null; then
        echo "⚠️  WARNING: Social media bookmarks found in secure profile"
        CONTAMINATION=true
    fi
fi

if [ "$CONTAMINATION" = false ]; then
    echo "✅ No cross-contamination detected"
fi
echo ""

# Test 4: Check desktop icons
echo "Test 4: Desktop icons"
SECURE_GOOGLE_ICON="$HOME_DIR/Desktop/Secure-Google.desktop"
SECURE_BANKING_ICON="$HOME_DIR/Desktop/Secure-Banking.desktop"

if [ -f "$SECURE_GOOGLE_ICON" ]; then
    echo "✅ Secure Google icon exists"
    if [ -x "$SECURE_GOOGLE_ICON" ]; then
        echo "✅ Secure Google icon is executable"
    else
        echo "❌ Secure Google icon not executable"
    fi
else
    echo "❌ Secure Google icon missing"
fi

if [ -f "$SECURE_BANKING_ICON" ]; then
    echo "✅ Secure Banking icon exists"
    if [ -x "$SECURE_BANKING_ICON" ]; then
        echo "✅ Secure Banking icon is executable"
    else
        echo "❌ Secure Banking icon not executable"
    fi
else
    echo "❌ Secure Banking icon missing"
fi
echo ""

# Test 5: Check scripts
echo "Test 5: Security scripts"
SECURE_GOOGLE_SCRIPT="$HOME_DIR/.local/bin/secure-google.sh"
BANKING_SCRIPT="$HOME_DIR/.local/bin/banking-secure.sh"

if [ -f "$SECURE_GOOGLE_SCRIPT" ] && [ -x "$SECURE_GOOGLE_SCRIPT" ]; then
    echo "✅ Secure Google script ready"
else
    echo "❌ Secure Google script missing or not executable"
fi

if [ -f "$BANKING_SCRIPT" ] && [ -x "$BANKING_SCRIPT" ]; then
    echo "✅ Banking script ready"
else
    echo "❌ Banking script missing or not executable"
fi
echo ""

# Test 6: Dependencies
echo "Test 6: Required dependencies"
DEPS=("google-chrome" "xdotool" "zenity" "notify-send")
for dep in "${DEPS[@]}"; do
    if command -v "$dep" >/dev/null 2>&1; then
        echo "✅ $dep installed"
    else
        echo "❌ $dep missing"
    fi
done
echo ""

# Test 7: Check custom icons
echo "Test 7: Custom icons"
CUSTOM_GOOGLE_ICON="$HOME_DIR/.local/share/icons/secure-google.svg"
CUSTOM_BANKING_ICON="$HOME_DIR/.local/share/icons/secure-banking.svg"

if [ -f "$CUSTOM_GOOGLE_ICON" ]; then
    echo "✅ Custom Google icon exists"
else
    echo "❌ Custom Google icon missing"
fi

if [ -f "$CUSTOM_BANKING_ICON" ]; then
    echo "✅ Custom banking icon exists"
else
    echo "❌ Custom banking icon missing"
fi
echo ""

echo "🔍 Browser isolation test complete"
echo ""
echo "If any tests failed, run setup-secure-browsers.sh again"