# Security Incident Response Playbook

**Project**: BelizeVibes.com Tourism Platform  
**Version**: 1.0  
**Last Updated**: August 24, 2025  
**Next Review**: February 24, 2026  

## 🚨 Emergency Quick Actions

### IMMEDIATE (First 5 Minutes)

1. **Assess severity** using Severity Matrix (see below)
2. **Page on-call team** via escalation ladder (see below)
3. **Isolate affected systems** if breach confirmed
4. **Start incident log** with timestamp and initial observations
5. **Activate incident command** structure

### CRITICAL CONTACT INFORMATION

**Primary Escalation (24/7)**:
- **CTO**: [Emergency Phone] | [Emergency Email]
- **Lead Developer**: [Emergency Phone] | [Emergency Email]  
- **Security Team**: security@belizevibes.com | [Emergency Phone]

**Vendor Emergency Contacts**:
- **Supabase**: support@supabase.com
- **Stripe Security**: security@stripe.com
- **Hosting Provider**: [Emergency Support Number]

---

## 📊 Severity Levels & Response Times

### P0 - CRITICAL (< 15 minutes)
**Definition**: Active security breach, data exposure, system compromise
**Examples**:
- Customer payment data exposed
- Admin accounts compromised
- Database breach with PII access
- Complete authentication system failure

**Response Team**: Full incident team, external security consultant if needed
**Communications**: Immediate customer notification may be required

### P1 - HIGH (< 30 minutes)  
**Definition**: Authentication system compromise, active DoS attack, potential data breach
**Examples**:
- Multiple admin login failures
- Sustained DoS attack affecting availability
- Suspicious admin actions detected
- Rate limiting completely bypassed

**Response Team**: Core security team + development lead
**Communications**: Internal stakeholders, prepare customer communications

### P2 - MEDIUM (< 1 hour)
**Definition**: Suspicious activity, failed security controls, monitoring alerts
**Examples**:
- Unusual traffic patterns
- Rate limiting violations trending upward  
- CSP violations indicating potential XSS
- Failed authorization attempts

**Response Team**: Security team + on-call developer
**Communications**: Internal team notifications

### P3 - LOW (< 4 hours)
**Definition**: Policy violations, routine monitoring alerts, security hygiene issues
**Examples**:
- Individual rate limit violations
- CSP violations from browser extensions
- Routine security scan findings
- Documentation security gaps

**Response Team**: Assigned security team member
**Communications**: Internal ticket/logging systems

---

## 🔍 Triage & Evidence Collection

### Initial Assessment (First 15 Minutes)

#### Incident Classification Checklist
- [ ] **Attack Vector Identified**: How did the incident occur?
- [ ] **Affected Systems**: Which components are compromised?
- [ ] **Data at Risk**: What sensitive data could be exposed?
- [ ] **Business Impact**: Customer-facing services affected?
- [ ] **Ongoing Threat**: Is the attack still active?

#### Evidence Collection Commands
```bash
# Security events from last hour
node scripts/security-watch.mjs --last=1h --export=incident-$(date +%Y%m%d-%H%M).json

# System logs
docker logs belize-app --since="1h" > incident-app-logs-$(date +%Y%m%d-%H%M).log

# Database connection logs  
supabase logs --type=api --since="1h" > incident-db-logs-$(date +%Y%m%d-%H%M).log

# Access logs from CDN/load balancer
curl -H "Authorization: Bearer $CDN_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/logs/received?start=$(date -d '1 hour ago' -u +%Y-%m-%dT%H:%M:%SZ)" \
  > incident-access-logs-$(date +%Y%m%d-%H%M).json
```

### Digital Forensics

#### Preserve Evidence
```bash
# Create incident evidence directory
mkdir incident-$(date +%Y%m%d-%H%M)
cd incident-$(date +%Y%m%d-%H%M)

# Capture system state
npm run security:snapshot > system-state.json
git log --oneline -20 > recent-commits.log
ps aux > running-processes.log
netstat -an > network-connections.log
```

#### Database Audit Trail
```sql
-- Recent admin actions (last 24 hours)
SELECT * FROM admin_invitation_audit 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Security events analysis
SELECT event_type, COUNT(*), MIN(created_at), MAX(created_at)
FROM public.security_events 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY event_type
ORDER BY COUNT(*) DESC;

-- Suspicious authentication patterns
SELECT ip_hash, COUNT(*), array_agg(DISTINCT event_type)
FROM public.security_events 
WHERE event_type IN ('auth_anomaly', 'rate_limit_exceeded')
  AND created_at > NOW() - INTERVAL '2 hours'
GROUP BY ip_hash
HAVING COUNT(*) > 10
ORDER BY COUNT(*) DESC;
```

---

## 📢 Communications Templates

### Internal Notification (Slack/Teams)

