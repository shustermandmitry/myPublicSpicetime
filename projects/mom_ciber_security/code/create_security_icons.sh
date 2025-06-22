#!/bin/bash

# Create Custom Security Icons
# Generates SVG icons for secure browser sessions

USERNAME=$(whoami)
HOME_DIR="/home/$USERNAME"
ICONS_DIR="$HOME_DIR/.local/share/icons"

echo "🎨 Creating custom security icons..."

# Create secure Google icon
cat > "$ICONS_DIR/secure-google.svg" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="32" cy="32" r="30" fill="#4285F4" stroke="#1976D2" stroke-width="2"/>
  
  <!-- Lock symbol -->
  <rect x="24" y="30" width="16" height="20" rx="2" fill="#FFFFFF"/>
  <path d="M26 30 V26 C26 22 28 20 32 20 C36 20 38 22 38 26 V30" stroke="#FFFFFF" stroke-width="3" fill="none"/>
  
  <!-- Google "G" -->
  <circle cx="32" cy="40" r="6" fill="#4285F4"/>
  <path d="M32 37 L35 40 L32 43 L29 40 Z" fill="#FFFFFF"/>
  
  <!-- Security text -->
  <text x="32" y="58" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SECURE</text>
</svg>
EOF

# Create secure banking icon  
cat > "$ICONS_DIR/secure-banking.svg" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect x="4" y="20" width="56" height="36" rx="4" fill="#1976D2" stroke="#0D47A1" stroke-width="2"/>
  
  <!-- Bank columns -->
  <rect x="10" y="26" width="4" height="24" fill="#FFFFFF"/>
  <rect x="16" y="26" width="4" height="24" fill="#FFFFFF"/>
  <rect x="22" y="26" width="4" height="24" fill="#FFFFFF"/>
  <rect x="28" y="26" width="4" height="24" fill="#FFFFFF"/>
  <rect x="34" y="26" width="4" height="24" fill="#FFFFFF"/>
  <rect x="40" y="26" width="4" height="24" fill="#FFFFFF"/>
  <rect x="46" y="26" width="4" height="24" fill="#FFFFFF"/>
  
  <!-- Security shield -->
  <circle cx="48" cy="16" r="10" fill="#4CAF50" stroke="#388E3C" stroke-width="2"/>
  <path d="M44 16 L46 18 L52 12" stroke="#FFFFFF" stroke-width="3" fill="none"/>
  
  <!-- Dollar sign -->
  <text x="32" y="42" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">$</text>
  
  <!-- Lock -->
  <rect x="28" y="12" width="8" height="6" rx="1" fill="#FFD700"/>
  <circle cx="32" cy="9" r="3" stroke="#FFD700" stroke-width="2" fill="none"/>
</svg>
EOF

# Update desktop files to use custom icons
sed -i "s|Icon=google-chrome|Icon=$ICONS_DIR/secure-google.svg|" "$HOME_DIR/Desktop/Secure-Google.desktop"
sed -i "s|Icon=applications-accessories|Icon=$ICONS_DIR/secure-banking.svg|" "$HOME_DIR/Desktop/Secure-Banking.desktop"

echo "✅ Custom security icons created and applied"