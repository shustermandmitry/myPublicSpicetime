#!/bin/bash

# Ubuntu Security Browser Setup
# Creates isolated browser environments for banking and secure activities

echo "🔒 Ubuntu Security Browser Setup 🔒"
echo "=================================="
echo ""

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ Don't run this script as root (use regular user account)"
   exit 1
fi

# Get current user info
USERNAME=$(whoami)
HOME_DIR="/home/$USERNAME"
DESKTOP_DIR="$HOME_DIR/Desktop"

echo "Setting up secure browsers for user: $USERNAME"
echo "Home directory: $HOME_DIR"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p "$HOME_DIR/.local/share/icons"
mkdir -p "$HOME_DIR/.local/bin"
mkdir -p "$HOME_DIR/.chrome-secure-google"
mkdir -p "$DESKTOP_DIR"

# Install dependencies
echo "📦 Installing dependencies..."
sudo apt update
sudo apt install -y \
    google-chrome-stable \
    firefox \
    xdotool \
    zenity \
    libnotify-bin

# Create secure Google browser script
echo "🔒 Creating secure Google browser script..."
cat > "$HOME_DIR/.local/bin/secure-google.sh" << 'EOF'
#!/bin/bash

# Secure Google Browser Session
# Uses isolated Chrome profile for secure Google account

USERNAME=$(whoami)
SECURE_PROFILE="/home/$USERNAME/.chrome-secure-google"

# Show starting notification
notify-send "Secure Google" "🔒 Starting secure Google session..." -i dialog-information -t 3000

# Launch Chrome with secure profile
google-chrome \
    --user-data-dir="$SECURE_PROFILE" \
    --no-first-run \
    --no-default-browser-check \
    --window-size=1200,800 \
    --class="SecureGoogle" \
    --user-agent="SecureGoogleSession/1.0" \
    "https://accounts.google.com/signin" &

# Get Chrome PID
CHROME_PID=$!

# Wait for Chrome to start
sleep 3

# Set distinctive window title
xdotool search --class "SecureGoogle" set_window --name "🔒 SECURE GOOGLE SESSION - Banking & Sensitive Sites Only 🔒" 2>/dev/null

# Wait for Chrome to close
wait $CHROME_PID

# Show completion notification
notify-send "Secure Google" "🔒 Secure Google session ended safely" -i dialog-information -t 3000

echo "Secure Google session ended at $(date)"
EOF

# Make secure Google script executable
chmod +x "$HOME_DIR/.local/bin/secure-google.sh"

# Create banking browser script
echo "🏦 Creating banking browser script..."
cat > "$HOME_DIR/.local/bin/banking-secure.sh" << 'EOF'
#!/bin/bash

# Secure Banking Browser Session
# Uses secure Google profile for banking activities

USERNAME=$(whoami)
SECURE_PROFILE="/home/$USERNAME/.chrome-secure-google"

# Show warning dialog
zenity --question \
    --title="🏦 Banking Mode" \
    --text="Starting SECURE BANKING session

IMPORTANT REMINDERS:
• Use ONLY for banking websites
• DO NOT visit social media or other sites
• All passwords managed by secure Google account
• Close window when banking is complete

Ready to start secure banking?" \
    --width=400 \
    --ok-label="Start Banking" \
    --cancel-label="Cancel"

# Exit if user cancels
if [ $? -ne 0 ]; then
    echo "Banking session cancelled by user"
    exit 0
fi

# Show starting notification
notify-send "Banking Mode" "🏦 Starting secure banking session..." -i dialog-information -t 3000

# Launch Chrome with secure profile directly to banking
google-chrome \
    --user-data-dir="$SECURE_PROFILE" \
    --no-first-run \
    --no-default-browser-check \
    --window-size=1200,800 \
    --class="SecureBanking" \
    --new-window \
    "https://www.bankofamerica.com" &

# Get Chrome PID
CHROME_PID=$!

# Wait for Chrome to start
sleep 3

# Set distinctive window title
xdotool search --class "SecureBanking" set_window --name "🏦 SECURE BANKING - Bank of America - Do NOT visit other sites 🏦" 2>/dev/null

# Wait for Chrome to close
wait $CHROME_PID

# Show completion notification
notify-send "Banking Session" "🏦 Secure banking session ended safely" -i dialog-information -t 3000

echo "Banking session ended at $(date)"
EOF

# Make banking script executable
chmod +x "$HOME_DIR/.local/bin/banking-secure.sh"

# Create secure Google desktop icon
echo "🖥️ Creating Secure Google desktop icon..."
cat > "$DESKTOP_DIR/Secure-Google.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=🔒 Secure Google
Comment=Secure Google account for banking and sensitive activities
Exec=$HOME_DIR/.local/bin/secure-google.sh
Icon=google-chrome
Terminal=false
Categories=Network;Security;
StartupNotify=true
EOF

# Create banking desktop icon
echo "🖥️ Creating Secure Banking desktop icon..."
cat > "$DESKTOP_DIR/Secure-Banking.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=🏦 Secure Banking
Comment=Secure banking with isolated Google account
Exec=$HOME_DIR/.local/bin/banking-secure.sh
Icon=applications-accessories
Terminal=false
Categories=Network;Finance;Security;
StartupNotify=true
EOF

# Make desktop files executable
chmod +x "$DESKTOP_DIR/Secure-Google.desktop"
chmod +x "$DESKTOP_DIR/Secure-Banking.desktop"

# Trust desktop files (Ubuntu 20.04+)
echo "✅ Setting desktop file permissions..."
gio set "$DESKTOP_DIR/Secure-Google.desktop" metadata::trusted true 2>/dev/null || echo "Note: Could not set trusted flag (older Ubuntu version)"
gio set "$DESKTOP_DIR/Secure-Banking.desktop" metadata::trusted true 2>/dev/null || echo "Note: Could not set trusted flag (older Ubuntu version)"

# Create custom icons if script exists
if [ -f "./create-security-icons.sh" ]; then
    echo "🎨 Creating custom security icons..."
    ./create-security-icons.sh
fi

echo ""
echo "✅ Security browser setup complete!"
echo ""
echo "Desktop icons created:"
echo "  🔒 Secure Google - For secure Google account and sensitive sites"
echo "  🏦 Secure Banking - For banking websites only"
echo ""
echo "IMPORTANT: Tell mom to:"
echo "  1. Use 🔒 Secure Google for creating/accessing secure Google account"
echo "  2. Use 🏦 Secure Banking for banking websites only"
echo "  3. Use regular Firefox for everything else"
echo "  4. NEVER mix banking and regular browsing"
echo ""
read -p "Press Enter to continue..."