```
🚨 SECURITY INCIDENT ALERT 🚨

Severity: [P0/P1/P2/P3]
Time: [UTC timestamp]
Incident ID: INC-[YYYYMMDD-HHMM]

SUMMARY:
[Brief description of the incident]

IMPACT:
• Systems affected: [list]
• Customer impact: [Yes/No - details]
• Data at risk: [type and scope]

ACTIONS TAKEN:
• [List immediate actions]

NEXT STEPS:
• [List planned actions with owners and timelines]

Incident Commander: @[name]
War Room: [link/location]

Updates every 30 minutes or as status changes.
```

### Customer Communication (If Required)

**Email Template - Security Notice**:
```
Subject: Important Security Notice - BelizeVibes Account

Dear [Customer Name],

We are writing to inform you of a security incident that may have affected your BelizeVibes account.

WHAT HAPPENED:
[Clear, non-technical explanation]

WHAT INFORMATION WAS AFFECTED:
[Specific data types - be transparent but not alarmist]

WHAT WE ARE DOING:
• Immediately secured the affected systems
• Launched a thorough investigation
• Implemented additional security measures
• Working with security experts and law enforcement if applicable

WHAT YOU SHOULD DO:
1. Change your password immediately
2. Monitor your account for unusual activity
3. Contact us with any concerns

We sincerely apologize for this incident and any inconvenience it may cause.

The BelizeVibes Security Team
security@belizevibes.com
```

### Regulatory Notification (If Required)

**Data Protection Authority Template**:
```
RE: Data Breach Notification - [Incident ID]

Organization: BelizeVibes Tourism Platform
Date of Incident: [Date]
Date of Discovery: [Date]
Date of Notification: [Date - within 72 hours]

INCIDENT SUMMARY:
[Nature of the breach]

DATA SUBJECTS AFFECTED:
Number: [Count]
Categories: [Customer types]

PERSONAL DATA CATEGORIES:
[List specific data types exposed]

LIKELY CONSEQUENCES:
[Assessment of risk to individuals]

MEASURES TAKEN:
[Technical and organizational measures]

CONTACT INFORMATION:
Data Protection Officer: dpo@belizevibes.com
```

---

## 🛠️ Containment Procedures

### Immediate Containment (< 15 minutes)

#### Network Level
```bash
# Block suspicious IP addresses at CDN level
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall/rules" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "X-Auth-Key: $CF_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{
    "action": "block",
    "expression": "(ip.src eq 192.168.1.100)",
    "description": "Security incident block - INC-'$(date +%Y%m%d-%H%M)'"
  }'

# Enable emergency rate limiting
export RATE_LIMIT_EMERGENCY_MODE=true
export RATE_LIMIT_UNAUTH_RPM=10
export RATE_LIMIT_AUTH_RPM=30
```

#### Application Level
```bash
# Enable maintenance mode if necessary
echo "MAINTENANCE_MODE=true" >> .env.production
pm2 restart all

# Disable compromised features temporarily
export DISABLE_ADMIN_REGISTRATION=true
export DISABLE_PAYMENT_PROCESSING=true  # EXTREME ONLY
```

### Database Security
```sql
-- Revoke compromised API keys
UPDATE api_keys SET is_active = false, revoked_at = NOW()
WHERE key_id IN ('compromised_key_1', 'compromised_key_2');

-- Disable compromised user accounts
UPDATE auth.users SET is_active = false 
WHERE id IN ('compromised_user_1', 'compromised_user_2');

-- Enable additional logging
ALTER SYSTEM SET log_statement = 'all';
SELECT pg_reload_conf();
```

---

## 🔄 Eradication & Recovery

### Root Cause Analysis

#### Five Whys Investigation
1. **What happened?** [Primary incident description]
2. **Why did it happen?** [Immediate cause]
3. **Why was that possible?** [Underlying system weakness]
4. **Why wasn't it prevented?** [Control failure]
5. **Why do controls exist in that state?** [Process/training gap]

#### Contributing Factors Analysis
- [ ] **Technical factors**: Software bugs, configuration errors, infrastructure issues
- [ ] **Process factors**: Inadequate procedures, missing controls, training gaps  
- [ ] **Human factors**: User error, social engineering, insider threat
- [ ] **Environmental factors**: Third-party dependencies, supply chain issues

### Recovery Procedures

#### System Restoration Checklist
- [ ] **Verify threat eliminated**: No active attacker presence
- [ ] **Patch vulnerabilities**: Apply security fixes that caused incident
- [ ] **Restore from backups**: If data corruption detected
- [ ] **Update access controls**: Revoke/rotate compromised credentials
- [ ] **Enhanced monitoring**: Add specific detection for this attack type
- [ ] **Gradual restoration**: Bring systems online incrementally
- [ ] **Validation testing**: Confirm security and functionality

#### Backup Restoration
```bash
# Database restoration (if required)
supabase db reset --remote  # EXTREME CAUTION
supabase db push --remote   # Apply latest schema
npm run db:seed:production  # Restore critical data

# Application deployment
git checkout main
npm run build:production
npm run deploy:blue-green  # Zero-downtime deployment
```

---

## 📋 Post-Incident Review

### Incident Report Template

