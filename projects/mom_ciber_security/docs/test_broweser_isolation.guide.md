# Script Guide for Alex - test-browser-isolation.sh

## Overview
This script verifies that the secure browser setup is working correctly and maintains proper isolation between secure and regular browsing. It's your security validation tool.

---

## Purpose and Importance

### **Why This Test Matters**
Browser isolation is the core security feature that protects mom's banking credentials. If isolation breaks down, banking passwords could leak into regular browsing or vice versa. This script catches those problems before they become security breaches.

### **When to Run This Test**
- **After initial installation** (verify setup worked)
- **Weekly security checks** (catch problems early)
- **If mom reports browser confusion** (diagnose issues)
- **Before important banking activities** (confirm security)
- **After system updates** (ensure nothing broke)

---

## What the Script Tests

### **Test 1: Secure Profile Directory**
**What it checks:**
```bash
# Verifies secure profile exists and is accessible
if [ -d "$HOME/.chrome-secure-google" ]; then
    echo "✅ Secure profile directory exists"
else
    echo "❌ Secure profile directory missing"
fi
```

**What this means:**
- **✅ PASS**: Secure browser profile is properly created
- **❌ FAIL**: Setup didn't complete or profile was deleted

### **Test 2: Profile Separation**
**What it checks:**
```bash
# Compares regular vs secure profile sizes
REGULAR_SIZE=$(du -s "$HOME/.config/google-chrome" | cut -f1)
SECURE_SIZE=$(du -s "$HOME/.chrome-secure-google" | cut -f1)
```

**What this means:**
- **✅ PASS**: Two separate profiles with different data
- **❌ FAIL**: Profiles might be sharing data somehow

### **Test 3: Cross-Contamination Detection**
**What it checks:**
```bash
# Banking bookmarks in regular browser (BAD)
grep -q "bankofamerica\|chase\|wellsfargo" ~/.config/google-chrome/Default/Bookmarks

# Social media in secure browser (BAD)  
grep -q "facebook\|twitter\|instagram" ~/.chrome-secure-google/Default/Bookmarks
```

**What this means:**
- **✅ PASS**: No banking bookmarks in regular browser, no social media in secure browser
- **⚠️ WARNING**: Cross-contamination detected - security compromise possible

### **Test 4: Desktop Icons**
**What it checks:**
- Desktop icon files exist
- Icons are executable
- Icons point to correct scripts

**What this means:**
- **✅ PASS**: Mom can launch secure browsers correctly
- **❌ FAIL**: Icons won't work, mom can't access secure browsers

### **Test 5: Security Scripts**
**What it checks:**
- Launch scripts exist in `~/.local/bin/`
- Scripts have execute permissions
- Scripts contain correct commands

**What this means:**
- **✅ PASS**: Secure browser launching will work
- **❌ FAIL**: Icons will show errors when clicked

### **Test 6: Dependencies**
**What it checks:**
```bash
# Required software installed
command -v google-chrome
command -v xdotool
command -v zenity
command -v notify-send
```

**What this means:**
- **✅ PASS**: All required software available
- **❌ FAIL**: Missing software will cause script failures

### **Test 7: Custom Icons**
**What it checks:**
- Custom security icons exist
- Desktop files reference custom icons
- Icon files are valid SVG format

**What this means:**
- **✅ PASS**: Visual security cues working properly
- **❌ FAIL**: Icons may show as question marks

---

## Running the Test

### **Basic Usage**
```bash
# Run security test
./test-browser-isolation.sh

# Example output:
🔍 Testing Browser Isolation
============================

Test 1: Secure profile directory
✅ Secure profile directory exists: /home/mom/.chrome-secure-google

Test 2: Profile separation  
Regular profile size: 45231 KB
Secure profile size: 1247 KB
✅ Profiles are separate

Test 3: Cross-contamination check
✅ No cross-contamination detected

Test 4: Desktop icons
✅ Secure Google icon exists
✅ Secure Google icon is executable
✅ Secure Banking icon exists  
✅ Secure Banking icon is executable

Test 5: Security scripts
✅ Secure Google script ready
✅ Banking script ready

Test 6: Required dependencies
✅ google-chrome installed
✅ xdotool installed
✅ zenity installed
✅ notify-send installed

Test 7: Custom icons
✅ Custom Google icon exists
✅ Custom banking icon exists

🔍 Browser isolation test complete
```

---

## Interpreting Results

### **All Green (✅) - Perfect Security**
```
✅ Secure profile directory exists
✅ Profiles are separate
✅ No cross-contamination detected
✅ All icons ready
✅ All scripts ready
✅ All dependencies installed
✅ Custom icons ready
```
**Meaning**: Security is working perfectly. Mom can safely use secure browsers.

### **Yellow Warnings (⚠️) - Security Risk**
```
⚠️ WARNING: Banking bookmarks found in regular profile
⚠️ WARNING: Social media bookmarks found in secure profile
```
**Meaning**: Cross-contamination detected. Mom has been mixing browsers.

**Immediate Actions:**
1. **Don't panic** - data isn't lost, but security is compromised
2. **Check what's contaminated**:
   ```bash
   # See what banking sites are in regular browser
   grep -i "bank\|chase\|wells\|citi" ~/.config/google-chrome/Default/Bookmarks
   
   # See what social sites are in secure browser
   grep -i "facebook\|twitter\|instagram\|tiktok" ~/.chrome-secure-google/Default/Bookmarks
   ```
3. **Clean up contamination**:
   - Remove banking bookmarks from Firefox
   - Remove social bookmarks from secure browser
   - Retrain mom on which browser to use

