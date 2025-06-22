# Script Guide for Alex - setup-secure-browsers.sh

## Overview
This is the main installation script that sets up secure browser environments on mom's Ubuntu system. It creates complete isolation between banking/sensitive browsing and regular web activities.

---

## What This Script Does

### **Primary Function**
Creates two separate browser environments that cannot share data, passwords, or browsing history:
- **🔒 Secure Google**: For new secure Google account and sensitive sites
- **🏦 Secure Banking**: For banking websites only
- **Regular Firefox**: For everything else (unchanged)

### **Security Architecture**
- **Isolated Chrome Profile**: Creates `.chrome-secure-google/` directory with zero connection to regular browsing
- **Visual Confirmation**: Clear window titles and confirmation dialogs prevent user error
- **Desktop Integration**: Simple icons mom can click without confusion
- **Automatic Notifications**: System alerts when secure sessions start/end

---

## Installation Process

### **Prerequisites**
- Ubuntu 18.04+ (tested on 20.04, 22.04)
- Internet connection for downloading dependencies
- Regular user account (not root)
- Desktop environment (GNOME, Unity, etc.)

### **Running the Script**
```bash
# Make executable
chmod +x setup-secure-browsers.sh

# Run installation
./setup-secure-browsers.sh
```

### **What Gets Installed**
**Software Dependencies:**
- Google Chrome (if not already installed)
- Firefox (usually pre-installed)
- xdotool (for window management)
- zenity (for dialog boxes)
- libnotify-bin (for system notifications)

**Created Files:**
```
~/.local/bin/secure-google.sh           # Secure Google launcher
~/.local/bin/banking-secure.sh          # Banking launcher
~/Desktop/Secure-Google.desktop         # Desktop icon
~/Desktop/Secure-Banking.desktop        # Desktop icon
~/.chrome-secure-google/                # Isolated browser profile
~/.local/share/icons/secure-*.svg       # Custom security icons
```

---

## How the Secure Browsers Work

### **Secure Google Browser (🔒)**
**Launch Process:**
1. User clicks desktop icon
2. Script launches Chrome with isolated profile
3. Opens to Google sign-in page
4. Window title shows "SECURE GOOGLE SESSION"
5. User can sign into secure Google account
6. Can navigate to any sensitive website
7. All passwords saved to secure Google account

**Technical Details:**
```bash
google-chrome \
    --user-data-dir="$HOME/.chrome-secure-google" \  # Isolated profile
    --no-first-run \                                 # Skip setup wizard
    --no-default-browser-check \                     # No default prompts
    --window-size=1200,800 \                         # Consistent size
    --class="SecureGoogle" \                         # For window identification
    "https://accounts.google.com/signin"             # Direct to Google
```

### **Banking Browser (🏦)**
**Launch Process:**
1. User clicks desktop icon
2. **Confirmation dialog appears** with banking reminders
3. User must click "Start Banking" to continue
4. Script launches Chrome with same isolated profile
5. Opens directly to Bank of America
6. Window title shows "SECURE BANKING"
7. User should only visit banking sites

**Security Features:**
- **Confirmation Dialog**: Forces user to acknowledge banking mode
- **Visual Warnings**: Clear window title prevents confusion
- **Same Isolation**: Uses same secure profile as Secure Google
- **Banking Focus**: Opens directly to primary bank

---

## Security Benefits

### **Complete Profile Isolation**
```bash
# Regular Chrome profile location:
~/.config/google-chrome/

# Secure profile location:
~/.chrome-secure-google/

# These two directories never share data
```

### **What's Isolated**
- **Passwords**: Banking passwords only in secure profile
- **Cookies**: No shared login sessions
- **History**: Separate browsing histories
- **Bookmarks**: No cross-contamination
- **Extensions**: Secure profile starts clean
- **Cache**: Separate cached data

### **Visual Security**
- **Window Titles**: Always show current security mode
- **Custom Icons**: Different icons for different purposes
- **Notifications**: Confirm when secure sessions start/end
- **Confirmation Dialogs**: Prevent accidental banking mode

---

## User Experience for Mom

### **What She Sees**
1. **Two new desktop icons** appear after installation
2. **Different visual appearance** from regular browser icon
3. **Clear notifications** when clicking icons
4. **Obvious window titles** showing security mode

