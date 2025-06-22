# Google Voice Setup Guide for Mom's Phone Security

## Overview
Set up Google Voice as a communication bridge that forwards calls to both mom's old Jitterbug and new iPhone, providing communication continuity while maintaining security isolation.

---

## What Google Voice Accomplishes

### **Communication Architecture**
```
Family/Friends/Business
        ↓
Google Voice Number (Public)
        ↓
    Forwards to:
    ├── Mom's new iPhone (secure)
    └── Mom's old Jitterbug (monitored)
```

### **Security Benefits**
- **Number portability**: Can easily move between devices
- **Call screening**: Built-in spam protection
- **Number isolation**: Real iPhone number stays private
- **Monitoring capability**: See all incoming calls/texts
- **Evidence collection**: Log suspicious communications

---

## Prerequisites

### **Before Starting**
- **Mom's existing Google account** (NOT the new secure one)
- **Mom's new iPhone** with Verizon eSIM activated
- **Mom's old Jitterbug** (temporarily active for forwarding)
- **Your phone number** for emergency forwarding
- **Computer access** for initial setup

### **Account Strategy**
**Important**: Use mom's **regular** Google account for Google Voice:
- **NOT the secure banking Google account**
- Use the Gmail she already knows and uses
- This keeps Google Voice separate from banking activities

---

## Step 1: Google Voice Account Creation

### **Initial Setup**
1. **Go to Google Voice**: Open https://voice.google.com
2. **Sign in**: Use mom's existing Google account
3. **Choose number**: Select "Get a Google Voice number"
4. **Pick area code**: Choose mom's local area code or memorable number
5. **Verify identity**: Google may require phone verification

### **Number Selection Strategy**
**Options for Google Voice number:**
- **New memorable number**: Easy for mom to remember (like 555-MOM-HELP)
- **Transfer existing number**: Port mom's current Jitterbug number to Google Voice
- **Local area code**: Matches where mom lives for local recognition

### **Recommended: Transfer Existing Number**
If mom wants to keep her current phone number:
1. **Port Jitterbug number** to Google Voice
2. **Family keeps calling same number** they always have
3. **No confusion** about new numbers
4. **Seamless transition** for existing contacts

---

## Step 2: Forwarding Configuration

### **Basic Forwarding Setup**
1. **Go to Settings**: Click gear icon in Google Voice
2. **Go to "Linked numbers"**: Add forwarding destinations
3. **Add iPhone**: Enter mom's new Verizon eSIM number
4. **Add Jitterbug**: Enter mom's old Jitterbug number (temporarily)
5. **Add your phone**: Your number for emergency backup

### **Forwarding Rules Configuration**
```
Google Voice Number: (555) 123-4567
    ↓
Forwards to:
✅ Mom's iPhone: (555) 987-6543 (Primary)
✅ Mom's Jitterbug: (555) 111-2222 (Temporary monitoring)
✅ Your phone: (555) 999-8888 (Emergency backup)
```

### **Ring Settings**
- **Ring all phones simultaneously**: All phones ring at once
- **Ring time**: 25 seconds before voicemail
- **Voicemail**: Google Voice handles voicemail centrally

---

## Step 3: Mobile App Installation

### **iPhone Google Voice App**
1. **Download**: Install "Google Voice" from App Store
2. **Sign in**: Use mom's Google account
3. **Permissions**: Allow notifications, microphone, contacts
4. **Test calls**: Make test call to verify working

### **App Configuration**
```
Google Voice iPhone App Settings:
✅ Notifications: On (for missed calls/texts)
✅ Call forwarding: On (forwards to iPhone number)
✅ Text forwarding: On (texts appear in app)
✅ Voicemail transcription: On (easier to read)
✅ Spam filtering: On (automatic spam blocking)
```

### **Jitterbug App (Temporary)**
- **Install Google Voice app** on Jitterbug if possible
- **Or use SMS forwarding** for text messages
- **Monitor all activity** on Jitterbug for security analysis

---

## Step 4: Advanced Spam Protection Strategy

### **Reality Check: Google Voice Limitations**
Google Voice has **basic** spam filtering, but it's not enough for mom's situation due to malware breach exposure:

**What GV blocks:**
- Known robocall numbers in Google's database
- Numbers marked as spam by many users
- Some obvious scam patterns

**What still gets through:**
- New scam numbers (not yet in database)
- Local number spoofing (appears local)
- Live scammers with real phones
- Rotating phone farms (constantly changing numbers)

**Result**: Mom will still get 50-70% of spam calls with GV alone

### **Multi-Layer Spam Protection (Recommended)**

#### **Layer 1: Verizon Call Filter (Network Level)**
```
Enable on Verizon Account:
✅ Verizon Call Filter Plus (usually free with unlimited plans)
✅ Blocks known scam numbers before they reach phone
✅ Real-time database updates
✅ Automatic spam/robocall detection
```