### **Red Errors (❌) - Setup Problems**
```
❌ Secure profile directory missing
❌ Desktop icons not executable
❌ Security scripts missing
❌ google-chrome missing
```
**Meaning**: Installation incomplete or corrupted.

**Fix Actions:**
```bash
# Re-run setup to fix missing components
./setup-secure-browsers.sh

# If still failing, check specific issues:
sudo apt install google-chrome-stable  # Missing Chrome
chmod +x ~/Desktop/Secure-*.desktop    # Fix icon permissions
chmod +x ~/.local/bin/secure-*.sh      # Fix script permissions
```

---

## Advanced Troubleshooting

### **Profile Size Analysis**
```bash
# Normal profile sizes:
Regular profile: 20MB - 200MB (varies with usage)
Secure profile: 1MB - 50MB (should be smaller)

# Concerning signs:
Secure profile larger than regular (possible data sharing)
Both profiles same size (possible symlink issue)
Secure profile 0 KB (profile creation failed)
```

### **Deep Contamination Check**
```bash
# Manual contamination investigation
echo "=== Banking sites in regular browser ==="
find ~/.config/google-chrome -name "Bookmarks" -exec grep -l "bank\|chase\|wells\|fargo\|citi" {} \;

echo "=== Social sites in secure browser ==="
find ~/.chrome-secure-google -name "Bookmarks" -exec grep -l "facebook\|twitter\|instagram\|linkedin" {} \;

echo "=== Password files ==="
ls -la ~/.config/google-chrome/Default/Login\ Data 2>/dev/null
ls -la ~/.chrome-secure-google/Default/Login\ Data 2>/dev/null
```

### **Icon Troubleshooting**
```bash
# Check desktop file contents
cat ~/Desktop/Secure-Google.desktop
cat ~/Desktop/Secure-Banking.desktop

# Verify icon paths
ls -la ~/.local/share/icons/secure-*.svg

# Test icon launching manually
~/.local/bin/secure-google.sh
~/.local/bin/banking-secure.sh
```

---

## Weekly Security Routine

### **Monday Security Check**
```bash
# Run full test
./test-browser-isolation.sh > weekly-security-check.log

# Review results
cat weekly-security-check.log

# If any warnings/errors:
# 1. Document the issue
# 2. Fix immediately
# 3. Retrain mom if needed
```

### **Monitoring Trends**
```bash
# Track profile growth over time
echo "$(date): Regular=$(du -sh ~/.config/google-chrome | cut -f1), Secure=$(du -sh ~/.chrome-secure-google | cut -f1)" >> profile-sizes.log

# Check for unusual growth patterns
tail -10 profile-sizes.log
```

---

## Integration with Overall Security

### **Before Banking Activities**
```bash
# Always verify security before important banking
./test-browser-isolation.sh

# Only proceed if all tests pass
# If any warnings, fix first
```

### **After System Updates**
```bash
# Ubuntu updates can sometimes break desktop files
sudo apt update && sudo apt upgrade

# Verify nothing broke
./test-browser-isolation.sh

# Fix any issues immediately
```

### **Monthly Security Review**
```bash
# Comprehensive security check
./test-browser-isolation.sh
./check-browser-isolation.sh  # If you create additional monitoring

# Review with mom:
# - Which browser she uses for what
# - Any confusion or mixing
# - Any suspicious websites or activities
```

---

## Common Issues and Solutions

### **Issue: "Custom icons missing"**
**Cause**: Icon creation script didn't run or failed
**Solution**:
```bash
./create-security-icons.sh
./test-browser-isolation.sh  # Verify fix
```

### **Issue: "Cross-contamination detected"**
**Cause**: Mom used wrong browser for activities
**Solution**:
1. Clean up bookmarks in wrong browsers
2. Retrain mom on browser purposes
3. Consider adding more visual cues

### **Issue: "Desktop icons not executable"**
**Cause**: Permissions lost during system update
**Solution**:
```bash
chmod +x ~/Desktop/Secure-*.desktop
gio set ~/Desktop/Secure-Google.desktop metadata::trusted true
gio set ~/Desktop/Secure-Banking.desktop metadata::trusted true
```

### **Issue: "Scripts missing"**
**Cause**: Files deleted or moved
**Solution**:
```bash
# Re-run setup to recreate scripts
./setup-secure-browsers.sh
```

---

## Emergency Response

### **If Test Shows Complete Failure**
```bash
# Document current state
./test-browser-isolation.sh > emergency-state.log

# Complete reset
./cleanup-secure-browsers.sh
# Answer 'yes' to remove secure profile

# Fresh installation
./setup-secure-browsers.sh

# Verify fix
./test-browser-isolation.sh

# Help mom log back into secure Google account
```

### **If Suspected Security Breach**
```bash
# Immediate isolation
# 1. Run test to document compromise
./test-browser-isolation.sh > breach-evidence.log

# 2. Change all banking passwords immediately
# 3. Contact banks about potential compromise
# 4. Reset secure Google account
# 5. Complete system reinstall if necessary
```

---

## Script Maintenance

### **Keeping Test Script Updated**
The test script should evolve as threats change:

```bash
# Add new contamination checks
# Update dependency list
# Check for new attack vectors
# Monitor for new browser security features
```

### **Custom Security Checks**
You can extend the script for mom's specific needs:

```bash
# Add checks for specific banks she uses
# Monitor for particular attack patterns
# Check for specific malware signatures
# Verify other security tools are working
```

This test script is your early warning system - it catches security problems before they become breaches. Run it regularly and take any warnings seriously!