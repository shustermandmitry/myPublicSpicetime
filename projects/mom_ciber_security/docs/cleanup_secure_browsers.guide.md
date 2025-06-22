# Script Guide for Alex - cleanup-secure-browsers.sh

## Overview
This is the "nuclear option" script that completely removes the secure browser setup. **Use with extreme caution** - it will delete all of mom's saved passwords and banking login sessions in the secure browser.

---

## When to Use This Script

### **Appropriate Use Cases**
- **Security compromise suspected**: Evidence that secure browsers were breached
- **Complete system malfunction**: Icons and browsers completely broken beyond repair
- **Testing/development**: Setting up on a test system repeatedly
- **Starting fresh**: Mom wants to completely reset her secure browsing
- **Major Ubuntu upgrade**: Sometimes system upgrades break the setup

### **⚠️ NEVER Use This Script For**
- **Minor issues**: Icons not appearing, small permission problems
- **User confusion**: Mom using wrong browser occasionally
- **Browser updates**: Regular Chrome/Firefox updates
- **Desktop environment changes**: Switching from GNOME to KDE, etc.

---

## What This Script Removes

### **Desktop Integration**
```bash
# Desktop icons removed
~/Desktop/Secure-Google.desktop     # 🔒 Secure Google icon
~/Desktop/Secure-Banking.desktop    # 🏦 Secure Banking icon
```

### **Launch Scripts**
```bash
# Security scripts removed
~/.local/bin/secure-google.sh       # Secure Google launcher
~/.local/bin/banking-secure.sh      # Banking launcher
```

### **Visual Elements**
```bash
# Custom security icons removed
~/.local/share/icons/secure-google.svg
~/.local/share/icons/secure-banking.svg
```

### **⚠️ CRITICAL: Browser Profile**
```bash
# OPTIONAL but DESTRUCTIVE removal
~/.chrome-secure-google/            # ALL saved passwords, history, bookmarks
```

**This includes:**
- All banking passwords saved in secure Google account
- All government website passwords (IRS, Social Security, Medicare)
- All healthcare portal passwords
- All insurance website passwords
- Complete browsing history in secure browser
- All bookmarks in secure browser
- All login sessions (will need to log back into everything)

---

## Script Execution Process

### **Step 1: Warning and Confirmation**
```bash
🧹 Secure Browser Cleanup
=========================

⚠️  WARNING: This will remove all secure browser setup
Including:
  - Secure Google profile and ALL saved passwords
  - Banking browser profile
  - Desktop icons
  - Security scripts
  - Custom icons

Are you sure you want to continue? (type 'yes' to confirm):
```

**What this means:**
- Script requires explicit "yes" confirmation
- Typing anything else cancels the operation
- Gives you a chance to back out

### **Step 2: File Removal**
```bash
🗑️  Removing secure browser files...

Removing desktop icons...
✅ Desktop icons removed

Removing security scripts...
✅ Security scripts removed

Removing custom icons...
✅ Custom icons removed
```

**What happens:**
- Desktop icons disappear immediately
- Launch scripts deleted (icons would error if clicked)
- Custom security icons removed

### **Step 3: Profile Removal Decision**
```bash
⚠️  CRITICAL: About to remove secure Google Chrome profile
This will permanently delete:
  - ALL saved passwords in secure Google account
  - ALL browsing history
  - ALL bookmarks
  - ALL stored login sessions

Remove secure Google Chrome profile? (y/n):
```

**Critical Decision Point:**
- **Type 'y'**: PERMANENTLY deletes all secure browser data
- **Type 'n'**: Preserves the browser profile and all saved data

---

## Safe Cleanup Strategy

### **Option 1: Preserve Profile (Recommended)**
```bash
# When asked about profile removal, type 'n'
Remove secure Google Chrome profile? (y/n): n

# Result:
⏭️  Secure Chrome profile preserved
Note: Profile still exists at: /home/mom/.chrome-secure-google
```

**What you get:**
- Icons and scripts removed (cleanup achieved)
- All passwords and data preserved
- Can reinstall setup without losing data
- Mom won't need to log back into everything

### **Option 2: Complete Removal (Use with caution)**
```bash
# When asked about profile removal, type 'y'
Remove secure Google Chrome profile? (y/n): y

# Result:
✅ Secure Chrome profile removed

⚠️  IMPORTANT: If mom was using this profile for banking:
  - She will need to log back into all banking sites
  - All saved passwords are gone
  - She'll need to reset passwords if she doesn't remember them
```