#### **Layer 2: Google Voice Ultra-Aggressive Settings**
```
Google Voice Configuration:
✅ Screen ALL unknown callers (not just some)
✅ Block international calls completely
✅ Block premium rate numbers (900, etc.)
✅ Require caller ID for all calls
✅ Block calls with no caller ID
✅ Send non-contacts directly to voicemail (no ringing)
```

#### **Layer 3: iPhone Spam Detection**
```
Install Additional Protection:
✅ Truecaller app (excellent spam database)
✅ OR Hiya app (alternative spam detection)
✅ Enable in Settings → Phone → Call Blocking & Identification

iPhone Native Settings:
✅ Settings → Phone → Silence Unknown Callers (ON)
✅ Settings → Phone → Allow Calls From: Contacts Only
```

#### **Layer 4: Contact Whitelist Strategy**
```
Allow List (Only These Ring Through):
✅ Your phone number (always)
✅ Family members
✅ Doctor's office  
✅ Pharmacy
✅ Known utilities (electric, gas companies)

Block Everything Else:
❌ Unknown numbers go straight to voicemail
❌ No ringing, no interruption
❌ Voicemail transcription shows legitimate calls
```

### **Call Screening Configuration**
```
Google Voice Call Screening Script:
"This call is being screened for security. 
Please state your name and reason for calling after the tone."

Results:
✅ Legitimate callers: State their name
❌ Robocalls: Hang up immediately  
❌ Scammers: Usually hang up or give fake names
```

### **Time-Based Protection Rules**
```
Business Hours (9 AM - 6 PM):
- Family/contacts ring through immediately
- Doctor's office rings through (if in contacts)
- Unknown callers screened (must state name)

Evening (6 PM - 9 PM):  
- Only family/close contacts ring through
- Everything else → voicemail

Night (9 PM - 8 AM):
- Only emergency contacts (your number)
- All other calls silenced completely
```

---

## Step 5: Implementation Timeline for Spam Protection

### **Week 1: Maximum Lockdown**
```
Initial Configuration (Ultra-Restrictive):
1. Enable ALL Google Voice spam protections
2. Set "Silence Unknown Callers" on iPhone
3. Install Truecaller or Hiya app
4. Enable Verizon Call Filter
5. Only known contacts ring through

Expected Result: 95%+ spam reduction, some legitimate calls to voicemail
```

### **Week 2-3: Fine-Tuning**
```
Daily Voicemail Review:
1. Check voicemail transcriptions each morning
2. Identify legitimate callers who went to voicemail
3. Add important numbers to contacts
4. Block any spam numbers that got through
5. Adjust screening sensitivity if needed

Add to Contacts:
- Doctor's office (after they call)
- Pharmacy (when they call with prescription updates)
- Utilities (if they need to call about service)
- Any legitimate business calls
```

### **Week 4+: Monitoring Mode**
```
Ongoing Management:
1. Weekly voicemail review for new legitimate contacts
2. Document spam patterns for analysis
3. Block persistent scam numbers
4. Report egregious spam to carriers
5. Update family on new scam techniques observed
```

---

## Step 6: Contact Migration Strategy

### **Phase 1: Inform Key Contacts (Week 1)**
**High Priority Contacts:**
- **Your phone number**
- **Doctor's office**
- **Pharmacy**
- **Close family members**
- **Emergency contacts**

**Message Template:**
```
"Hi, this is [Mom's name]. I'm updating my phone setup for better security. 
Please use this number for all future calls: (555) 123-4567
This is now my main number. Thanks!"
```

### **Phase 2: Update Services (Week 2-3)**
**Medium Priority Updates:**
- **Utilities**: Electric, gas, water, internet
- **Insurance**: Auto, home, health insurance
- **Banks**: Update with Google Voice number (NOT Verizon eSIM)
- **Healthcare**: All doctors, specialists, hospitals
- **Government**: Non-sensitive services

### **Phase 3: Gradual Updates (Month 2-3)**
**Low Priority Updates:**
- **Shopping accounts**: Amazon, grocery stores
- **Subscriptions**: Magazines, newsletters
- **Social contacts**: Friends, extended family
- **Service providers**: Hair salon, mechanic, etc.

---

## Step 7: Usage Instructions for Mom (Updated for Spam Protection)

### **Daily Phone Usage**
**For making calls:**
1. **Use iPhone normally** for outgoing calls
2. **Or use Google Voice app** to call from GV number
3. **Both work fine** - choose what's easier

**For receiving calls:**
1. **Only known contacts ring** your phone
2. **Unknown callers go to voicemail** automatically
3. **No interruption** from spam calls
4. **Check voicemail transcripts** once per day