```markdown
# Security Incident Report - [INC-YYYYMMDD-HHMM]

## Executive Summary
[Brief description for leadership]

## Incident Timeline
| Time (UTC) | Event | Action Taken |
|------------|-------|--------------|
| [Time] | [Event] | [Action] |

## Impact Assessment
**Customer Impact**: [Scope and duration]
**Business Impact**: [Revenue, reputation, operations]
**Data Impact**: [Types and volume of data affected]

## Root Cause Analysis
**Primary Cause**: [Technical/process/human factor]
**Contributing Factors**: [List all factors]
**Five Whys Analysis**: [Complete investigation]

## Response Effectiveness  
**What Worked Well**:
• [List successful response elements]

**Areas for Improvement**:
• [List areas needing enhancement]

## Lessons Learned
1. [Key learning #1]
2. [Key learning #2]
3. [Key learning #3]

## Action Items
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| [Action] | [Name] | [Date] | [P0/P1/P2] |
```

### Continuous Improvement Actions

#### Security Enhancements
- [ ] **Technical controls**: New monitoring rules, security patches
- [ ] **Process improvements**: Updated procedures, automation
- [ ] **Training updates**: Team education on new attack vectors  
- [ ] **Testing enhancements**: Incident response drills, security tests

#### Communication Improvements
- [ ] **Internal communications**: Notification improvements, escalation updates
- [ ] **Customer communications**: Template updates, timing improvements
- [ ] **Stakeholder reporting**: Executive dashboard, regulatory updates

#### Documentation Updates
- [ ] **Playbook refinements**: Process improvements based on experience
- [ ] **Contact updates**: Verify and update all emergency contacts
- [ ] **Technical documentation**: System architecture, security controls

---

## 🏃‍♂️ Incident Response Drills

### Monthly Tabletop Exercises

**Scenario 1: Database Breach**
- **Setup**: Simulated SQL injection with customer data access
- **Objectives**: Test containment, communication, legal compliance
- **Duration**: 60 minutes
- **Participants**: Security team, development, legal, PR

**Scenario 2: Admin Account Compromise**  
- **Setup**: Compromised super admin account with suspicious activities
- **Objectives**: Test privilege revocation, system lockdown, investigation
- **Duration**: 45 minutes
- **Participants**: Security team, development, operations

**Scenario 3: DDoS Attack**
- **Setup**: Sustained traffic attack affecting site availability
- **Objectives**: Test traffic filtering, capacity scaling, communications
- **Duration**: 30 minutes  
- **Participants**: Security team, infrastructure, customer support

### Quarterly Full Simulation

**Realistic Attack Simulation**:
- **Red team exercise**: External security team performs realistic attack
- **Blue team response**: Internal team responds using incident procedures
- **Observer evaluation**: Independent assessment of response effectiveness
- **Duration**: 4 hours
- **Follow-up**: Comprehensive post-exercise review and improvements

---

## 📞 Escalation Procedures

### Internal Escalation Matrix

| Time | Role | Responsibility |
|------|------|----------------|
| 0-5 min | First Responder | Initial assessment, evidence preservation |
| 5-15 min | Security Lead | Severity assessment, team activation |
| 15-30 min | Development Lead | Technical analysis, containment support |
| 30-60 min | CTO | Strategic decisions, stakeholder communication |
| 1+ hour | Legal/PR | Regulatory compliance, public communications |

### External Escalation

**When to Escalate Externally**:
- [ ] **P0 incidents**: Always escalate to security vendors and consultants
- [ ] **Data breach**: Legal counsel and regulatory authorities
- [ ] **Payment fraud**: Stripe security team and payment processors
- [ ] **Infrastructure attack**: Cloud provider security teams

**External Response Team Contacts**:
- **Security Consultant**: [Name, Phone, Email]
- **Legal Counsel**: [Firm, Phone, Email]
- **PR Agency**: [Agency, Phone, Email]
- **Cyber Insurance**: [Policy #, Claims Phone]

---

## 🔒 Prevention & Hardening

### Post-Incident Security Improvements

#### Immediate (Within 24 hours)
- [ ] **Patch vulnerabilities** that enabled the incident
- [ ] **Update monitoring rules** to detect similar attacks
- [ ] **Rotate all credentials** potentially exposed
- [ ] **Review access controls** and remove unnecessary permissions

#### Short-term (Within 1 week)
- [ ] **Enhance security testing** with scenarios based on incident
- [ ] **Update security documentation** with lessons learned
- [ ] **Train team members** on new attack vectors and prevention
- [ ] **Review vendor security** if third-party involvement

#### Long-term (Within 1 month)
- [ ] **Architecture review** for systemic security improvements
- [ ] **Security audit** by external firm if warranted
- [ ] **Investment in security tools** based on identified gaps
- [ ] **Process improvements** to prevent similar incidents

---

**Document Control**:
- **Owner**: BelizeVibes Security Team
- **Reviewers**: CTO, Lead Developer, Legal Counsel  
- **Review Cycle**: Quarterly or after each P0/P1 incident
- **Training Requirements**: Annual for all developers, quarterly for security team

*This playbook is a living document that should be updated based on lessons learned from actual incidents and security exercise findings.*