**What you get:**
- Complete clean slate
- All secure browser data permanently deleted
- Mom needs to start over completely
- May need password recovery for forgotten accounts

---

## Emergency Recovery Procedures

### **If You Accidentally Remove Profile**
**Bad news**: Chrome profile data cannot be recovered once deleted
**Recovery options**:
1. **Check for backups**: Look for any system backups
2. **Password recovery**: Use bank password reset options
3. **Account recovery**: Use "forgot password" on each website
4. **Contact support**: Call banks for account access help

### **Preventing Accidental Deletion**
```bash
# BEFORE running cleanup, create backup
cp -r ~/.chrome-secure-google ~/.chrome-secure-google.backup.$(date +%Y%m%d)

# This way you can restore if needed:
# mv ~/.chrome-secure-google.backup.20241215 ~/.chrome-secure-google
```

---

## Post-Cleanup Procedures

### **After Icons/Scripts Removal Only**
```bash
# Reinstall setup (data preserved)
./setup-secure-browsers.sh

# Test everything works
./test-browser-isolation.sh

# Mom can use browsers immediately (already logged in)
```

### **After Complete Profile Removal**
```bash
# Reinstall setup
./setup-secure-browsers.sh

# Test installation
./test-browser-isolation.sh

# Help mom set up secure Google account again:
# 1. Click 🔒 Secure Google icon
# 2. Create or sign into secure Google account
# 3. Enable Google Password Manager
# 4. Re-save all banking passwords
# 5. Log back into all sensitive websites
```

---

## Troubleshooting Cleanup Issues

### **"Permission Denied" Errors**
```bash
# Fix permissions and try again
chmod +x cleanup-secure-browsers.sh
./cleanup-secure-browsers.sh
```

### **"Files Not Found" Warnings**
```bash
# Normal if some files already deleted
# Script continues and removes what exists
# Check final status with test script
./test-browser-isolation.sh
```

### **Desktop Doesn't Refresh**
```bash
# Manually refresh desktop
killall nautilus
nautilus & disown

# Check icons are gone
ls -la ~/Desktop/Secure-*.desktop
```

### **Profile Removal Fails**
```bash
# Check if Chrome is running
ps aux | grep chrome

# Kill Chrome processes if needed
killall chrome
killall google-chrome

# Try manual removal
rm -rf ~/.chrome-secure-google
```

---

## Integration with Security Plan

### **When Cleanup Fits Overall Strategy**
- **Phone replacement**: Getting mom new iPhone, want fresh browser start
- **Credential migration**: Moving to completely new passwords, accounts
- **Security incident**: Suspected breach requiring complete reset
- **System rebuild**: Reinstalling Ubuntu, want clean browser setup

### **Coordination with Other Components**
```bash
# If doing complete security reset:
# 1. Run browser cleanup (this script)
# 2. Reset secure Google account
# 3. Change all banking passwords
# 4. Update phone 2FA numbers
# 5. Reinstall browser setup
# 6. Help mom log into everything fresh
```

---

## Alternative Solutions

### **Before Using Cleanup Script, Try:**

**For Icon Problems:**
```bash
# Just recreate icons without removing data
./create-security-icons.sh
chmod +x ~/Desktop/Secure-*.desktop
```

**For Script Problems:**
```bash
# Just recreate scripts without removing data
# Extract script creation part from setup script
```

**For Permission Issues:**
```bash
# Fix permissions without full cleanup
chmod +x ~/.local/bin/secure-*.sh
chmod +x ~/Desktop/Secure-*.desktop
```

**For Browser Issues:**
```bash
# Reset just the browser profile without removing scripts
mv ~/.chrome-secure-google ~/.chrome-secure-google.broken
mkdir ~/.chrome-secure-google
```

---

## Decision Tree

```
Problem with secure browsers?
├── Icons not working? → Try: chmod +x ~/Desktop/Secure-*.desktop
├── Scripts not working? → Try: Re-run setup-secure-browsers.sh  
├── Browser won't start? → Try: Reset profile only
├── Complete system failure? → Consider: cleanup-secure-browsers.sh
└── Security breach suspected? → Use: cleanup-secure-browsers.sh (full removal)
```

---

## Final Warning

**Remember**: This script can permanently delete months of carefully saved passwords and login sessions. Mom will need to:
- Remember or reset dozens of passwords
- Log back into every banking website
- Re-save all passwords in secure Google account
- Potentially call banks for account access issues

Only use complete profile removal when you're certain it's necessary and mom is prepared for the recovery process.