### **What Mom Will Experience**
```
Before Spam Protection:
📞 Ring Ring Ring (spam call)
📞 Ring Ring Ring (robocall)  
📞 Ring Ring Ring (scammer)
📞 Ring Ring Ring (legitimate call)

After Spam Protection:
📞 Ring Ring Ring (your call - always through)
📞 Ring Ring Ring (doctor's office - in contacts)
🔇 Spam calls silenced → voicemail
🔇 Unknown callers → voicemail (check transcripts)
```

### **Voicemail Management**
**Daily routine for mom:**
1. **Check Google Voice app** once per day
2. **Read voicemail transcripts** (faster than listening)
3. **Call back** any legitimate missed calls
4. **Tell you** about any suspicious voicemails

**Red flags in voicemails:**
- Claims about prizes, lotteries, or free money
- Urgent requests for personal information
- Threats about accounts being closed
- Poor quality audio or robotic voices
- Requests to call premium numbers

### **Adding New Contacts**
**When legitimate caller goes to voicemail:**
1. **Listen to voicemail** or read transcript
2. **Verify caller identity** (call back official number)
3. **Add to iPhone contacts** if legitimate
4. **Next call from that number** will ring through

**Important**: Never add numbers that:
- Left suspicious voicemails
- Asked for personal information
- Claimed urgent account problems
- Offered prizes or deals

---

## Step 8: Security Monitoring and Threat Analysis

### **What You Can Monitor**
**Call logs:**
- **All incoming calls** to Google Voice number (blocked and allowed)
- **Spam call patterns** and frequency analysis
- **New attack numbers** targeting mom
- **Time patterns** of scam attempts

**Blocked spam analysis:**
- **Geographic origins** of spam calls
- **Number patterns** (sequential, spoofed local, etc.)
- **Call frequency** from same sources
- **Escalation patterns** (increasing call volume)

**Text message monitoring:**
- **All text messages** to Google Voice number
- **Phishing attempt detection** (malicious links)
- **Social engineering attempts** (urgent requests)
- **Scam evolution** (new techniques being tried)

### **Red Flags to Watch For**
```
Escalating Threat Patterns:
⚠️ Sudden increase in spam call volume
⚠️ Calls specifically targeting mom's interests/age
⚠️ Persistent calls from same number after blocking
⚠️ Sophisticated local number spoofing
⚠️ Calls claiming to be from her bank/doctor

Advanced Scam Indicators:
⚠️ Callers who know personal information about mom
⚠️ References to recent purchases or accounts
⚠️ Calls claiming to "verify" recent security changes
⚠️ Urgent demands for immediate action
⚠️ Requests to install remote access software
```

### **Evidence Collection**
**Document for threat analysis:**
- **Screenshot spam call logs** weekly
- **Save suspicious voicemail transcripts**
- **Record new scam techniques** being attempted
- **Track effectiveness** of blocking measures
- **Correlate with Jitterbug activity** (same attackers?)

### **Spam Pattern Analysis**
```
Weekly Review Questions:
1. How many spam calls blocked this week?
2. Are attackers trying new number patterns?
3. Any calls that bypassed all filters?
4. What time of day are most attacks?
5. Any correlation with mom's online activity?
6. Are scammers getting more sophisticated?
```

---

## Step 8: Advanced Configuration

### **Business Hours Settings**
```
Weekdays (9 AM - 6 PM):
- Ring all phones simultaneously
- Voicemail after 25 seconds

Evenings (6 PM - 9 PM):
- Ring all phones
- Shorter ring time (15 seconds)

Late Night (9 PM - 8 AM):
- Send directly to voicemail (unless in contacts)
- Emergency contacts can still ring through
```

### **Do Not Disturb Integration**
- **Sync with iPhone**: Honor iPhone's Do Not Disturb settings
- **Important callers**: Your number always rings through
- **Emergency bypass**: Family members can call twice to override
- **Weekend settings**: Different rules for weekends

### **International Call Blocking**
```
Security Settings:
✅ Block international calls (unless family traveling)
✅ Block premium rate numbers (900, etc.)
✅ Block numbers with no caller ID
✅ Require caller ID for all calls
```

---

## Step 9: Transition Timeline

### **Week 1: Parallel Operation**
- **Both phones active**: Jitterbug and iPhone both ring
- **Google Voice number**: Give to immediate family only
- **Monitor usage**: Make sure everything works correctly
- **Test all features**: Calls, texts, voicemail

### **Week 2-3: Contact Migration**
- **Update key contacts**: Medical, emergency, family
- **Service updates**: Banks, utilities, important services
- **Gradual transition**: People start using Google Voice number
- **Monitor patterns**: Watch for suspicious activity