### **Daily Workflow**
```
Banking Activities:
1. Click 🏦 Secure Banking icon
2. See warning dialog
3. Click "Start Banking"
4. Bank of America opens automatically
5. Window shows "SECURE BANKING"

Sensitive Activities (government, healthcare, insurance):
1. Click 🔒 Secure Google icon
2. Chrome opens to Google sign-in
3. Window shows "SECURE GOOGLE SESSION"
4. Sign into secure Google account
5. Navigate to sensitive websites

Regular Browsing:
1. Click Firefox icon (unchanged)
2. Use for social media, news, shopping
3. No secure information in this browser
```

---

## Troubleshooting for Alex

### **Common Installation Issues**

**Chrome Installation Fails:**
```bash
# Manual Chrome installation
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update
sudo apt install google-chrome-stable
```

**Desktop Icons Don't Appear:**
```bash
# Refresh desktop
killall nautilus
nautilus & disown

# Check if files exist
ls -la ~/Desktop/Secure-*.desktop

# Fix permissions if needed
chmod +x ~/Desktop/Secure-*.desktop
```

**Permission Errors:**
```bash
# Make sure scripts are executable
chmod +x ~/.local/bin/secure-google.sh
chmod +x ~/.local/bin/banking-secure.sh

# Trust desktop files (Ubuntu 20.04+)
gio set ~/Desktop/Secure-Google.desktop metadata::trusted true
gio set ~/Desktop/Secure-Banking.desktop metadata::trusted true
```

### **Testing Installation**
```bash
# Verify installation worked
./test-browser-isolation.sh

# Should show all green checkmarks:
# ✅ Secure profile directory exists
# ✅ Profiles are separate
# ✅ No cross-contamination detected
# ✅ Desktop icons ready
# ✅ Security scripts ready
```

---

## Security Verification

### **What to Check Weekly**
```bash
# Run isolation test
./test-browser-isolation.sh

# Look for warnings:
# ⚠️ Banking bookmarks in regular profile (BAD)
# ⚠️ Social media in secure profile (BAD)

# Check profile sizes
du -sh ~/.config/google-chrome/
du -sh ~/.chrome-secure-google/
```

### **Signs of Compromise**
- Banking bookmarks appear in regular Firefox
- Social media bookmarks in secure browser
- Mom reports confusion about which browser to use
- Icons stop working or show errors
- Passwords not saving in secure browser

### **Monthly Maintenance**
```bash
# Update browsers
sudo apt update && sudo apt upgrade

# Check desktop icon permissions
ls -la ~/Desktop/Secure-*.desktop

# Verify profile separation
./test-browser-isolation.sh
```

---

## Emergency Procedures

### **If Secure Profile Gets Corrupted**
```bash
# Backup any important data first
cp -r ~/.chrome-secure-google ~/.chrome-secure-google.backup

# Remove corrupted profile
rm -rf ~/.chrome-secure-google

# Re-run setup to recreate
./setup-secure-browsers.sh

# Mom will need to log back into secure Google account
```

### **If Cross-Contamination Detected**
```bash
# Check what was contaminated
./test-browser-isolation.sh

# If banking bookmarks in regular browser:
# - Remove banking bookmarks from Firefox
# - Remind mom to only use banking icon

# If social media in secure browser:
# - Remove social bookmarks from secure profile
# - Remind mom about browser purposes
```

### **Complete Reset (Last Resort)**
```bash
# Remove everything and start over
./cleanup-secure-browsers.sh
# Answer 'yes' to remove secure profile
# Then re-run setup
./setup-secure-browsers.sh
```

---

## Integration with Overall Security Plan

### **Phone Security Integration**
- **Banking 2FA**: Codes come to new iPhone, entered in secure browser
- **Google Voice**: General communication separate from banking
- **Recovery Control**: Your phone/email control secure Google account recovery

### **Credential Migration Support**
- **Secure Google Account**: Use 🔒 Secure Google icon to set up new account
- **Banking Updates**: Use 🏦 Secure Banking icon to update bank contact info
- **Password Migration**: Let secure Google Password Manager save new credentials

### **Future AI Monitoring**
- **Clean Baseline**: Secure browsers provide known-good browsing patterns
- **Threat Detection**: AI can identify if mom accidentally uses wrong browser
- **Activity Monitoring**: Separate logs for secure vs. regular browsing

This script creates the foundation for mom's secure digital life - once installed, she gets the convenience of Google Password Manager with the security of complete browser isolation.