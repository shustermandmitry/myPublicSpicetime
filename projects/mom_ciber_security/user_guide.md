# Ubuntu Secure Browser Setup - User Guide

## Overview
This guide explains how to install and use secure browser icons on Ubuntu for safe banking and sensitive web activities.

---

## Installation

### **Quick Setup**
1. **Download all script files** to a folder on Ubuntu
2. **Open terminal** in that folder
3. **Make scripts executable**:
   ```bash
   chmod +x *.sh
   ```
4. **Run the setup**:
   ```bash
   ./setup-secure-browsers.sh
   ```
5. **Test installation**:
   ```bash
   ./test-browser-isolation.sh
   ```

### **What Gets Installed**
- **🔒 Secure Google** desktop icon
- **🏦 Secure Banking** desktop icon
- **Isolated Chrome profile** for secure activities
- **Custom security icons** for visual distinction
- **Security scripts** in ~/.local/bin/

---

## Files Included

### **Required Scripts**
```
setup-secure-browsers.sh      - Main installation script
create-security-icons.sh      - Creates custom security icons
test-browser-isolation.sh     - Tests that setup worked correctly
cleanup-secure-browsers.sh    - Removes everything (use with caution)
```

### **Installation Order**
1. Run `setup-secure-browsers.sh` first
2. Run `test-browser-isolation.sh` to verify
3. Use the desktop icons
4. Only run `cleanup-secure-browsers.sh` if you need to start over

---

## How Mom Should Use the Icons

### **🔒 Secure Google Icon**
**Purpose**: Accessing secure Google account for sensitive activities

**Use for**:
- Setting up new secure Google account
- Government websites (IRS, Social Security, Medicare)
- Healthcare portals
- Insurance websites
- Online shopping with saved payment methods
- Any site where she wants passwords saved securely

**What happens when clicked**:
1. Chrome opens to Google sign-in page
2. Window title shows "SECURE GOOGLE SESSION"
3. Can sign into secure Google account
4. Can navigate to any sensitive website
5. All passwords saved to secure Google account

### **🏦 Secure Banking Icon**
**Purpose**: Banking websites only

**Use for**:
- Bank of America
- Credit card websites
- Investment accounts (Fidelity, Vanguard, etc.)
- Loan websites
- Any financial institution

**What happens when clicked**:
1. Warning dialog appears with banking reminders
2. Click "Start Banking" to continue
3. Chrome opens directly to Bank of America
4. Window title shows "SECURE BANKING"
5. Should ONLY visit banking sites in this window

### **Regular Firefox**
**Purpose**: Everything else (non-sensitive browsing)

**Use for**:
- News websites
- Social media
- Entertainment (YouTube, Netflix)
- Email (regular Gmail account)
- Shopping without saving payment info
- Any casual web browsing

---

## Important Rules for Mom

### **Never Mix Banking and Regular Browsing**
- ✅ **Banking**: Use 🏦 Secure Banking icon
- ✅ **Sensitive sites**: Use 🔒 Secure Google icon
- ✅ **Everything else**: Use regular Firefox
- ❌ **Never**: Use regular Firefox for banking
- ❌ **Never**: Browse social media in banking browser

### **Visual Cues to Watch For**
- **Banking browser**: Window title says "SECURE BANKING"
- **Secure Google browser**: Window title says "SECURE GOOGLE SESSION"
- **Different icons**: Secure browsers have special icons
- **Notifications**: System notifications when sessions start/end

### **Password Management**
- **Secure sites**: Let secure Google account save passwords
- **Banking sites**: Use secure Google Password Manager
- **Regular sites**: Let regular Firefox save passwords
- **Never**: Type banking passwords in regular browser

---

## Troubleshooting

### **Desktop Icons Don't Appear**
```bash
# Refresh desktop
killall nautilus
nautilus &

# Or check if files exist
ls -la ~/Desktop/Secure-*.desktop
```

### **Icons Show Question Marks**
```bash
# Run icon creation script
./create-security-icons.sh

# Or check permissions
chmod +x ~/Desktop/Secure-*.desktop
```

### **"Google Chrome not found" Error**
```bash
# Install Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update
sudo apt install google-chrome-stable
```

### **Scripts Won't Run**
```bash
# Make sure all scripts are executable
chmod +x *.sh

# Check if files downloaded correctly
ls -la *.sh
```

### **Banking Icon Shows Zenity Error**
```bash
# Install missing dependency
sudo apt install zenity
```

---

## Security Benefits

### **Complete Isolation**
- **Banking passwords** never touch regular browser
- **Banking history** completely separate
- **No cross-contamination** between secure and regular browsing
- **Fresh session** every time for banking

### **Visual Protection**
- **Clear window titles** prevent confusion
- **Different icons** make it obvious which browser is which
- **Confirmation dialogs** for banking mode
- **Notifications** confirm secure sessions

### **Password Security**
- **Secure Google account** manages all sensitive passwords
- **Banking credentials** isolated from regular accounts
- **No manual password typing** reduces shoulder surfing
- **Password manager** generates strong unique passwords

---

## What Each Script Does

### **setup-secure-browsers.sh**
- Installs required software (Chrome, Firefox, utilities)
- Creates isolated Chrome profile for secure activities
- Generates two desktop icons with different purposes
- Sets up proper file permissions
- Creates security scripts in ~/.local/bin/

### **create-security-icons.sh**
- Creates custom SVG icons for secure browsers
- Updates desktop files to use custom icons
- Makes icons visually distinct from regular browsers

### **test-browser-isolation.sh**
- Verifies all components installed correctly
- Checks for cross-contamination between profiles
- Tests desktop icons and scripts
- Confirms all dependencies are installed

### **cleanup-secure-browsers.sh**
- Removes all secure browser setup
- Optionally deletes secure browser profile
- Cleans up desktop icons and scripts
- Use only if starting over completely

---

## Emergency Procedures

### **If Mom Gets Locked Out of Banking**
1. **Don't panic** - this is recoverable
2. **Use the 🏦 Secure Banking icon** (not regular browser)
3. **Try password reset** on bank website
4. **Call bank customer service** if needed
5. **Have mom call you** if she can't resolve it

### **If Secure Google Account Gets Locked**
1. **Recovery goes to your email/phone** (if set up correctly)
2. **Help mom through recovery process**
3. **Reset passwords** as needed
4. **Re-save passwords** in secure Google account

### **If Icons Stop Working**
1. **Run test script**: `./test-browser-isolation.sh`
2. **Check error messages**
3. **Try running setup again**: `./setup-secure-browsers.sh`
4. **Call for help** if problems persist

### **Complete Reset (Last Resort)**
1. **Run cleanup**: `./cleanup-secure-browsers.sh`
2. **Answer 'yes' to remove secure profile**
3. **Run setup again**: `./setup-secure-browsers.sh`
4. **Mom will need to log back into everything**

---

## Maintenance

### **Monthly Checks**
- Run `./test-browser-isolation.sh` to verify isolation
- Check that banking passwords are saved in secure Google account
- Verify mom is using correct icons for different activities
- Update Chrome/Firefox when prompted

### **When to Reset**
- If cross-contamination detected (banking bookmarks in regular browser)
- If security compromise suspected
- If browsers start behaving strangely
- If icons stop working properly

This setup provides maximum security while keeping the interface simple and familiar for mom!