### **Week 4+: Jitterbug Isolation**
- **Remove Jitterbug** from Google Voice forwarding
- **Keep active** for monitoring purposes only
- **Document activity**: Any calls/texts to old number
- **Analysis**: What attackers are still trying

---

## Step 10: Troubleshooting

### **Common Issues**

**Google Voice number not ringing iPhone:**
```bash
# Check forwarding settings
# Verify iPhone number entered correctly
# Test with direct call to iPhone number
# Check iPhone "Do Not Disturb" settings
```

**Poor call quality:**
```bash
# Use iPhone's regular phone app instead of GV app
# Check WiFi vs cellular connection quality
# Update Google Voice app
# Restart iPhone
```

**Texts not appearing:**
```bash
# Check Google Voice app notifications
# Verify SMS forwarding settings
# Update Google Voice app
# Check iPhone message filtering settings
```

**Voicemail not working:**
```bash
# Check Google Voice voicemail settings
# Verify greeting is recorded
# Test voicemail with known caller
# Check transcription settings
```

---

## Step 11: Integration with Overall Security

### **Banking Phone Strategy**
**Important**: Banking 2FA should use **Verizon eSIM number**, NOT Google Voice:
- **Bank of America 2FA**: Verizon eSIM number
- **Credit card 2FA**: Verizon eSIM number
- **Investment accounts**: Verizon eSIM number
- **Government accounts**: Verizon eSIM number

### **Why This Separation Matters**
- **Google Voice**: Public-facing, family communication
- **Verizon eSIM**: Private, secure, banking only
- **Attack surface**: Google Voice can be targeted, Verizon number stays hidden
- **Recovery control**: You control Verizon number recovery

### **Emergency Procedures**
**If Google Voice compromised:**
1. **Change Google account password** immediately
2. **Remove suspicious forwarding** numbers
3. **Check call/text logs** for unauthorized activity
4. **Notify family** of temporary number change
5. **Banking unaffected**: Still works on Verizon eSIM

**If iPhone lost/stolen:**
1. **Google Voice still works** on other devices
2. **Remove iPhone** from forwarding temporarily
3. **Add replacement phone** to forwarding
4. **Call history preserved** in Google Voice
5. **No communication interruption**

---

## Step 12: Spam Protection Results and Expectations

### **Expected Spam Reduction**
```
Before Multi-Layer Protection:
📊 Mom receives: 15-25 spam calls per day
📊 Stress level: High (constant interruption)
📊 Risk level: High (likely to answer scammer)

After Multi-Layer Protection:
📊 Spam calls that ring: 1-2 per week
📊 Spam calls blocked: 95-98%
📊 Stress level: Low (phone only rings for known contacts)
📊 Risk level: Very low (scammers can't reach her)
```

### **First Month Timeline**
```
Week 1: Adjustment Period
- Spam calls drop dramatically
- Some legitimate calls go to voicemail
- Mom checks voicemails daily
- You help add important contacts

Week 2-3: Fine-Tuning
- Add missed legitimate callers to contacts
- Block any spam that gets through
- Mom gets comfortable with new routine
- Family learns new communication patterns

Week 4+: Steady State
- Only known contacts ring through
- Occasional legitimate unknown caller → voicemail
- Minimal spam interruption
- Mom has peaceful phone experience
```

### **What Mom Will Notice**
```
Positive Changes:
✅ Phone rarely rings with spam
✅ Can answer calls confidently (known contacts only)
✅ No more interruptions during meals/TV
✅ Less stress about unknown callers
✅ Voicemail transcripts easy to read

Adjustments Needed:
⚠️ Some doctor's offices need to be added to contacts
⚠️ Service appointments may go to voicemail first
⚠️ New businesses need to leave voicemail
⚠️ Must check voicemail daily for legitimate calls
```

### **Long-Term Benefits**
- **Scammer frustration**: Attackers stop calling numbers they can't reach
- **Pattern disruption**: Breaks mom's number from active scam lists
- **Stress reduction**: No more anxiety about answering phone
- **Security improvement**: Can't be tricked by calls she never receives
- **Quality of life**: Phone becomes useful tool, not source of harassment

### **Backup Plans**
**If mom misses important calls:**
- **Voicemail transcription** makes checking messages easy
- **Your number always rings through** for emergencies
- **Google Voice web interface** shows all activity
- **Can temporarily disable screening** if needed for expected calls

**If spam adapts and gets through:**
- **Additional apps** available (RoboKiller, etc.)
- **Carrier-level upgrades** (premium spam blocking)
- **Number change** as last resort (Google Voice makes this easy)
- **AI monitoring** will detect new attack patterns

This multi-layer approach transforms mom's phone from "constant spam target" to "secure family communication tool" while providing valuable intelligence about ongoing attacks.